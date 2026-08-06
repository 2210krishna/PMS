package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MedicalRecordResponse {
    private Long id;
    private String patientHealthId;
    private String patientName;
    private String doctorName;
    private String diseaseType;
    private String diagnosisNotes;
    private String prescriptionText;
    private String district;
    private String createdAt;
}