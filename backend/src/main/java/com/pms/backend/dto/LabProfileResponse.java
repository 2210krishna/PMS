package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LabProfileResponse {
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private boolean profileCompleted;
}