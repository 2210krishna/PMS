package com.pms.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.pms.backend.dto.PrescriptionRequest;
import com.pms.backend.dto.PrescriptionResponse;
import com.pms.backend.security.CustomUserDetails;
import com.pms.backend.service.PrescriptionService;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping
    public ResponseEntity<PrescriptionResponse> create(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody PrescriptionRequest request) {
        return ResponseEntity.ok(prescriptionService.create(request, principal.getUser().getId()));
    }

    @GetMapping("/patient/{healthId}")
    public ResponseEntity<List<PrescriptionResponse>> byPatient(@PathVariable String healthId) {
        return ResponseEntity.ok(prescriptionService.getByHealthId(healthId));
    }
}