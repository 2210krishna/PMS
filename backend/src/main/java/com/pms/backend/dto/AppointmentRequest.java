package com.pms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentRequest {
    @NotNull
    private Long doctorUserId;
    @NotNull
    private Long departmentId;
    @NotBlank
    private String appointmentDate; // yyyy-MM-dd
    @NotBlank
    private String timeSlot;
    private String reason;
}