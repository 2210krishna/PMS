package com.pms.backend.controller;

import com.pms.backend.dto.*;
import com.pms.backend.security.CustomUserDetails;
import com.pms.backend.service.DoctorProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorProfileService doctorProfileService;

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