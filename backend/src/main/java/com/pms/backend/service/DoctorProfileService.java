package com.pms.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pms.backend.dto.*;
import com.pms.backend.entity.Department;
import com.pms.backend.entity.DoctorProfile;
import com.pms.backend.entity.Role;
import com.pms.backend.entity.User;
import com.pms.backend.repository.DepartmentRepository;
import com.pms.backend.repository.DoctorProfileRepository;
import com.pms.backend.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoctorProfileService {

    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public CreateDoctorResponse createDoctor(CreateDoctorRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        String tempPassword = "Dr" + UUID.randomUUID().toString().substring(0, 8);

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setRole(Role.DOCTOR);
        user.setPreferredLanguage("en");
        user.setEnabled(true);
        user.setAuthProvider("LOCAL");
        User savedUser = userRepository.save(user);

        DoctorProfile profile = new DoctorProfile();
        profile.setUser(savedUser);
        profile.setProfileCompleted(false);
        doctorProfileRepository.save(profile);

        return new CreateDoctorResponse(savedUser.getId(), savedUser.getEmail(), tempPassword);
    }

    public CreateDoctorResponse resetPassword(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        String tempPassword = "Dr" + UUID.randomUUID().toString().substring(0, 8);
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);
        return new CreateDoctorResponse(user.getId(), user.getEmail(), tempPassword);
    }

    public DoctorProfileResponse getMyProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        DoctorProfile profile = doctorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found"));
        return toResponse(user, profile);
    }

    public DoctorProfileResponse completeProfile(Long userId, CompleteDoctorProfileRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        DoctorProfile profile = doctorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found"));

        Department department = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));

        profile.setPhone(req.getPhone());
        profile.setLocation(req.getLocation());
        profile.setLicenseNumber(req.getLicenseNumber());
        profile.setSpecialization(req.getSpecialization());
        profile.setDepartment(department);
        profile.setProfileCompleted(true);

        DoctorProfile saved = doctorProfileRepository.save(profile);
        return toResponse(user, saved);
    }

    public List<DoctorProfileResponse> getAllDoctors() {
        return doctorProfileRepository.findAll().stream()
                .filter(DoctorProfile::isProfileCompleted)
                .map(p -> toResponse(p.getUser(), p))
                .toList();
    }

    public List<DoctorProfileResponse> getDoctorsByDepartment(Long departmentId) {
        return doctorProfileRepository.findByDepartmentIdAndProfileCompletedTrue(departmentId).stream()
                .map(p -> toResponse(p.getUser(), p))
                .toList();
    }

    private DoctorProfileResponse toResponse(User user, DoctorProfile profile) {
        return new DoctorProfileResponse(
                user.getId(), user.getFullName(), user.getEmail(),
                profile.getPhone(), profile.getLocation(),
                profile.getLicenseNumber(), profile.getSpecialization(),
                profile.getDepartment() != null ? profile.getDepartment().getName() : null,
                profile.getDepartment() != null ? profile.getDepartment().getId() : null,
                profile.isProfileCompleted()
        );
    }
}