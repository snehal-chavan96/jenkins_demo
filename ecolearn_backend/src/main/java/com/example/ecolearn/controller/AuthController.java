package com.example.ecolearn.controller;

import com.example.ecolearn.dto.LoginRequestDTO;
import com.example.ecolearn.dto.SignupRequestDTO;
import com.example.ecolearn.entity.User;
import com.example.ecolearn.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    // ---------------- SIGN UP -------------------
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequestDTO signupRequest) {
        logger.info("Signup request received for username: {} email: {}", signupRequest.getUsername(), signupRequest.getEmail());

        try {
            User user = authService.signup(signupRequest);
            logger.info("User registered successfully: {} (ID: {})", user.getUsername(), user.getId());

            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "userId", user.getId()
            ));
        } catch (Exception e) {
            logger.warn("Signup failed for username: {} email: {} - {}", signupRequest.getUsername(), signupRequest.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // ---------------- LOGIN -------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        logger.info("Login request received for identifier: {}", loginRequest.getUsernameOrEmail());

        try {
            Map<String, Object> result = authService.login(loginRequest.getUsernameOrEmail(),
                    loginRequest.getPassword());

            User user = (User) result.get("user");
            String token = (String) result.get("token");

            logger.info("User logged in successfully: {} (ID: {})", user.getUsername(), user.getId());

            return ResponseEntity.ok(Map.of(
                    "user", Map.of(
                            "id", user.getId(),
                            "name", user.getName(),
                            "email", user.getEmail(),
                            "role", user.getUserType().name().toLowerCase()
                    ),
                    "token", token
            ));
        } catch (Exception e) {
            logger.warn("Login failed for identifier: {} - {}", loginRequest.getUsernameOrEmail(), e.getMessage());
            return ResponseEntity.status(401).body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
    // ---------------- LOGOUT -------------------
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("Logout failed - missing or invalid Authorization header");
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid Authorization header"));
            }

            String token = authHeader.substring(7); // Remove "Bearer " prefix
            authService.logout(token);

            return ResponseEntity.ok(Map.of("message", "Logged out successfully"));

        } catch (Exception e) {
            logger.warn("Logout failed - {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }


}
