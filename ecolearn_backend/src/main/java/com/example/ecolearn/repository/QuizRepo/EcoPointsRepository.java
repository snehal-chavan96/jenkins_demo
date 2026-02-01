package com.example.ecolearn.repository.QuizRepo;

import com.example.ecolearn.entity.EcoPoints;
import com.example.ecolearn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EcoPointsRepository extends JpaRepository<EcoPoints, Long> {

    Optional<EcoPoints> findByStudent(User student);

}

