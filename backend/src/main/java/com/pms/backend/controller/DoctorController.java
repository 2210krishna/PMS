package com.pms.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.pms.backend.dto.*;
import com.pms.backend.security.CustomUserDetails;
import com.pms.backend.service.DoctorProfileService;
import com.pms.backend.service.MedicalRecordService;
import com.pms.backend.service.VaccinationService;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorProfileService doctorProfileService;
    private final MedicalRecordService medicalRecordService;
    private final VaccinationService vaccinationService;

    @PostMapping("/records")
    public ResponseEntity<MedicalRecordResponse> addRecord(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody MedicalRecordRequest request) {
        return ResponseEntity.ok(medicalRecordService.addRecord(request, principal.getUser().getId()));
    }

    @GetMapping("/records/{healthId}")
    public ResponseEntity<List<MedicalRecordResponse>> getHistory(@PathVariable String healthId) {
        return ResponseEntity.ok(medicalRecordService.getHistoryByHealthId(healthId));
    }

    @PostMapping("/vaccinations")
    public ResponseEntity<VaccinationResponse> addVaccination(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody VaccinationRequest request) {
        return ResponseEntity.ok(vaccinationService.addVaccination(request, principal.getUser().getId()));
    }

    @GetMapping("/vaccinations/{healthId}")
    public ResponseEntity<List<VaccinationResponse>> getVaccinationHistory(@PathVariable String healthId) {
        return ResponseEntity.ok(vaccinationService.getHistoryByHealthId(healthId));
    }

    @GetMapping("/directory")
    public ResponseEntity<List<DoctorProfileResponse>> directory() {
        return ResponseEntity.ok(doctorProfileService.getAllDoctors());
    }

    @GetMapping("/profile/me")
    public ResponseEntity<DoctorProfileResponse> getMyDoctorProfile(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(doctorProfileService.getMyProfile(principal.getUser().getId()));
    }

    @PutMapping("/profile/me")
    public ResponseEntity<DoctorProfileResponse> completeMyDoctorProfile(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody CompleteDoctorProfileRequest request) {
        return ResponseEntity.ok(doctorProfileService.completeProfile(principal.getUser().getId(), request));
    }
}