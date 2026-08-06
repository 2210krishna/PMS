package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class PrescriptionResponse {
    private Long id;
    private String patientHealthId;
    private String patientName;
    private String doctorName;
    private String notes;
    private List<PrescriptionItemDto> items;
    private double totalAmount;
    private String createdAt;
}