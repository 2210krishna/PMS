package com.pms.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pms.backend.entity.MedicalRecord;

import java.time.LocalDateTime;
import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<MedicalRecord> findByDiseaseTypeAndDistrictAndCreatedAtBetween(
            String diseaseType, String district, LocalDateTime start, LocalDateTime end);
    List<MedicalRecord> findByCreatedAtAfter(LocalDateTime since);
}