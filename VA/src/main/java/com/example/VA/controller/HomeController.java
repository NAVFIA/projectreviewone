package com.example.VA.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<?> home() {
        return ResponseEntity.ok(Map.of(
            "message", "Voting Application API is running!",
            "version", "1.0.0",
            "endpoints", Map.of(
                "public_test", "/api/test/public",
                "auth", "/api/auth/login",
                "register", "/api/auth/register"
            )
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "Voting Application"));
    }
}
