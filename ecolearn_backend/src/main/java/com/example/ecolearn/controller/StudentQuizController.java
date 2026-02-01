package com.example.ecolearn.controller;

import com.example.ecolearn.entity.StudentQuizAnswer;
import com.example.ecolearn.entity.StudentQuizAttempt;
import com.example.ecolearn.service.StudentQuizService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-quizzes")
public class StudentQuizController {

    private final StudentQuizService quizService;

    public StudentQuizController(StudentQuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/attempt")
    public ResponseEntity<StudentQuizAttempt> submitAttempt(
            @RequestBody List<StudentQuizAnswer> answers,
            @RequestParam Long studentId,
            @RequestParam Long quizId
    ) {
        StudentQuizAttempt attempt = quizService.submitQuiz(studentId, quizId, answers);
        return ResponseEntity.ok(attempt);
    }

    @GetMapping("/attempts")
    public ResponseEntity<List<StudentQuizAttempt>> getAttempts(
            @RequestParam Long studentId,
            @RequestParam Long quizId
    ) {
        List<StudentQuizAttempt> attempts = quizService.getAttemptsForStudent(studentId, quizId);
        return ResponseEntity.ok(attempts);
    }
}

