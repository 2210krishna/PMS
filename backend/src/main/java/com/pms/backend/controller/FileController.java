package com.pms.backend.controller;

import com.pms.backend.dto.MedicalFileResponse;
import com.pms.backend.entity.MedicalFile;
import com.pms.backend.service.MedicalFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final MedicalFileService medicalFileService;

    @GetMapping("/prescription/{prescriptionId}")
    public ResponseEntity<List<MedicalFileResponse>> list(@PathVariable Long prescriptionId) {
        return ResponseEntity.ok(medicalFileService.getForPrescription(prescriptionId));
    }

    @GetMapping("/{fileId}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long fileId) throws IOException {
        MedicalFile file = medicalFileService.getById(fileId);
        byte[] data = medicalFileService.readFileBytes(file);
        MediaType type = file.getFileType() != null
                ? MediaType.parseMediaType(file.getFileType())
                : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                .contentType(type)
                .body(data);
    }
}