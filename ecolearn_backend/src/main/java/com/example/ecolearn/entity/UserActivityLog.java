package com.example.ecolearn.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    private Long referenceId;

    private Integer pointsEarned;

    @Builder.Default
    private LocalDateTime actionTime = LocalDateTime.now();

    public enum ActionType {
        QUIZ, GAME, CHAPTER_COMPLETE, ECO_CHALLENGE
    }
}
