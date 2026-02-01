package com.example.ecolearn.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="school_classes")
public class SchoolClass {

    @Id
    @GeneratedValue
    private long id;

    private String name;

}
