package com.example.ecolearn.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "institutions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Institution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InstitutionType type; // SCHOOL or COLLEGE

    private String address;
    private String city;
    private String state;
    private String country;

    @Column(name = "date_created", updatable = false)
    private LocalDateTime dateCreated = LocalDateTime.now();
}
