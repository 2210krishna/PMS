package com.pms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicalRecordRequest {
    @NotBlank
    private String healthId;
    @NotBlank
    private String diseaseType;
    private String diagnosisNotes;
    private String prescriptionText;
}