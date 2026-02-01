package com.example.ecolearn.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentQuizAttemptDTO {
    private Long quizId;
    private Long studentId;
    private List<StudentAnswerDTO> answers;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class StudentAnswerDTO {
    private Long questionId;
    private Long selectedOptionId;
    private String answerText;
}
