package com.example.ecolearn.repository.QuizRepo;

import com.example.ecolearn.entity.Quiz;
import com.example.ecolearn.entity.StudentQuizAttempt;
import com.example.ecolearn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentQuizAttemptRepository extends JpaRepository<StudentQuizAttempt, Long> {
    int countByStudentAndQuiz(User student, Quiz quiz);
    List<StudentQuizAttempt> findByStudentAndQuizOrderByAttemptNumberDesc(User student, Quiz quiz);
}
