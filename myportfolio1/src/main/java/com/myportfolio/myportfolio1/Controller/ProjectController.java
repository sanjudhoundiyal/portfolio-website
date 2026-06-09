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

    @GetMapping
    public List<Project> getProjects() {
        return service.getAllProjects();
    }

    @PostMapping
    public Project addProject(
            @RequestBody Project project) {
        return service.save(project);
    }
}
