package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DiseaseCountResponse {
    private String diseaseType;
    private long count;
}