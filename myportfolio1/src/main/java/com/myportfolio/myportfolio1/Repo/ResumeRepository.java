package com.myportfolio.myportfolio1.Repo;

import com.myportfolio.myportfolio1.Entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {


    Resume findTopByOrderByIdDesc();
}