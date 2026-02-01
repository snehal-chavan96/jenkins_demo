package com.example.ecolearn.controller;

import com.example.ecolearn.dto.epicChallenge.EpicSubmissionResponseDTO;
import com.example.ecolearn.dto.epicChallenge.ReviewSubmissionDTO;
import com.example.ecolearn.dto.epicChallenge.SubmitEpicChallengeDTO;
import com.example.ecolearn.service.EpicChallengeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/epic-challenges")
public class EpicChallengeController {

    private final EpicChallengeService service;

    public EpicChallengeController(EpicChallengeService service) {
        this.service = service;
    }

    // ============================
    // STUDENT submits challenge
    // ============================
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submit(
            @RequestBody SubmitEpicChallengeDTO dto) {

        service.submitChallenge(dto);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message",
                "Epic challenge submitted successfully. Awaiting teacher approval.");
        response.put("ecoPointsStatus", "NOT_ADDED_YET");

        return ResponseEntity.ok(response);
    }

    // ============================
    // TEACHER views pending
    // ============================
    @GetMapping("/pending")
    public ResponseEntity<List<EpicSubmissionResponseDTO>> pending() {
        return ResponseEntity.ok(service.getPendingSubmissions());
    }

    // ============================
    // TEACHER reviews submission
    // ============================
    @PostMapping("/review/{submissionId}")
    public ResponseEntity<Map<String, Object>> review(
            @PathVariable Long submissionId,
            @RequestBody ReviewSubmissionDTO dto) {

        service.reviewSubmission(submissionId, dto);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);

        if (dto.isApproved()) {
            response.put("message",
                    "Challenge approved. EcoPoints have been added to the student.");
        } else {
            response.put("message",
                    "Challenge rejected. EcoPoints were not added.");
        }

        return ResponseEntity.ok(response);
    }
}
