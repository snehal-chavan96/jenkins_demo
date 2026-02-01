package com.example.ecolearn.dto;

public class StudentEcoStatsDTO {

    private int ecoPoints;
    private String level;

    public StudentEcoStatsDTO(int ecoPoints, String level) {
        this.ecoPoints = ecoPoints;
        this.level = level;
    }

    public int getEcoPoints() {
        return ecoPoints;
    }

    public String getLevel() {
        return level;
    }
}
