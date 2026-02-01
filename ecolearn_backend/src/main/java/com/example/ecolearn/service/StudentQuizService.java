package com.example.ecolearn.service;

import com.example.ecolearn.entity.Quiz;
import com.example.ecolearn.entity.StudentQuizAnswer;
import com.example.ecolearn.entity.StudentQuizAttempt;
import com.example.ecolearn.entity.User;
import com.example.ecolearn.repository.QuizRepo.QuizRepository;
import com.example.ecolearn.repository.QuizRepo.StudentQuizAnswerRepository;
import com.example.ecolearn.repository.QuizRepo.StudentQuizAttemptRepository;
import com.example.ecolearn.repository.UserRepo.UserSignUpRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Service
@Transactional
public class StudentQuizService {

    private final StudentQuizAttemptRepository attemptRepo;
    private final QuizRepository quizRepo;
    private final UserSignUpRepo userRepo;

    public StudentQuizService(
            StudentQuizAttemptRepository attemptRepo,
            QuizRepository quizRepo,
            UserSignUpRepo userRepo
    ) {
        this.attemptRepo = attemptRepo;
        this.quizRepo = quizRepo;
        this.userRepo = userRepo;
    }

    public StudentQuizAttempt submitQuiz(Long studentId, Long quizId, List<StudentQuizAnswer> answers) {
        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Determine attempt number
        int attemptNumber = attemptRepo.countByStudentAndQuiz(student, quiz) + 1;

        // Calculate correct answers and total points
        int correctAnswers = (int) answers.stream().filter(StudentQuizAnswer::isCorrect).count();
        int totalPoints = answers.stream().mapToInt(StudentQuizAnswer::getPointsEarned).sum();

        // Determine pass/fail using BigDecimal
        boolean passed = BigDecimal.valueOf(totalPoints)
                .compareTo(quiz.getPassingScore()) >= 0;

        // Create attempt
        StudentQuizAttempt attempt = StudentQuizAttempt.builder()
                .student(student)
                .quiz(quiz)
                .attemptNumber(attemptNumber)
                .totalQuestions(quiz.getQuestions().size())
                .correctAnswers(correctAnswers)
                .score(BigDecimal.valueOf(totalPoints))
                .passed(passed)
                .answers(answers)
                .startedAt(LocalDateTime.now())
                .completedAt(LocalDateTime.now())
                .build();

        // Link answers to attempt
        answers.forEach(a -> a.setQuizAttempt(attempt));

        // Save attempt (answers will cascade if mapped correctly)
        return attemptRepo.save(attempt);
    }

    public List<StudentQuizAttempt> getAttemptsForStudent(Long studentId, Long quizId) {
        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        return attemptRepo.findByStudentAndQuizOrderByAttemptNumberDesc(student, quiz);
    }
}
