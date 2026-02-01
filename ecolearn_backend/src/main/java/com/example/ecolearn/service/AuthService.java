package com.example.ecolearn.service;

import com.example.ecolearn.dto.SignupRequestDTO;
import com.example.ecolearn.entity.User;
import com.example.ecolearn.exception.ConflictException;
import com.example.ecolearn.exception.InvalidTokenException;
import com.example.ecolearn.exception.ResourceNotFoundException;
import com.example.ecolearn.repository.UserRepo.UserSignUpRepo;
import com.example.ecolearn.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserSignUpRepo userSignUpRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    // ---------------- SIGNUP -------------------
    public User signup(SignupRequestDTO request) throws Exception {
        logger.info("Signup attempt for username: {} and email: {}", request.getUsername(), request.getEmail());

        if (userSignUpRepo.existsByUsername(request.getUsername())) {
            logger.warn("Signup failed - username already taken: {}", request.getUsername());
            throw new ConflictException("Username is already taken!");
        }

        if (userSignUpRepo.existsByEmail(request.getEmail())) {
            logger.warn("Signup failed - email already taken: {}", request.getEmail());
            throw new ConflictException("Email is already taken");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .userType(request.getUserType())
                .isActive(true)
                .build();

        User savedUser = userSignUpRepo.save(user);
        logger.info("User registered successfully: {} (ID: {})", savedUser.getUsername(), savedUser.getId());

        return savedUser;
    }

    // ---------------- LOGIN -------------------
    public Map<String, Object> login(String identifier, String password) throws Exception {
        logger.info("Login attempt for identifier: {}", identifier);

        User user = userSignUpRepo.findByUsernameOrEmail(identifier);

        if (user == null) {
            logger.warn("Login failed - user not found for identifier: {}", identifier);
            throw new Exception("User not found");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            logger.warn("Login failed - invalid credentials for identifier: {}", identifier);
            throw new Exception("Invalid credentials");
        }

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userSignUpRepo.save(user);
        logger.info("User logged in successfully: {} (ID: {})", user.getUsername(), user.getId());

        // Generate JWT
        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getEmail(),
                user.getUserType().name()
        );
        logger.debug("JWT token generated for user: {}", user.getUsername());

        return Map.of(
                "user", user,
                "token", token
        );
    }
    // ---------------- LOGOUT -------------------
    public void logout(String token) throws Exception {
        logger.info("Logout attempt with token: {}", token);

        if (!jwtUtil.validateToken(token)) {
            logger.warn("Logout failed - invalid token");
            throw new InvalidTokenException("Invalid token");
        }

        String username = jwtUtil.getUsernameFromToken(token);
        User user = userSignUpRepo.findByUsername(username);

        if (user == null) {
            logger.warn("Logout failed - user not found for token: {}", token);
            throw new ResourceNotFoundException("User not found");
        }

        // Optionally update last logout time (add field to User if not present)
//         user.setLastLogout(LocalDateTime.now());
//         userSignUpRepo.save(user);

        logger.info("User logged out successfully: {} (ID: {})", user.getUsername(), user.getId());
    }

}
