package com.example.ecolearn.service;


import com.example.ecolearn.entity.EcoPoints;
import com.example.ecolearn.entity.User;
import com.example.ecolearn.repository.QuizRepo.EcoPointsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EcoPointsServiceDemoImpl implements EcoPointsServiceDemo {

    private final EcoPointsRepository ecoPointsRepository;

    /**
     * Get EcoPoints for a student.
     * If not present, create with 0 points.
     */
    @Override
    public EcoPoints getEcoPoints(User student) {

        return ecoPointsRepository.findByStudent(student)
                .orElseGet(() -> createInitialEcoPoints(student));
    }

    /**
     * Add points safely.
     */
    @Override
    public EcoPoints addPoints(User student, int points) {

        if (points <= 0) {
            throw new IllegalArgumentException("Points to add must be greater than 0");
        }

        EcoPoints ecoPoints = getEcoPoints(student);

        ecoPoints.setPoints(ecoPoints.getPoints() + points);
        ecoPoints.setLastUpdated(LocalDateTime.now());

        return ecoPointsRepository.save(ecoPoints);
    }

    /**
     * Deduct points safely (future use).
     */
    @Override
    public EcoPoints deductPoints(User student, int points) {

        if (points <= 0) {
            throw new IllegalArgumentException("Points to deduct must be greater than 0");
        }

        EcoPoints ecoPoints = getEcoPoints(student);

        if (ecoPoints.getPoints() < points) {
            throw new IllegalStateException("Insufficient EcoPoints");
        }

        ecoPoints.setPoints(ecoPoints.getPoints() - points);
        ecoPoints.setLastUpdated(LocalDateTime.now());

        return ecoPointsRepository.save(ecoPoints);
    }

    /**
     * Create initial EcoPoints entry for new student.
     */
    @Override
    public void initializeEcoPoints(User student) {

        if (ecoPointsRepository.findByStudent(student).isPresent()) {
            return; // already exists
        }

        EcoPoints ecoPoints = EcoPoints.builder()
                .student(student)
                .points(0)
                .lastUpdated(LocalDateTime.now())
                .build();

        ecoPointsRepository.save(ecoPoints);
    }

    /**
     * Internal helper
     */
    private EcoPoints createInitialEcoPoints(User student) {

        EcoPoints ecoPoints = EcoPoints.builder()
                .student(student)
                .points(0)
                .lastUpdated(LocalDateTime.now())
                .build();

        return ecoPointsRepository.save(ecoPoints);
    }
}
