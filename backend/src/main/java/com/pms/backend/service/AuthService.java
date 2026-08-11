package com.pms.backend.service;

import com.pms.backend.dto.*;
import com.pms.backend.entity.*;
import com.pms.backend.repository.PatientRepository;
import com.pms.backend.repository.UserRepository;
import com.pms.backend.repository.DoctorProfileRepository;
import com.pms.backend.repository.LabProfileRepository;
import com.pms.backend.security.CustomUserDetails;
import com.pms.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final DoctorProfileRepository doctorProfileRepository;
    private final LabProfileRepository labProfileRepository;


    @Value("${google.oauth.client-id:}")
    private String googleClientId;

    public AuthResponse register(RegisterRequest req) {
        if (req.getRole() != Role.PATIENT) {
            throw new IllegalArgumentException("Only patient self-registration is allowed. Other accounts are created by an administrator.");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole());
        user.setPreferredLanguage("en");
        user.setEnabled(true);
        user.setAuthProvider("LOCAL");

        User savedUser = userRepository.save(user);

        String healthId = null;
        String verificationStatus = null;

        if (req.getRole() == Role.PATIENT) {
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setHealthId(generateHealthId(req.getLocation()));
            patient.setDateOfBirth(req.getDateOfBirth() != null ? LocalDate.parse(req.getDateOfBirth()) : LocalDate.now());
            patient.setPhone(req.getPhone());
            patient.setLocation(req.getLocation());
            patient.setBloodGroup(req.getBloodGroup());
            patient.setVerificationStatus("PENDING");

            Patient savedPatient = patientRepository.save(patient);
            healthId = savedPatient.getHealthId();
            verificationStatus = savedPatient.getVerificationStatus();
        }

        String token = jwtUtil.generateToken(new CustomUserDetails(savedUser), savedUser.getRole().name());
        return new AuthResponse(token, savedUser.getRole().name(), savedUser.getFullName(), savedUser.getId(), healthId, verificationStatus, null, null);    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
    
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
    
        String healthId = null;
        String verificationStatus = null;
        Boolean doctorProfileCompleted = null;
        Boolean labProfileCompleted = null;
    
        if (user.getRole() == Role.PATIENT) {
            Patient p = patientRepository.findByUserId(user.getId()).orElse(null);
            if (p != null) {
                healthId = p.getHealthId();
                verificationStatus = p.getVerificationStatus();
            }
        } else if (user.getRole() == Role.DOCTOR) {
            doctorProfileCompleted = doctorProfileRepository.findByUserId(user.getId())
                    .map(DoctorProfile::isProfileCompleted)
                    .orElse(false);
        } else if (user.getRole() == Role.LAB) {
            labProfileCompleted = labProfileRepository.findByUserId(user.getId())
                    .map(com.pms.backend.entity.LabProfile::isProfileCompleted)
                    .orElse(false);
        }
    
        String token = jwtUtil.generateToken(new CustomUserDetails(user), user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), user.getFullName(), user.getId(), healthId, verificationStatus, doctorProfileCompleted, labProfileCompleted);
    }

    public AuthResponse googleAuth(GoogleAuthRequest req) {
        Map<String, Object> tokenInfo = verifyGoogleToken(req.getIdToken());

        String email = (String) tokenInfo.get("email");
        String name = (String) tokenInfo.get("name");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setFullName(name != null ? name : email);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setRole(Role.PATIENT);
            user.setPreferredLanguage("en");
            user.setEnabled(true);
            user.setAuthProvider("GOOGLE");
            user = userRepository.save(user);
        }

        String healthId = null;
        String verificationStatus = null;

        if (user.getRole() == Role.PATIENT) {
            Patient p = patientRepository.findByUserId(user.getId()).orElse(null);
            if (p != null) {
                healthId = p.getHealthId();
                verificationStatus = p.getVerificationStatus();
            }
        }

        String token = jwtUtil.generateToken(new CustomUserDetails(user), user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), user.getFullName(), user.getId(), healthId, verificationStatus, null, null);
    }

    private Map<String, Object> verifyGoogleToken(String idToken) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
        Map<String, Object> response;
        try {
            response = restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid Google token");
        }
        if (response == null || googleClientId == null || googleClientId.isBlank() || !googleClientId.equals(response.get("aud"))) {
            throw new IllegalArgumentException("Google token verification failed");
        }
        return response;
    }

    private String generateHealthId(String location) {
        String code = (location != null && location.length() >= 3) ? location.substring(0, 3).toUpperCase() : "GEN";
        String unique = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "HN-" + code + "-" + unique;
    }

    public void changePassword(Long userId, ChangePasswordRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}