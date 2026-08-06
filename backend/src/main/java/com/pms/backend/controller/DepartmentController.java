package com.pms.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pms.backend.dto.DepartmentRequest;
import com.pms.backend.dto.DepartmentResponse;
import com.pms.backend.dto.DoctorProfileResponse;
import com.pms.backend.service.DepartmentService;
import com.pms.backend.service.DoctorProfileService;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;
    private final DoctorProfileService doctorProfileService;

    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAll() {
        return ResponseEntity.ok(departmentService.getAll());
    }

    @PostMapping
    public ResponseEntity<DepartmentResponse> create(@Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(departmentService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        departmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/doctors")
    public ResponseEntity<List<DoctorProfileResponse>> doctorsInDepartment(@PathVariable Long id) {
        return ResponseEntity.ok(doctorProfileService.getDoctorsByDepartment(id));
    }
}