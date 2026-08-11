package com.pms.backend.service;

import com.pms.backend.dto.MedicalFileResponse;
import com.pms.backend.entity.MedicalFile;
import com.pms.backend.entity.Prescription;
import com.pms.backend.entity.User;
import com.pms.backend.repository.MedicalFileRepository;
import com.pms.backend.repository.PrescriptionRepository;
import com.pms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalFileService {

    private final MedicalFileRepository medicalFileRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    public MedicalFileResponse upload(Long prescriptionId, MultipartFile file, Long uploaderUserId) throws IOException {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found"));
        User uploader = userRepository.findById(uploaderUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String storedPath = fileStorageService.store(file, prescriptionId);

        MedicalFile mf = new MedicalFile();
        mf.setFileName(file.getOriginalFilename());
        mf.setFileType(file.getContentType());
        mf.setFileSize(file.getSize());
        mf.setStoredPath(storedPath);
        mf.setUploadedAt(LocalDateTime.now());
        mf.setPrescription(prescription);
        mf.setUploadedBy(uploader);

        MedicalFile saved = medicalFileRepository.save(mf);

        notificationService.notify(prescription.getPatient().getUser(),
                "A lab report \"" + mf.getFileName() + "\" was attached to your prescription.");
        notificationService.notify(prescription.getDoctor(),
                "A lab report \"" + mf.getFileName() + "\" was attached to a prescription you issued.");

        return toResponse(saved);
    }

    public List<MedicalFileResponse> getForPrescription(Long prescriptionId) {
        return medicalFileRepository.findByPrescriptionIdOrderByUploadedAtDesc(prescriptionId)
                .stream().map(this::toResponse).toList();
    }

    public MedicalFile getById(Long fileId) {
        return medicalFileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));
    }

    public byte[] readFileBytes(MedicalFile file) throws IOException {
        return fileStorageService.read(file.getStoredPath());
    }

    public MedicalFileResponse toResponse(MedicalFile f) {
        return new MedicalFileResponse(f.getId(), f.getFileName(), f.getFileType(), f.getFileSize(), f.getUploadedAt().toString());
    }
}