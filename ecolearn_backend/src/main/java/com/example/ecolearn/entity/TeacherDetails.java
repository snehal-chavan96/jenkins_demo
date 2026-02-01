    package com.example.ecolearn.entity;
    
    import jakarta.persistence.*;
    import jakarta.validation.constraints.Min;
    import lombok.*;
    
    @Entity
    @Table(name = "teacher_details")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class TeacherDetails {
    
        @Id
        private Long userId;
    
        @OneToOne
        @MapsId
        @JoinColumn(name = "user_id")
        private User user;
    
        private String department;
    
        @Min(0)
        @Builder.Default
        private Integer experienceYears = 0;
    }
    
