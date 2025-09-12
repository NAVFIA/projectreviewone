package com.example.VA.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public ResponseEntity<?> publicEndpoint() {
        return ResponseEntity.ok(Map.of("message", "Public endpoint working!", "port", "8081"));
    }

    @GetMapping("/authenticated")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CREATOR') or hasRole('VOTER')")
    public ResponseEntity<?> authenticatedEndpoint() {
        return ResponseEntity.ok(Map.of("message", "Authenticated endpoint working!"));
    }

    @GetMapping("/admin-only")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminOnlyEndpoint() {
        return ResponseEntity.ok(Map.of("message", "Admin-only endpoint working!"));
    }
}