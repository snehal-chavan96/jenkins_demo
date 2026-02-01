package com.example.ecolearn.dto.epicChallenge;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewSubmissionDTO {

    @NotNull
    private Long teacherId;

    @NotNull
    private boolean approved;

    private String remarks; // optional (future use)
}
