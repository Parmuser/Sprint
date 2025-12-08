package com.example.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    /**
     * Health check endpoint
     * GET /api/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("application", "User Management API");
        response.put("version", "1.0.0");
        
        return ResponseEntity.ok(response);
    }

    /**
     * API info endpoint
     * GET /api/info
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        Map<String, Object> response = new HashMap<>();
        response.put("name", "User Management API");
        response.put("description", "REST API for user management operations");
        response.put("version", "1.0.0");
        response.put("developer", "Spring Boot Developer");
        response.put("endpoints", Map.of(
            "users", "/api/users",
            "health", "/api/health",
            "info", "/api/info"
        ));
        
        return ResponseEntity.ok(response);
    }
}
