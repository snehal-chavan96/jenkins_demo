package com.example.ecolearn.repository.UserRepo;

import com.example.ecolearn.entity.StudentDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentDetailsRepo extends JpaRepository<StudentDetails, Long> {

    Optional<StudentDetails> findByUserId(Long userId);

    List<StudentDetails> findTop10ByOrderByEcoPointsDesc();
}


