package com.example.ecolearn.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "games")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    private GameType gameType;

    private String learningOutcome;

    @Min(1)
    private Integer maxScore;

    @Builder.Default
    private boolean isActive = true;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<StudentGameScore> studentScores;

    public enum GameType {
        WILDLIFE_RESCUE_CARD, ECO_CITY_BUILDER, RECYCLING_CHALLENGE, WILDLIFE_RESCUE
    }
}

