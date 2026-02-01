package com.example.ecolearn.controller;

import com.example.ecolearn.dto.EcoPointsRequestDTO;
import com.example.ecolearn.entity.EcoPoints;
import com.example.ecolearn.entity.User;
import com.example.ecolearn.repository.UserRepo.UserSignUpRepo;
import com.example.ecolearn.service.EcoPointsServiceDemo;
import com.example.ecolearn.utils.JwtUtil;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/demo-eco-points")
public class EcoPointsDemoController {

    private static final Logger logger =
            LoggerFactory.getLogger(EcoPointsDemoController.class);

    private final EcoPointsServiceDemo ecoPointsServiceDemo;
    private final JwtUtil jwtUtil;
    private final UserSignUpRepo userRepository;

    public EcoPointsDemoController(
            EcoPointsServiceDemo ecoPointsServiceDemo,
            JwtUtil jwtUtil,
            UserSignUpRepo userRepository
    ) {
        this.ecoPointsServiceDemo = ecoPointsServiceDemo;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    // ---------------- GET ECO POINTS ----------------
    @GetMapping
    public ResponseEntity<?> getMyEcoPoints(
            @RequestHeader("Authorization") String authHeader
    ) {

        logger.info("GET /api/eco-points called");

        User user = extractStudentFromToken(authHeader);

        EcoPoints ecoPoints = ecoPointsServiceDemo.getEcoPoints(user);

        logger.info("EcoPoints fetched | student={} | points={}",
                user.getUsername(), ecoPoints.getPoints());

        return ResponseEntity.ok(Map.of(
                "points", ecoPoints.getPoints(),
                "lastUpdated", ecoPoints.getLastUpdated()
        ));
    }

    // ---------------- ADD ECO POINTS ----------------
    @PostMapping("/add")
    public ResponseEntity<?> addEcoPoints(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody @Valid EcoPointsRequestDTO request
    ) {

        logger.info("POST /api/eco-points/add called | points={}", request.getPoints());

        User user = extractStudentFromToken(authHeader);

        EcoPoints updated = ecoPointsServiceDemo.addPoints(user, request.getPoints());

        logger.info("EcoPoints added | student={} | added={} | total={}",
                user.getUsername(), request.getPoints(), updated.getPoints());

        return ResponseEntity.ok(Map.of(
                "message", "EcoPoints added successfully",
                "totalPoints", updated.getPoints()
        ));
    }

    // ---------------- DEDUCT ECO POINTS ----------------
    @PostMapping("/deduct")
    public ResponseEntity<?> deductEcoPoints(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody @Valid EcoPointsRequestDTO request
    ) {

        logger.info("POST /api/eco-points/deduct called | points={}", request.getPoints());

        User user = extractStudentFromToken(authHeader);

        EcoPoints updated = ecoPointsServiceDemo.deductPoints(user, request.getPoints());

        logger.info("EcoPoints deducted | student={} | deducted={} | total={}",
                user.getUsername(), request.getPoints(), updated.getPoints());

        return ResponseEntity.ok(Map.of(
                "message", "EcoPoints deducted successfully",
                "totalPoints", updated.getPoints()
        ));
    }

    // ---------------- COMMON TOKEN → USER LOGIC ----------------
    private User extractStudentFromToken(String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Missing or invalid Authorization header");
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            logger.warn("Invalid or expired JWT token");
            throw new RuntimeException("Invalid or expired token");
        }

        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username);

        if (user == null) {
            logger.error("User not found | username={}", username);
            throw new RuntimeException("User not found");
        }

        if (user.getUserType() != User.UserType.STUDENT) {
            logger.warn("Unauthorized EcoPoints access | user={} | role={}",
                    username, user.getUserType());
            throw new RuntimeException("EcoPoints are allowed only for STUDENT users");
        }

        logger.debug("Authenticated STUDENT user: {}", username);

        return user;
    }
}
