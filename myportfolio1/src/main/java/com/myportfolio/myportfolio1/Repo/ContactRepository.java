package com.myportfolio.myportfolio1.Repo;

import com.myportfolio.myportfolio1.Entity.Contect;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contect, Long> {
}
