package com.pms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompletePatientProfileRequest {
    @NotBlank
    private String dateOfBirth;
    @NotBlank
    private String phone;
    @NotBlank
    private String location;
    @NotBlank
    private String bloodGroup;
}