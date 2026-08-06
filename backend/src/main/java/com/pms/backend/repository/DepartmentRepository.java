package com.pms.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pms.backend.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}