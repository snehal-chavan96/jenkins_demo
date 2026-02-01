package com.example.ecolearn.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

public class ChatRequest {
    @NotBlank(message = "Question is required")
    private String question;

    // getters and setters
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}
