package com.pms.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.pms.backend.dto.*;
import com.pms.backend.entity.Role;
import com.pms.backend.entity.User;
import com.pms.backend.repository.AppointmentRepository;
import com.pms.backend.repository.PatientRepository;
import com.pms.backend.repository.UserRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

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

        long confirmed = appointmentRepository.countByStatus("CONFIRMED");
        long completed = appointmentRepository.countByStatus("COMPLETED");
        long cancelled = appointmentRepository.countByStatus("CANCELLED");

        return new DashboardStatsResponse(totalDoctors, totalPatients, appointmentsToday,
                appointmentsCompletedToday, patientsBookedToday, confirmed, completed, cancelled);
    }
}