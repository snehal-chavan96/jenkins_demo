package com.example.ecolearn.service;

import com.example.ecolearn.dto.*;
import com.example.ecolearn.entity.*;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class QuizMapper {

    public Quiz toEntity(QuizDTO dto, User user) {

        Quiz quiz = new Quiz();
        quiz.setTitle(dto.getTitle());
        quiz.setDescription(dto.getDescription());
        quiz.setTotalQuestions(dto.getTotalQuestions());
        quiz.setPassingScore(dto.getPassingScore() != null ? dto.getPassingScore() : BigDecimal.ZERO);
        quiz.setTimeLimitMinutes(dto.getTimeLimitMinutes());
        quiz.setMaxAttempts(dto.getMaxAttempts() != null ? dto.getMaxAttempts() : 1);
        quiz.setActive(true);
        quiz.setCreatedBy(user);

        quiz.setQuestions(buildQuestions(dto, quiz));
        return quiz;
    }

    public void updateEntity(Quiz quiz, QuizDTO dto) {

        quiz.setTitle(dto.getTitle());
        quiz.setDescription(dto.getDescription());
        quiz.setTotalQuestions(dto.getTotalQuestions());
        quiz.setPassingScore(dto.getPassingScore());
        quiz.setTimeLimitMinutes(dto.getTimeLimitMinutes());
        quiz.setMaxAttempts(dto.getMaxAttempts());
        quiz.setActive(dto.isActive());

        // Existing questions map
        Map<Long, QuizQuestion> existingMap = quiz.getQuestions()
                .stream()
                .filter(q -> q.getId() != null)
                .collect(Collectors.toMap(QuizQuestion::getId, q -> q));

        List<QuizQuestion> updatedQuestions = new ArrayList<>();

        for (QuizQuestionDTO qDTO : dto.getQuestions()) {

            QuizQuestion question = (qDTO.getId() != null && existingMap.containsKey(qDTO.getId()))
                    ? existingMap.get(qDTO.getId())
                    : new QuizQuestion();

            question.setQuiz(quiz);
            question.setQuestionText(qDTO.getQuestionText());
            question.setPoints(qDTO.getPoints());
            question.setDisplayOrder(qDTO.getDisplayOrder());

            //  IMAGE FIX
            if (qDTO.getQuestionImageUrl() != null) {
                question.setQuestionImageUrl(qDTO.getQuestionImageUrl());
            }

            // Options handled SAME WAY (merge by ID)
            mergeOptions(question, qDTO.getOptions());

            updatedQuestions.add(question);
        }

        quiz.getQuestions().clear();
        quiz.getQuestions().addAll(updatedQuestions);
    }


    public QuizDTO toDTO(Quiz quiz) {

        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setTotalQuestions(quiz.getTotalQuestions());
        dto.setPassingScore(quiz.getPassingScore());
        dto.setTimeLimitMinutes(quiz.getTimeLimitMinutes());
        dto.setMaxAttempts(quiz.getMaxAttempts());
        dto.setActive(quiz.isActive());

        List<QuizQuestionDTO> questionDTOs = new ArrayList<>();

        for (QuizQuestion q : quiz.getQuestions()) {
            QuizQuestionDTO qDTO = new QuizQuestionDTO();
            qDTO.setId(q.getId());
            qDTO.setQuestionText(q.getQuestionText());
            qDTO.setQuestionImageUrl(q.getQuestionImageUrl());
            qDTO.setPoints(q.getPoints());
            qDTO.setDisplayOrder(q.getDisplayOrder());
            qDTO.setDifficultyLevel(
                    q.getDifficultyLevel() != null ? q.getDifficultyLevel().name() : null
            );

            List<QuestionOptionDTO> optionDTOs = new ArrayList<>();
            for (QuestionOption o : q.getOptions()) {
                QuestionOptionDTO oDTO = new QuestionOptionDTO();
                oDTO.setId(o.getId());
                oDTO.setOptionText(o.getOptionText());
                oDTO.setOptionImageUrl(o.getOptionImageUrl());
                oDTO.setCorrect(o.isCorrect());
                oDTO.setDisplayOrder(o.getDisplayOrder());
                optionDTOs.add(oDTO);
            }

            qDTO.setOptions(optionDTOs);
            questionDTOs.add(qDTO);
        }

        dto.setQuestions(questionDTOs);
        return dto;
    }

    private List<QuizQuestion> buildQuestions(QuizDTO dto, Quiz quiz) {

        List<QuizQuestion> questions = new ArrayList<>();

        if (dto.getQuestions() == null) return questions;

        for (QuizQuestionDTO qDTO : dto.getQuestions()) {
            QuizQuestion question = new QuizQuestion();
            question.setQuiz(quiz);
            question.setQuestionText(qDTO.getQuestionText());
            question.setQuestionImageUrl(qDTO.getQuestionImageUrl());
            question.setPoints(qDTO.getPoints());
            question.setDisplayOrder(qDTO.getDisplayOrder());

            if (qDTO.getDifficultyLevel() != null) {
                question.setDifficultyLevel(
                        QuizQuestion.DifficultyLevel.valueOf(qDTO.getDifficultyLevel().toUpperCase())
                );
            }

            List<QuestionOption> options = new ArrayList<>();
            for (QuestionOptionDTO oDTO : qDTO.getOptions()) {
                QuestionOption option = new QuestionOption();
                option.setQuestion(question);
                option.setOptionText(oDTO.getOptionText());
                option.setOptionImageUrl(oDTO.getOptionImageUrl());
                option.setCorrect(oDTO.isCorrect());
                option.setDisplayOrder(oDTO.getDisplayOrder());
                options.add(option);
            }

            question.setOptions(options);
            questions.add(question);
        }

        return questions;
    }
    private void mergeOptions(QuizQuestion question, List<QuestionOptionDTO> optionDTOs) {

        if (optionDTOs == null) return;

        Map<Long, QuestionOption> existingMap = question.getOptions()
                .stream()
                .filter(o -> o.getId() != null)
                .collect(Collectors.toMap(QuestionOption::getId, o -> o));

        List<QuestionOption> updatedOptions = new ArrayList<>();

        for (QuestionOptionDTO oDTO : optionDTOs) {

            QuestionOption option = (oDTO.getId() != null && existingMap.containsKey(oDTO.getId()))
                    ? existingMap.get(oDTO.getId())
                    : new QuestionOption();

            option.setQuestion(question);
            option.setOptionText(oDTO.getOptionText());
            option.setCorrect(oDTO.isCorrect());
            option.setDisplayOrder(oDTO.getDisplayOrder());

            // IMAGE SAFE UPDATE
            if (oDTO.getOptionImageUrl() != null && !oDTO.getOptionImageUrl().isBlank()) {
                option.setOptionImageUrl(oDTO.getOptionImageUrl());
            }

            updatedOptions.add(option);
        }

        question.getOptions().clear();
        question.getOptions().addAll(updatedOptions);
    }

}
