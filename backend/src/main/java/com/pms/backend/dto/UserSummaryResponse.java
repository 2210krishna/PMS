package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserSummaryResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private boolean enabled;
}