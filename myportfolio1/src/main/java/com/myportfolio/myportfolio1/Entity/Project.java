package com.myportfolio.myportfolio1.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String technology;

    private String githubUrl;

    private String liveDemoUrl;

    private String imageUrl;

    @Column(length = 2000)
    private String description;

    // getters setters
}