package com.pms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompleteLabProfileRequest {
    @NotBlank
    private String phone;
    @NotBlank
    private String location;
}