package com.example.ecolearn.controller;

import com.example.ecolearn.dto.QuizDTO;
import com.example.ecolearn.service.QuizService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private static final Logger logger = LoggerFactory.getLogger(QuizController.class);

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping
    public ResponseEntity<QuizDTO> createQuiz(
            @RequestBody QuizDTO quizDTO,
            @RequestHeader("Authorization") String authHeader
    ) {
        logger.info("Request to create quiz");
        QuizDTO createdQuiz = quizService.createQuiz(quizDTO, authHeader);
        return ResponseEntity.ok(createdQuiz);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizDTO> updateQuiz(
            @PathVariable Long id,
            @RequestBody QuizDTO quizDTO
    ) {
        logger.info("Request to update quiz with ID: {}", id);
        QuizDTO updatedQuiz = quizService.updateQuiz(id, quizDTO);
        return ResponseEntity.ok(updatedQuiz);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        logger.info("Request to delete quiz with ID: {}", id);
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO> getQuiz(@PathVariable Long id) {
        logger.info("Request to get quiz with ID: {}", id);
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @GetMapping
    public ResponseEntity<List<QuizDTO>> getAllQuizzes() {
        logger.info("Request to get all quizzes");
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }
}
