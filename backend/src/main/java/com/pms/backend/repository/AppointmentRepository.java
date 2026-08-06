package com.pms.backend.repository;

import com.pms.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdOrderByAppointmentDateDesc(Long patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDesc(Long doctorId);
    List<Appointment> findAllByOrderByAppointmentDateDesc();
    List<Appointment> findByAppointmentDate(LocalDate date);
    long countByAppointmentDate(LocalDate date);
    long countByAppointmentDateAndStatus(LocalDate date, String status);
    boolean existsByDoctorIdAndAppointmentDateAndTimeSlotAndStatus(Long doctorId, LocalDate date, String timeSlot, String status);
}