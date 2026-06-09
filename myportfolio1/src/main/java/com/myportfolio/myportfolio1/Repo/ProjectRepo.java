package com.myportfolio.myportfolio1.Repo;

import com.myportfolio.myportfolio1.Entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepo extends JpaRepository<Project, Long> {
}

