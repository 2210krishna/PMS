package com.pms.backend.service;

import com.pms.backend.dto.AppointmentRequest;
import com.pms.backend.dto.AppointmentResponse;
import com.pms.backend.entity.*;
import com.pms.backend.repository.AppointmentRepository;
import com.pms.backend.repository.DepartmentRepository;
import com.pms.backend.repository.PatientRepository;
import com.pms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationService notificationService;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("h:mm a", java.util.Locale.ENGLISH);
    public AppointmentResponse book(Long patientUserId, AppointmentRequest req) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));

        if (!"VERIFIED".equals(patient.getVerificationStatus())) {
            throw new IllegalArgumentException("Your account must be verified by an admin before booking appointments");
        }

        User doctor = userRepository.findById(req.getDoctorUserId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Department department = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));

        LocalDate date = LocalDate.parse(req.getAppointmentDate());
        if (date.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Appointment date cannot be in the past");
        }

        if (date.isEqual(LocalDate.now())) {
            LocalTime slotStart = parseSlotStart(req.getTimeSlot());
            if (!slotStart.isAfter(LocalTime.now())) {
                throw new IllegalArgumentException("Selected time slot has already passed today. Please choose a later slot.");
            }
        }

        boolean slotTaken = appointmentRepository.existsByDoctorIdAndAppointmentDateAndTimeSlotAndStatus(
                doctor.getId(), date, req.getTimeSlot(), "CONFIRMED");
        if (slotTaken) {
            throw new IllegalArgumentException("This time slot is already booked for the selected doctor. Please choose another slot.");
        }

        Appointment appt = new Appointment();
        appt.setPatient(patient);
        appt.setDoctor(doctor);
        appt.setDepartment(department);
        appt.setAppointmentDate(date);
        appt.setTimeSlot(req.getTimeSlot());
        appt.setReason(req.getReason());
        appt.setStatus("CONFIRMED");

        Appointment saved = appointmentRepository.save(appt);

        notificationService.notify(doctor,
                "New appointment booked by " + patient.getUser().getFullName() + " on " + date + " at " + req.getTimeSlot());

        return toResponse(saved);
    }

    public List<AppointmentResponse> getMyAppointmentsAsPatient(Long patientUserId) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));
        return sortedNewestFirst(appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patient.getId()));
    }

    public List<AppointmentResponse> getMyAppointmentsAsDoctor(Long doctorUserId) {
        return sortedNewestFirst(appointmentRepository.findByDoctorIdOrderByAppointmentDateDesc(doctorUserId));
    }

    public List<AppointmentResponse> getTodayAppointments() {
        return sortedAscending(appointmentRepository.findByAppointmentDate(LocalDate.now()));
    }

    public List<AppointmentResponse> getAll() {
        return sortedNewestFirst(appointmentRepository.findAllByOrderByAppointmentDateDesc());
    }

    public AppointmentResponse updateStatus(Long appointmentId, String status) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        String newStatus = status.toUpperCase();

        if (newStatus.equals("COMPLETED") && appt.getAppointmentDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot mark a future appointment as completed. Please wait until the appointment date.");
        }

        appt.setStatus(newStatus);
        Appointment saved = appointmentRepository.save(appt);

        notificationService.notify(appt.getPatient().getUser(),
                "Your appointment with Dr. " + appt.getDoctor().getFullName() + " on " + appt.getAppointmentDate() +
                " is now " + newStatus);

        return toResponse(saved);
    }

    private LocalTime parseSlotStart(String timeSlot) {
        try {
            String startPart = timeSlot.split("-")[0].trim();
            return LocalTime.parse(startPart, TIME_FMT);
        } catch (Exception e) {
            return LocalTime.MIDNIGHT;
        }
    }

    private List<AppointmentResponse> sortedNewestFirst(List<Appointment> list) {
        return list.stream()
                .sorted(Comparator.comparing(Appointment::getAppointmentDate)
                        .thenComparing((Appointment a) -> parseSlotStart(a.getTimeSlot()))
                        .reversed())
                .map(this::toResponse)
                .toList();
    }

    private List<AppointmentResponse> sortedAscending(List<Appointment> list) {
        return list.stream()
                .sorted(Comparator.comparing(Appointment::getAppointmentDate)
                        .thenComparing((Appointment a) -> parseSlotStart(a.getTimeSlot())))
                .map(this::toResponse)
                .toList();
    }

    private AppointmentResponse toResponse(Appointment a) {
        return new AppointmentResponse(
                a.getId(), a.getPatient().getHealthId(), a.getPatient().getUser().getFullName(),
                a.getDoctor().getId(), a.getDoctor().getFullName(), a.getDepartment().getName(),
                a.getAppointmentDate().toString(), a.getTimeSlot(), a.getReason(), a.getStatus(),
                a.getCreatedAt().format(FMT)
        );
    }
}