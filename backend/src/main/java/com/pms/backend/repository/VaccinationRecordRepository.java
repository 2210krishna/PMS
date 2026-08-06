package com.pms.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pms.backend.entity.VaccinationRecord;

import java.util.List;

public interface VaccinationRecordRepository extends JpaRepository<VaccinationRecord, Long> {
    List<VaccinationRecord> findByPatientIdOrderByDateGivenDesc(Long patientId);
}