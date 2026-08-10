package com.pms.backend.controller;

import com.pms.backend.dto.*;
import com.pms.backend.entity.User;
import com.pms.backend.security.CustomUserDetails;
import com.pms.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@Valid @RequestBody GoogleAuthRequest request) {
        return ResponseEntity.ok(authService.googleAuth(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserSummaryResponse> me(@AuthenticationPrincipal CustomUserDetails principal) {
        User u = principal.getUser();
        return ResponseEntity.ok(new UserSummaryResponse(u.getId(), u.getFullName(), u.getEmail(), u.getRole().name(), u.isEnabled()));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(principal.getUser().getId(), request);
        return ResponseEntity.ok().build();
    }
}