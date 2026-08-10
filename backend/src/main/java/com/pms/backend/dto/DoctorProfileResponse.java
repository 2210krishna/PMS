package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DoctorProfileResponse {
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String licenseNumber;
    private String specialization;
    private String departmentName;
    private Long departmentId;
    private boolean profileCompleted;
}