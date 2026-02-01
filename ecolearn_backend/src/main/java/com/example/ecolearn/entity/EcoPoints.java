package com.example.ecolearn.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "eco_points")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EcoPoints {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Min(0)
    private Integer points;

    @Builder.Default
    private LocalDateTime lastUpdated = LocalDateTime.now();
}

