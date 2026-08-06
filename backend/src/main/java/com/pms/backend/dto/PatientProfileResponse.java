package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PatientProfileResponse {
    private Long patientId;
    private String healthId;
    private String fullName;
    private String email;
    private String dateOfBirth;
    private String phone;
    private String location;
    private String bloodGroup;
    private String verificationStatus;
}