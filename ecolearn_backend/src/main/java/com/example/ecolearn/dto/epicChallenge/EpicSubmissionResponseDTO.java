package com.example.ecolearn.dto.epicChallenge;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class EpicSubmissionResponseDTO {

    private Long submissionId;
    private String studentName;
    private String challengeTitle;
    private int ecoPoints;
    private String status;
    private LocalDateTime submittedAt;
}
