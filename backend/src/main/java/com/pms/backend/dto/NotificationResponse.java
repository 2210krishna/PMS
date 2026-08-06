package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String message;
    private boolean isRead;
    private String createdAt;
}