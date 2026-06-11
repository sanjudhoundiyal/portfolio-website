package com.myportfolio.myportfolio1.Service;

import com.myportfolio.myportfolio1.Entity.Admin;
import com.myportfolio.myportfolio1.Repo.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;
import java.util.UUID;


public class AdminService {




    @Autowired
    private AdminRepo adminRepository;

    // Register
    public String register(Admin admin) {

        if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
            return "Email already exists";
        }

        adminRepository.save(admin);
        return "Admin Registered Successfully";
    }

    // Login
    public String login(String email, String password) {

        Optional<Admin> admin =
                adminRepository.findByEmail(email);

        if (admin.isPresent()
                && admin.get().getPassword().equals(password)) {

            return "Login Successful";
        }

        return "Invalid Email or Password";
    }

    // Forgot Password
    public String forgotPassword(String email) {

        Optional<Admin> admin =
                adminRepository.findByEmail(email);

        if (admin.isEmpty()) {
            return "Email Not Found";
        }

        String token = UUID.randomUUID().toString();

        Admin existingAdmin = admin.get();
        existingAdmin.setResetToken(token);

        adminRepository.save(existingAdmin);

        return token;
    }

    // Reset Password
    public String resetPassword(String token,
                                String newPassword) {

        Optional<Admin> admin =
                adminRepository.findByResetToken(token);

        if (admin.isEmpty()) {
            return "Invalid Token";
        }

        Admin existingAdmin = admin.get();

        existingAdmin.setPassword(newPassword);
        existingAdmin.setResetToken(null);

        adminRepository.save(existingAdmin);

        return "Password Updated Successfully";
    }
}

