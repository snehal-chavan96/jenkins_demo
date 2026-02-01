package com.example.ecolearn.repository.Challenge;

import com.example.ecolearn.entity.EpicChallengeSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EpicChallengeSubmissionRepo
        extends JpaRepository<EpicChallengeSubmission, Long> {

    List<EpicChallengeSubmission> findByStatus(
            EpicChallengeSubmission.Status status
    );

    List<EpicChallengeSubmission> findByStudent_Id(Long studentId);
}
