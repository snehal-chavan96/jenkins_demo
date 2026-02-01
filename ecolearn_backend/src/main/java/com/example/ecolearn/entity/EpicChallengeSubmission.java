package com.example.ecolearn.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "epic_challenge_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EpicChallengeSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Student who submitted
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(nullable = false)
    private String challengeTitle;

    @Column(nullable = false)
    private int ecoPoints;

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private LocalDateTime submittedAt;

    private LocalDateTime reviewedAt;

    // Teacher who reviewed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private User reviewedBy;

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }
}
