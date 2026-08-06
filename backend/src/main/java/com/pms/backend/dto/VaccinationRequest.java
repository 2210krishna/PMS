package com.pms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VaccinationRequest {

    @NotBlank
    private String healthId;

    @NotBlank
    private String vaccineName;

    @NotNull
    private Integer doseNumber;

    @NotBlank
    private String dateGiven; // yyyy-MM-dd
}