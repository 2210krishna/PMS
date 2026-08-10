package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalDoctors;
    private long totalPatients;
    private long appointmentsToday;
    private long appointmentsCompletedToday;
    private long patientsBookedToday;
    private long confirmedAppointments;
    private long completedAppointments;
    private long cancelledAppointments;
}