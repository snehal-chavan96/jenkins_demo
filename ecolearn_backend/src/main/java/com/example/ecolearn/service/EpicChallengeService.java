package com.example.ecolearn.service;

import com.example.ecolearn.dto.epicChallenge.EpicSubmissionResponseDTO;
import com.example.ecolearn.dto.epicChallenge.ReviewSubmissionDTO;
import com.example.ecolearn.dto.epicChallenge.SubmitEpicChallengeDTO;
import com.example.ecolearn.entity.EpicChallengeSubmission;
import com.example.ecolearn.entity.User;
import com.example.ecolearn.repository.Challenge.EpicChallengeSubmissionRepo;
import com.example.ecolearn.repository.UserRepo.UserSignUpRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class EpicChallengeService {

    private final EpicChallengeSubmissionRepo submissionRepo;
    private final UserSignUpRepo userRepo;
    private final EcoPointsService ecoPointsService;

    public EpicChallengeService(
            EpicChallengeSubmissionRepo submissionRepo,
            UserSignUpRepo userRepo,
            EcoPointsService ecoPointsService) {
        this.submissionRepo = submissionRepo;
        this.userRepo = userRepo;
        this.ecoPointsService = ecoPointsService;
    }

    // ============================
    // STUDENT: Submit Challenge
    // ============================
    public void submitChallenge(SubmitEpicChallengeDTO dto) {

        User student = userRepo.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getUserType() != User.UserType.STUDENT) {
            throw new RuntimeException("Only students can submit challenges");
        }

        EpicChallengeSubmission submission = EpicChallengeSubmission.builder()
                .student(student)
                .challengeTitle(dto.getChallengeTitle())
                .ecoPoints(dto.getEcoPoints())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .status(EpicChallengeSubmission.Status.PENDING)
                .submittedAt(LocalDateTime.now())
                .build();

        submissionRepo.save(submission);
        log.info("Epic challenge submitted by student {}", student.getId());
    }

    // ============================
    // TEACHER: View Pending
    // ============================
    public List<EpicSubmissionResponseDTO> getPendingSubmissions() {

        return submissionRepo.findByStatus(EpicChallengeSubmission.Status.PENDING)
                .stream()
                .map(s -> new EpicSubmissionResponseDTO(
                        s.getId(),
                        s.getStudent().getName(),
                        s.getChallengeTitle(),
                        s.getEcoPoints(),
                        s.getStatus().name(),
                        s.getSubmittedAt()
                ))
                .collect(Collectors.toList());
    }

    // ============================
    // TEACHER: Review Submission
    // ============================
    public void reviewSubmission(Long submissionId, ReviewSubmissionDTO dto) {

        EpicChallengeSubmission submission = submissionRepo.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        if (submission.getStatus() != EpicChallengeSubmission.Status.PENDING) {
            throw new RuntimeException("Submission already reviewed");
        }

        User teacher = userRepo.findById(dto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (teacher.getUserType() != User.UserType.TEACHER) {
            throw new RuntimeException("Only teachers can review submissions");
        }

        if (dto.isApproved()) {
            submission.setStatus(EpicChallengeSubmission.Status.APPROVED);

            ecoPointsService.addEcoPoints(
                    submission.getStudent().getId(),
                    submission.getEcoPoints()
            );
        } else {
            submission.setStatus(EpicChallengeSubmission.Status.REJECTED);
        }

        submission.setReviewedBy(teacher);
        submission.setReviewedAt(LocalDateTime.now());

        submissionRepo.save(submission);
        log.info("Submission {} reviewed by teacher {}", submissionId, teacher.getId());
    }
}
