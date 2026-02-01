package com.example.ecolearn.dto.epicChallenge;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmitEpicChallengeDTO {

    @NotNull
    private Long studentId;

    @NotBlank
    private String challengeTitle;

    @Min(1)
    private int ecoPoints;

    private String description;

    private String imageUrl;
}
