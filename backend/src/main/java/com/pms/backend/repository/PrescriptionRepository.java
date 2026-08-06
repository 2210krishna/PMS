package com.pms.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pms.backend.entity.Prescription;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientIdOrderByCreatedAtDesc(Long patientId);
}