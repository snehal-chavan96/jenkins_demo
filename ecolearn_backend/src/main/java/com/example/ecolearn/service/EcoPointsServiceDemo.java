package com.example.ecolearn.service;


import com.example.ecolearn.entity.EcoPoints;
import com.example.ecolearn.entity.User;

public interface EcoPointsServiceDemo {

    EcoPoints getEcoPoints(User student);

    EcoPoints addPoints(User student, int points);

    EcoPoints deductPoints(User student, int points);

    void initializeEcoPoints(User student);
}

