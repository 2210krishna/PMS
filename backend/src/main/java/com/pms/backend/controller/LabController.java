package com.pms.backend.controller;

import com.pms.backend.dto.CompleteLabProfileRequest;
import com.pms.backend.dto.LabProfileResponse;
import com.pms.backend.dto.MedicalFileResponse;
import com.pms.backend.security.CustomUserDetails;
import com.pms.backend.service.LabService;
import com.pms.backend.service.MedicalFileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/lab")
@RequiredArgsConstructor
public class LabController {

    private final MedicalFileService medicalFileService;
    private final LabService labService;

    @PostMapping(value = "/prescriptions/{prescriptionId}/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MedicalFileResponse> uploadFile(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long prescriptionId,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(medicalFileService.upload(prescriptionId, file, principal.getUser().getId()));
    }

    @GetMapping("/profile/me")
    public ResponseEntity<LabProfileResponse> getMyProfile(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(labService.getMyProfile(principal.getUser().getId()));
    }

    @PutMapping("/profile/me")
    public ResponseEntity<LabProfileResponse> completeProfile(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody CompleteLabProfileRequest request) {
        return ResponseEntity.ok(labService.completeProfile(principal.getUser().getId(), request));
    }
}