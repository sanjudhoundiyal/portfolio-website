package com.myportfolio.myportfolio1.Controller;

import com.myportfolio.myportfolio1.Entity.Project;
import com.myportfolio.myportfolio1.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin("*")
public class ProjectController {

    @Autowired
    private ProjectService service;

    // Get All Projects
    @GetMapping
    public List<Project> getProjects() {
        return service.getAllProjects();
    }

    // Add Project
    @PostMapping
    public Project addProject(@RequestBody Project project) {
        return service.save(project);
    }

    // Update Project
    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody Project project) {

        project.setId(id);
        return service.save(project);
    }

    // Delete Project
    @DeleteMapping("/{id}")
    public String deleteProject(@PathVariable Long id) {
        service.deleteProject(id);
        return "Project Deleted Successfully";
    }
}

