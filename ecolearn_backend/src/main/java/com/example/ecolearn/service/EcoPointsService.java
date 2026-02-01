package com.example.ecolearn.service;

import com.example.ecolearn.dto.LeaderboardDTO;
import com.example.ecolearn.dto.StudentEcoStatsDTO;
import com.example.ecolearn.entity.StudentDetails;
import com.example.ecolearn.entity.User;
import com.example.ecolearn.repository.UserRepo.StudentDetailsRepo;
import com.example.ecolearn.repository.UserRepo.UserSignUpRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class EcoPointsService {

    private final StudentDetailsRepo studentDetailsRepo;
    private final UserSignUpRepo userRepo;

    public EcoPointsService(StudentDetailsRepo studentDetailsRepo,
                            UserSignUpRepo userRepo) {
        this.studentDetailsRepo = studentDetailsRepo;
        this.userRepo = userRepo;
    }

    // 🔥 Core method: get OR create student profile
    private StudentDetails getOrCreateStudent(Long userId) {
        return studentDetailsRepo.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepo.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    if (user.getUserType() != User.UserType.STUDENT) {
                        throw new RuntimeException("User is not a student");
                    }

                    StudentDetails student = StudentDetails.builder()
                            .user(user) // IMPORTANT for MapsId
                            .gradeLevel(StudentDetails.GradeLevel.PRIMARY)
                            .ecoPoints(0)
                            .build();

                    StudentDetails saved = studentDetailsRepo.save(student);
                    log.info("Created new StudentDetails for userId {}", userId);
                    return saved;
                });
    }

    // Add EcoPoints
    public void addEcoPoints(Long userId, int points) {
        if (points <= 0) {
            throw new RuntimeException("Points must be positive");
        }
        StudentDetails student = getOrCreateStudent(userId);
        int newPoints = student.getEcoPoints() + points;
        student.setEcoPoints(newPoints);
        studentDetailsRepo.save(student);
        log.info("StudentId {} now has {} EcoPoints", userId, newPoints);
    }

    // Get student stats
    public StudentEcoStatsDTO getStudentEcoStats(Long userId) {
        StudentDetails student = getOrCreateStudent(userId);
        int points = student.getEcoPoints();
        String level = calculateLevel(points);
        return new StudentEcoStatsDTO(points, level);
    }

    // Leaderboard
    public List<LeaderboardDTO> getLeaderboard() {
        List<StudentDetails> students = studentDetailsRepo.findTop10ByOrderByEcoPointsDesc();
        List<LeaderboardDTO> leaderboard = new ArrayList<>();
        for (StudentDetails s : students) {
            leaderboard.add(new LeaderboardDTO(
                    s.getUser().getName(),
                    s.getEcoPoints(),
                    calculateLevel(s.getEcoPoints())
            ));
        }
        return leaderboard;
    }

    // Level logic
    private String calculateLevel(int points) {
        if (points >= 300) return "ECO_HERO";
        if (points >= 100) return "EXPLORER";
        return "BEGINNER";
    }
}
