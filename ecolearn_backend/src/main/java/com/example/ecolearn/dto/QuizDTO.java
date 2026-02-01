package com.example.ecolearn.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizDTO {
    private Long id;
    private Long chapterId;
    private String title;
    private String description;
    private Integer totalQuestions;
    private BigDecimal passingScore;
    private Integer timeLimitMinutes;
    private Integer maxAttempts;
    private boolean isActive;
    private List<QuizQuestionDTO> questions;
}

