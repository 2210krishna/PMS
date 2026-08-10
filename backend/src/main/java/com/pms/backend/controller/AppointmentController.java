package com.pms.backend.controller;

import com.pms.backend.dto.AppointmentRequest;
import com.pms.backend.dto.AppointmentResponse;
import com.pms.backend.security.CustomUserDetails;
import com.pms.backend.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> book(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.book(principal.getUser().getId(), request));
    }

    @GetMapping("/me/as-patient")
    public ResponseEntity<List<AppointmentResponse>> myAsPatient(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(appointmentService.getMyAppointmentsAsPatient(principal.getUser().getId()));
    }

    @GetMapping("/me/as-doctor")
    public ResponseEntity<List<AppointmentResponse>> myAsDoctor(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(appointmentService.getMyAppointmentsAsDoctor(principal.getUser().getId()));
    }

    @GetMapping("/today")
    public ResponseEntity<List<AppointmentResponse>> today() {
        return ResponseEntity.ok(appointmentService.getTodayAppointments());
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> all() {
        return ResponseEntity.ok(appointmentService.getAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }
}