package com.example.ecolearn.service;

import com.example.ecolearn.dto.QuizDTO;
import com.example.ecolearn.entity.Quiz;
import com.example.ecolearn.entity.User;
import com.example.ecolearn.service.QuizMapper;
import com.example.ecolearn.repository.QuizRepo.QuizRepository;
import com.example.ecolearn.repository.UserRepo.UserSignUpRepo;
import com.example.ecolearn.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizServiceImpl implements QuizService {

    private static final Logger logger = LoggerFactory.getLogger(QuizServiceImpl.class);

    private final QuizRepository quizRepository;
    private final UserSignUpRepo userRepo;
    private final JwtUtil jwtUtil;
    private final QuizMapper quizMapper;

    public QuizServiceImpl(
            QuizRepository quizRepository,
            UserSignUpRepo userRepo,
            JwtUtil jwtUtil,
            QuizMapper quizMapper
    ) {
        this.quizRepository = quizRepository;
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
        this.quizMapper = quizMapper;
    }

    @Override
    public QuizDTO createQuiz(QuizDTO quizDTO, String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtil.getUsernameFromToken(token);

        User user = userRepo.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Invalid user");
        }

        Quiz quiz = quizMapper.toEntity(quizDTO, user);
        Quiz savedQuiz = quizRepository.save(quiz);

        logger.info("Quiz created with ID: {}", savedQuiz.getId());
        return quizMapper.toDTO(savedQuiz);
    }

    @Override
    public QuizDTO updateQuiz(Long quizId, QuizDTO quizDTO) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        quizMapper.updateEntity(quiz, quizDTO);
        Quiz updatedQuiz = quizRepository.save(quiz);

        logger.info("Quiz updated with ID: {}", quizId);
        return quizMapper.toDTO(updatedQuiz);
    }

    @Override
    public void deleteQuiz(Long quizId) {
        quizRepository.deleteById(quizId);
        logger.info("Quiz deleted with ID: {}", quizId);
    }

    @Override
    public QuizDTO getQuizById(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        return quizMapper.toDTO(quiz);
    }

    @Override
    public List<QuizDTO> getAllQuizzes() {
        return quizRepository.findAll()
                .stream()
                .map(quizMapper::toDTO)
                .collect(Collectors.toList());
    }
}
