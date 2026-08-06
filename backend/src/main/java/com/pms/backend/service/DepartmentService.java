package com.pms.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.pms.backend.dto.DepartmentRequest;
import com.pms.backend.dto.DepartmentResponse;
import com.pms.backend.entity.Department;
import com.pms.backend.repository.DepartmentRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentResponse create(DepartmentRequest req) {
        Department d = new Department();
        d.setName(req.getName());
        d.setDescription(req.getDescription());
        Department saved = departmentRepository.save(d);
        return toResponse(saved);
    }

    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public void delete(Long id) {
        departmentRepository.deleteById(id);
    }

    private DepartmentResponse toResponse(Department d) {
        return new DepartmentResponse(d.getId(), d.getName(), d.getDescription());
    }
}