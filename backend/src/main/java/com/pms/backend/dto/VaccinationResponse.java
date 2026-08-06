package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VaccinationResponse {
    private Long id;
    private String workerHealthId;
    private String vaccineName;
    private Integer doseNumber;
    private String dateGiven;
    private String administeredBy;
}