package com.pms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompleteDoctorProfileRequest {
    @NotBlank
    private String phone;
    @NotBlank
    private String location;
    @NotBlank
    private String licenseNumber;
    @NotBlank
    private String specialization;
    private String hospitalAffiliation;
    @NotNull
    private Long departmentId;
}