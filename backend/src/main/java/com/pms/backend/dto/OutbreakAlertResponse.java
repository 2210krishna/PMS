package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OutbreakAlertResponse {
    private Long id;
    private String diseaseType;
    private String district;
    private Integer caseCount;
    private String windowStart;
    private String windowEnd;
    private String status;
    private String detectedAt;
}