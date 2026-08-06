package com.pms.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pms.backend.dto.MedicalRecordRequest;
import com.pms.backend.dto.MedicalRecordResponse;
import com.pms.backend.entity.*;
import com.pms.backend.repository.MedicalRecordRepository;
import com.pms.backend.repository.OutbreakAlertRepository;
import com.pms.backend.repository.PatientRepository;
import com.pms.backend.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private static final int OUTBREAK_THRESHOLD = 3;
    private static final int OUTBREAK_WINDOW_DAYS = 30;

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final OutbreakAlertRepository outbreakAlertRepository;
    private final AuditLogService auditLogService;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Transactional
    public MedicalRecordResponse addRecord(MedicalRecordRequest req, Long doctorUserId) {

        Patient patient = patientRepository.findByHealthId(req.getHealthId())
                .orElseThrow(() -> new IllegalArgumentException("No patient found with this Health ID"));

        if (!"VERIFIED".equals(patient.getVerificationStatus())) {
            throw new IllegalArgumentException("This patient has not been verified by an admin yet.");
        }

        User doctor = userRepository.findById(doctorUserId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setDiseaseType(req.getDiseaseType());
        record.setDiagnosisNotes(req.getDiagnosisNotes());
        record.setPrescriptionText(req.getPrescriptionText());
        record.setDistrict(patient.getLocation());
                record.setCreatedAt(LocalDateTime.now());

        MedicalRecord saved = medicalRecordRepository.save(record);

        auditLogService.log(doctor, "CREATE", "MedicalRecord", saved.getId());

        checkForOutbreak(saved.getDiseaseType(), saved.getDistrict());

        return toResponse(saved);
    }

    public List<MedicalRecordResponse> getHistoryByHealthId(String healthId) {
        Patient patient = patientRepository.findByHealthId(healthId)
                .orElseThrow(() -> new IllegalArgumentException("No patient found with this Health ID"));

        return medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId())
                .stream().map(this::toResponse).toList();
    }

    private void checkForOutbreak(String diseaseType, String district) {
        LocalDateTime windowStart = LocalDateTime.now().minusDays(OUTBREAK_WINDOW_DAYS);
        LocalDateTime windowEnd = LocalDateTime.now();

        List<MedicalRecord> matches = medicalRecordRepository
                .findByDiseaseTypeAndDistrictAndCreatedAtBetween(diseaseType, district, windowStart, windowEnd);

        if (matches.size() >= OUTBREAK_THRESHOLD) {
            boolean alreadyOpen = outbreakAlertRepository
                    .findByDiseaseTypeAndDistrictAndStatus(diseaseType, district, "OPEN")
                    .isPresent();

            if (!alreadyOpen) {
                OutbreakAlert alert = new OutbreakAlert();
                alert.setDiseaseType(diseaseType);
                alert.setDistrict(district);
                alert.setCaseCount(matches.size());
                alert.setWindowStart(LocalDate.now().minusDays(OUTBREAK_WINDOW_DAYS));
                alert.setWindowEnd(LocalDate.now());
                alert.setStatus("OPEN");
                alert.setDetectedAt(LocalDateTime.now());
                outbreakAlertRepository.save(alert);
            } else {
                outbreakAlertRepository
                        .findByDiseaseTypeAndDistrictAndStatus(diseaseType, district, "OPEN")
                        .ifPresent(alert -> {
                            alert.setCaseCount(matches.size());
                            outbreakAlertRepository.save(alert);
                        });
            }
        }
    }

    private MedicalRecordResponse toResponse(MedicalRecord r) {
        return new MedicalRecordResponse(
                r.getId(), r.getPatient().getHealthId(), r.getPatient().getUser().getFullName(),
                r.getDoctor().getFullName(), r.getDiseaseType(), r.getDiagnosisNotes(),
                r.getPrescriptionText(), r.getDistrict(), r.getCreatedAt().format(FMT)
        );
    }
}