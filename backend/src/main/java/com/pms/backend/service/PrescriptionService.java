package com.pms.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.pms.backend.dto.*;
import com.pms.backend.entity.*;
import com.pms.backend.repository.AppointmentRepository;
import com.pms.backend.repository.PatientRepository;
import com.pms.backend.repository.PrescriptionRepository;
import com.pms.backend.repository.UserRepository;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public PrescriptionResponse create(PrescriptionRequest req, Long doctorUserId) {
        Patient patient = patientRepository.findByHealthId(req.getHealthId())
                .orElseThrow(() -> new IllegalArgumentException("No patient found with this Health ID"));

        User doctor = userRepository.findById(doctorUserId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setNotes(req.getNotes());

        if (req.getAppointmentId() != null) {
            Appointment appt = appointmentRepository.findById(req.getAppointmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
            prescription.setAppointment(appt);
            appt.setStatus("COMPLETED");
            appointmentRepository.save(appt);
        }

        List<PrescriptionItem> items = req.getItems().stream().map(dto -> {
            PrescriptionItem item = new PrescriptionItem();
            item.setPrescription(prescription);
            item.setMedicineName(dto.getMedicineName());
            item.setDosage(dto.getDosage());
            item.setQuantity(dto.getQuantity());
            item.setUnitPrice(dto.getUnitPrice());
            return item;
        }).toList();

        prescription.setItems(items);

        Prescription saved = prescriptionRepository.save(prescription);
        notificationService.notify(patient.getUser(),
        "Dr. " + doctor.getFullName() + " issued a new prescription for you.");
        return toResponse(saved);
    }

    public List<PrescriptionResponse> getByHealthId(String healthId) {
        Patient patient = patientRepository.findByHealthId(healthId)
                .orElseThrow(() -> new IllegalArgumentException("No patient found with this Health ID"));
        return prescriptionRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId())
                .stream().map(this::toResponse).toList();
    }

    private PrescriptionResponse toResponse(Prescription p) {
        List<PrescriptionItemDto> itemDtos = p.getItems().stream().map(i -> {
            PrescriptionItemDto dto = new PrescriptionItemDto();
            dto.setMedicineName(i.getMedicineName());
            dto.setDosage(i.getDosage());
            dto.setQuantity(i.getQuantity());
            dto.setUnitPrice(i.getUnitPrice());
            return dto;
        }).toList();

        double total = itemDtos.stream().mapToDouble(i -> i.getQuantity() * i.getUnitPrice()).sum();

        return new PrescriptionResponse(
                p.getId(), p.getPatient().getHealthId(), p.getPatient().getUser().getFullName(),
                p.getDoctor().getFullName(), p.getNotes(), itemDtos, total,
                p.getCreatedAt().format(FMT)
        );
    }
}