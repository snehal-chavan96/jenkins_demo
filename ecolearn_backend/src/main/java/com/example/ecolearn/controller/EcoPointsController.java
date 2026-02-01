package com.example.ecolearn.controller;

import com.example.ecolearn.dto.LeaderboardDTO;
import com.example.ecolearn.dto.StudentEcoStatsDTO;
import com.example.ecolearn.entity.EpicChallengeSubmission;
import com.example.ecolearn.service.EcoPointsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/eco-points")
public class EcoPointsController {

    private final EcoPointsService ecoPointsService;

    public EcoPointsController(EcoPointsService ecoPointsService) {
        this.ecoPointsService = ecoPointsService;
    }

    // Get logged-in student eco stats
    @GetMapping("/student/{userId}")
    public ResponseEntity<Map<String, Object>> getStudentStats(
            @PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            StudentEcoStatsDTO stats = ecoPointsService.getStudentEcoStats(userId);
            response.put("success", true);
            response.put("data", stats);
            log.info("Fetched EcoPoints for studentId {}: {} points, level {}", userId, stats.getEcoPoints(), stats.getLevel());
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.warn("Error fetching student stats for userId {}: {}", userId, e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            HttpStatus status = e.getMessage().equals("User is not a student") ? HttpStatus.BAD_REQUEST : HttpStatus.NOT_FOUND;
            return ResponseEntity.status(status).body(response);
        }
    }

    // Add points (teacher/admin only ideally)
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addPoints(
            @RequestParam Long userId,
            @RequestParam int points) {
        Map<String, Object> response = new HashMap<>();
        try {
            ecoPointsService.addEcoPoints(userId, points);
            response.put("success", true);
            response.put("message", "EcoPoints added successfully");
            log.info("Added {} EcoPoints to studentId {}", points, userId);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.warn("Error adding EcoPoints for userId {}: {}", userId, e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Leaderboard
    @GetMapping("/leaderboard")
    public ResponseEntity<Map<String, Object>> getLeaderboard() {
        Map<String, Object> response = new HashMap<>();
        List<LeaderboardDTO> leaderboard = ecoPointsService.getLeaderboard();
        response.put("success", true);
        response.put("data", leaderboard);
        log.info("Fetched leaderboard with {} students", leaderboard.size());
        return ResponseEntity.ok(response);
    }



}
