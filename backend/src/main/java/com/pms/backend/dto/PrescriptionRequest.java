package com.pms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class PrescriptionRequest {
    @NotBlank
    private String healthId;
    private Long appointmentId;
    @NotBlank
    private String diagnosis;
    private String cause;
    private String notes;
    @NotEmpty
    private List<PrescriptionItemDto> items;
}