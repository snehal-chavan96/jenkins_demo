package com.example.ecolearn.service;

import com.example.ecolearn.dto.QuizDTO;

import java.util.List;

public interface QuizService {

    QuizDTO createQuiz(QuizDTO quizDTO, String authHeader);

    QuizDTO updateQuiz(Long quizId, QuizDTO quizDTO);

    void deleteQuiz(Long quizId);

    QuizDTO getQuizById(Long quizId);

    List<QuizDTO> getAllQuizzes();
}
