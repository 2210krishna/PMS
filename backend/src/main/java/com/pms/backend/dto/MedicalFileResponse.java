package com.pms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MedicalFileResponse {
    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String uploadedAt;
}