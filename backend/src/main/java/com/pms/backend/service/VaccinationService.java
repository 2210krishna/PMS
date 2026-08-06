package com.pms.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.pms.backend.dto.VaccinationRequest;
import com.pms.backend.dto.VaccinationResponse;
import com.pms.backend.entity.Patient;
import com.pms.backend.entity.User;
import com.pms.backend.entity.VaccinationRecord;
import com.pms.backend.repository.PatientRepository;
import com.pms.backend.repository.UserRepository;
import com.pms.backend.repository.VaccinationRecordRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VaccinationService {

    private final VaccinationRecordRepository vaccinationRecordRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public VaccinationResponse addVaccination(VaccinationRequest req, Long doctorUserId) {
        Patient patient = patientRepository.findByHealthId(req.getHealthId())
                .orElseThrow(() -> new IllegalArgumentException("No patient found with this Health ID"));

        User doctor = userRepository.findById(doctorUserId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        VaccinationRecord record = new VaccinationRecord();
        record.setPatient(patient);
        record.setVaccineName(req.getVaccineName());
        record.setDoseNumber(req.getDoseNumber());
        record.setDateGiven(LocalDate.parse(req.getDateGiven()));
        record.setAdministeredBy(doctor);

        VaccinationRecord saved = vaccinationRecordRepository.save(record);
        auditLogService.log(doctor, "CREATE", "VaccinationRecord", saved.getId());
        return toResponse(saved);
    }

    public List<VaccinationResponse> getHistoryByHealthId(String healthId) {
        Patient patient = patientRepository.findByHealthId(healthId)
                .orElseThrow(() -> new IllegalArgumentException("No patient found with this Health ID"));
        return vaccinationRecordRepository.findByPatientIdOrderByDateGivenDesc(patient.getId())
                .stream().map(this::toResponse).toList();
    }

    private VaccinationResponse toResponse(VaccinationRecord v) {
        return new VaccinationResponse(
                v.getId(), v.getPatient().getHealthId(), v.getVaccineName(), v.getDoseNumber(),
                v.getDateGiven().toString(),
                v.getAdministeredBy() != null ? v.getAdministeredBy().getFullName() : null
        );
    }
}