package com.example.ecolearn.dto;

public class LeaderboardDTO {

    private String studentName;
    private int ecoPoints;
    private String level;

    public LeaderboardDTO(String studentName, int ecoPoints, String level) {
        this.studentName = studentName;
        this.ecoPoints = ecoPoints;
        this.level = level;
    }

    public String getStudentName() {
        return studentName;
    }

    public int getEcoPoints() {
        return ecoPoints;
    }

    public String getLevel() {
        return level;
    }
}
