package com.myportfolio.myportfolio1.Service;


import com.myportfolio.myportfolio1.Entity.Resume;
import com.myportfolio.myportfolio1.Repo.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    private final String UPLOAD_DIR = "uploads/";

    public Resume uploadResume(MultipartFile file) {

        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            String filePath = UPLOAD_DIR + file.getOriginalFilename();

            Path path = Paths.get(filePath);
            Files.write(path, file.getBytes());

            Resume resume = new Resume();
            resume.setFileName(file.getOriginalFilename());
            resume.setFileType(file.getContentType());
            resume.setFilePath(filePath);

            return resumeRepository.save(resume);

        } catch (Exception e) {
            throw new RuntimeException("File upload failed");
        }
    }
}