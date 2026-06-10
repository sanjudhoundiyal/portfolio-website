package com.myportfolio.myportfolio1.Service;

import com.myportfolio.myportfolio1.Entity.Project;
import com.myportfolio.myportfolio1.Repo.ProjectRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepo repository;

    public List<Project> getAllProjects() {
        return repository.findAll();
    }

    public Project save(Project project) {
        return repository.save(project);
    }


    public void deleteProject(Long id) {
        repository.deleteById(id);
    }
}