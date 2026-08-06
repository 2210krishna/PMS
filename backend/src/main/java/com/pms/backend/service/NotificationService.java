package com.pms.backend.service;

import com.pms.backend.dto.NotificationResponse;
import com.pms.backend.entity.Notification;
import com.pms.backend.entity.User;
import com.pms.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public void notify(User recipient, String message) {
        Notification n = new Notification();
        n.setRecipient(recipient);
        n.setMessage(message);
        notificationRepository.save(n);
    }

    public List<NotificationResponse> getMyNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId).stream()
                .map(n -> new NotificationResponse(n.getId(), n.getMessage(), n.isRead(), n.getCreatedAt().format(FMT)))
                .toList();
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    public void markRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void markAllRead(Long userId) {
        List<Notification> all = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        all.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(all);
    }
}