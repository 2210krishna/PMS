package com.pms.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.pms.backend.dto.*;
import com.pms.backend.entity.OutbreakAlert;
import com.pms.backend.entity.Role;
import com.pms.backend.entity.User;
import com.pms.backend.repository.AppointmentRepository;
import com.pms.backend.repository.MedicalRecordRepository;
import com.pms.backend.repository.OutbreakAlertRepository;
import com.pms.backend.repository.PatientRepository;
import com.pms.backend.repository.UserRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final OutbreakAlertRepository outbreakAlertRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public List<UserSummaryResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserSummaryResponse(u.getId(), u.getFullName(), u.getEmail(), u.getRole().name(), u.isEnabled()))
                .toList();
    }

    public UserSummaryResponse toggleUserEnabled(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Admin accounts cannot be disabled");
        }
    
        user.setEnabled(!user.isEnabled());
        User saved = userRepository.save(user);
        return new UserSummaryResponse(saved.getId(), saved.getFullName(), saved.getEmail(), saved.getRole().name(), saved.isEnabled());
    }

    public List<OutbreakAlertResponse> getAlerts(String status) {
        List<OutbreakAlert> alerts = status != null
                ? outbreakAlertRepository.findByStatusOrderByDetectedAtDesc(status)
                : outbreakAlertRepository.findAll();

        return alerts.stream().map(a -> new OutbreakAlertResponse(
                a.getId(), a.getDiseaseType(), a.getDistrict(), a.getCaseCount(),
                a.getWindowStart().toString(), a.getWindowEnd().toString(),
                a.getStatus(), a.getDetectedAt().format(FMT)
        )).toList();
    }

    public OutbreakAlertResponse resolveAlert(Long alertId) {
        OutbreakAlert alert = outbreakAlertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found"));
        alert.setStatus("RESOLVED");
        OutbreakAlert saved = outbreakAlertRepository.save(alert);
        return new OutbreakAlertResponse(
                saved.getId(), saved.getDiseaseType(), saved.getDistrict(), saved.getCaseCount(),
                saved.getWindowStart().toString(), saved.getWindowEnd().toString(),
                saved.getStatus(), saved.getDetectedAt().format(FMT)
        );
    }

    public List<DiseaseCountResponse> getDiseaseCounts() {
        Map<String, Long> counts = medicalRecordRepository.findAll().stream()
                .collect(Collectors.groupingBy(r -> r.getDiseaseType(), Collectors.counting()));
        return counts.entrySet().stream()
                .map(e -> new DiseaseCountResponse(e.getKey(), e.getValue()))
                .toList();
    }

    public List<DistrictCountResponse> getDistrictCounts() {
        Map<String, Long> counts = medicalRecordRepository.findAll().stream()
                .collect(Collectors.groupingBy(r -> r.getDistrict(), Collectors.counting()));
        return counts.entrySet().stream()
                .map(e -> new DistrictCountResponse(e.getKey(), e.getValue()))
                .toList();
    }

    public DashboardStatsResponse getDashboardStats() {
        long totalDoctors = userRepository.findAll().stream().filter(u -> u.getRole() == Role.DOCTOR).count();
        long totalPatients = patientRepository.count();

        LocalDate today = LocalDate.now();
        long appointmentsToday = appointmentRepository.countByAppointmentDate(today);
        long appointmentsCompletedToday = appointmentRepository.countByAppointmentDateAndStatus(today, "COMPLETED");
        long patientsBookedToday = appointmentRepository.findByAppointmentDate(today).stream()
                .map(a -> a.getPatient().getId())
                .distinct()
                .count();

        return new DashboardStatsResponse(totalDoctors, totalPatients, appointmentsToday, appointmentsCompletedToday, patientsBookedToday);
    }
}