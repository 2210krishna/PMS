package com.pms.backend.dto;

import com.pms.backend.entity.Role;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    private String fullName;
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    @NotNull
    private Role role;

    private String dateOfBirth;
    private String phone;
    private String location;
    private String bloodGroup;
}