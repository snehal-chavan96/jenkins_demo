package com.example.ecolearn.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "student_quiz_attempts", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "quiz_id", "attemptNumber"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentQuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    private Integer attemptNumber;

    @Column(name = "started_at", updatable = false)
    private LocalDateTime startedAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    @Min(0)
    private BigDecimal score;

    private Integer totalQuestions;
    private Integer correctAnswers;

    @Builder.Default
    private Integer timeTakenSeconds = 0;

    @Builder.Default
    private boolean passed = false;

    @OneToMany(mappedBy = "quizAttempt", cascade = CascadeType.ALL)
    private List<StudentQuizAnswer> answers;
}

