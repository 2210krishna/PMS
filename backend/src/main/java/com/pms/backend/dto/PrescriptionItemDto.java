package com.pms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrescriptionItemDto {
    @NotBlank
    private String medicineName;
    private String dosage;
    @NotNull
    private Integer durationDays;
}