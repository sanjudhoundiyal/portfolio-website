package com.myportfolio.myportfolio1.Controller;


import com.myportfolio.myportfolio1.Entity.Resume;
import com.myportfolio.myportfolio1.Repo.ResumeRepository;
import com.myportfolio.myportfolio1.Service.ResumeService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin("*")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;


    @Autowired
    private ResumeRepository resumeRepository;



    @PostMapping("/upload")
    public ResponseEntity<Resume> uploadResume(
            @RequestParam("file") MultipartFile file) {

        Resume resume = resumeService.uploadResume(file);

        return ResponseEntity.ok(resume);
    }




    @GetMapping("/download")
    public ResponseEntity<Resource> downloadResume() throws Exception {

        Resume resume = resumeRepository.findTopByOrderByIdDesc();

        Path path = Paths.get(resume.getFilePath());

        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
