package com.pms.backend.repository;

import com.pms.backend.entity.MedicalFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalFileRepository extends JpaRepository<MedicalFile, Long> {
    List<MedicalFile> findByPrescriptionIdOrderByUploadedAtDesc(Long prescriptionId);
}