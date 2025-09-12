package com.example.VA.controller;

import com.example.VA.entity.User;
import com.example.VA.entity.User.Role;
import com.example.VA.repository.UserRepository;
import com.example.VA.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${app.invite.creator:}")
    private String creatorInvite;

    @Value("${app.invite.admin:}")
    private String adminInvite;

    // ✅ Register new user with optional role + inviteCode
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String password = payload.get("password");
        String requestedRole = payload.getOrDefault("role", "VOTER");
        String inviteCode = payload.getOrDefault("inviteCode", "");

        if (email == null || password == null || name == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "name, email and password are required"));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists!"));
        }

        Role role;
        try {
            role = Role.valueOf(requestedRole.toUpperCase());
        } catch (Exception e) {
            role = Role.VOTER;
        }

        // Enforce invites for elevated roles
        if (role == Role.CREATOR) {
            if (creatorInvite == null || creatorInvite.isBlank() || !creatorInvite.equals(inviteCode)) {
                return ResponseEntity.status(403).body(Map.of("error", "Invalid invite code for CREATOR"));
            }
        } else if (role == Role.ADMIN) {
            if (adminInvite == null || adminInvite.isBlank() || !adminInvite.equals(inviteCode)) {
                return ResponseEntity.status(403).body(Map.of("error", "Invalid invite code for ADMIN"));
            }
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role == null ? Role.VOTER : role)
                .build();

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully!", "role", user.getRole().name()));
    }

    // ✅ Login and get JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        // Get user role for JWT
        User user = userRepository.findByEmail(email).orElseThrow();
        String token = jwtUtil.generateToken(authentication.getName(), user.getRole().name());
        return ResponseEntity.ok(Map.of("token", token, "role", user.getRole().name()));
    }
}
