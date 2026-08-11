package com.pms.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String store(MultipartFile file, Long prescriptionId) throws IOException {
        Path dir = Paths.get(uploadDir, "prescriptions", String.valueOf(prescriptionId));
        Files.createDirectories(dir);

        String cleanName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        String storedName = UUID.randomUUID() + "-" + cleanName;
        Path target = dir.resolve(storedName);

        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return target.toString();
    }

    public byte[] read(String storedPath) throws IOException {
        return Files.readAllBytes(Paths.get(storedPath));
    }
}