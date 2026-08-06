package com.pms.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.pms.backend.entity.AuditLog;
import com.pms.backend.entity.User;
import com.pms.backend.repository.AuditLogRepository;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(User actor, String action, String entityType, Long entityId) {
        AuditLog logEntry = new AuditLog();
        logEntry.setActor(actor);
        logEntry.setAction(action);
        logEntry.setEntityType(entityType);
        logEntry.setEntityId(entityId);
        auditLogRepository.save(logEntry);
    }
}