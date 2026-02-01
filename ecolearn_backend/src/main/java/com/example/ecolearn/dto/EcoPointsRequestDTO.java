package com.example.ecolearn.dto;

import jakarta.validation.constraints.Min;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EcoPointsRequestDTO {

        @Min(value = 1, message = "Points must be at least 1")
        private int points;
    }


