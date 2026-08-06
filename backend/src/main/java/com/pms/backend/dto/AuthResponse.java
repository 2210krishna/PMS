package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private String fullName;
    private Long userId;
    private String healthId;
    private String verificationStatus;       // WORKER only, else null
    private Boolean doctorProfileCompleted;   // DOCTOR only, else null
}