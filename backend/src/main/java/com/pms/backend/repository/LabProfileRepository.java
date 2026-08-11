package com.pms.backend.repository;

import com.pms.backend.entity.LabProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LabProfileRepository extends JpaRepository<LabProfile, Long> {
    Optional<LabProfile> findByUserId(Long userId);
}