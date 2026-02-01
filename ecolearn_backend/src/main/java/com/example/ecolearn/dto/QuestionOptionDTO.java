package com.example.ecolearn.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionOptionDTO {
    private Long id;
    private String optionText;
    private String optionImageUrl;
    private boolean isCorrect;
    private Integer displayOrder;
}
