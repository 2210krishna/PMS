package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private String patientHealthId;
    private String patientName;
    private Long doctorUserId;
    private String doctorName;
    private String departmentName;
    private String appointmentDate;
    private String timeSlot;
    private String reason;
    private String status;
    private String createdAt;
}