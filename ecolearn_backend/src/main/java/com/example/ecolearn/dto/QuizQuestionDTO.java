package com.example.ecolearn.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizQuestionDTO {
    private Long id;
    private String questionText;
    private String questionImageUrl;
    private String questionType; // MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER
    private String difficultyLevel; // EASY, MEDIUM, HARD
    private Integer points;
    private Integer displayOrder;
    private List<QuestionOptionDTO> options;
}
