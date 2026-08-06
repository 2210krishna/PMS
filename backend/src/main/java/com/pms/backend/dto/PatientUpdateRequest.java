package com.pms.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientUpdateRequest {
    private String phone;
    private String location;
    private String bloodGroup;
}