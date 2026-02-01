package com.example.ecolearn.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_quiz_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentQuizAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_attempt_id", nullable = false)
    private StudentQuizAttempt quizAttempt;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private QuizQuestion question;

    @ManyToOne
    @JoinColumn(name = "selected_option_id")
    private QuestionOption selectedOption;

    private String answerText;

    @Builder.Default
    private boolean isCorrect = false;

    @Builder.Default
    private Integer pointsEarned = 0;

    @Builder.Default
    private Integer timeTakenSeconds = 0;
}


