package com.pms.backend.controller;

import com.pms.backend.dto.NotificationResponse;
import com.pms.backend.security.CustomUserDetails;
import com.pms.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/me")
    public ResponseEntity<List<NotificationResponse>> myNotifications(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(notificationService.getMyNotifications(principal.getUser().getId()));
    }

    @GetMapping("/me/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(principal.getUser().getId())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        notificationService.markRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/me/read-all")
    public ResponseEntity<Void> markAllRead(@AuthenticationPrincipal CustomUserDetails principal) {
        notificationService.markAllRead(principal.getUser().getId());
        return ResponseEntity.ok().build();
    }
} 