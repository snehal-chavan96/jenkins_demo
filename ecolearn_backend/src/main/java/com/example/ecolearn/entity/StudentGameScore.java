package com.example.ecolearn.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_game_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentGameScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Min(0)
    private Integer score;

    @Builder.Default
    private Integer timeSpentSeconds = 0;

    private Integer levelReached;

    @Builder.Default
    private LocalDateTime playedAt = LocalDateTime.now();
}

