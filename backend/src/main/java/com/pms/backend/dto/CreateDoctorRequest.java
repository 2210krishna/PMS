package com.pms.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDoctorRequest {
    @NotBlank
    private String fullName;
    @NotBlank @Email
    private String email;
}