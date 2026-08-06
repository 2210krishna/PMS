package com.pms.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pms.backend.entity.OutbreakAlert;

import java.util.List;
import java.util.Optional;

public interface OutbreakAlertRepository extends JpaRepository<OutbreakAlert, Long> {
    List<OutbreakAlert> findByStatusOrderByDetectedAtDesc(String status);
    Optional<OutbreakAlert> findByDiseaseTypeAndDistrictAndStatus(
            String diseaseType, String district, String status);
}