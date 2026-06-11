package com.myportfolio.myportfolio1.Controller;

import com.myportfolio.myportfolio1.Entity.Admin;
import com.myportfolio.myportfolio1.Service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
    @RequestMapping("/api/admin")
    @CrossOrigin("*")
    public class AdminController {

        @Autowired
        private AdminService adminService;

        @PostMapping("/register")
        public String register(@RequestBody Admin admin) {
            return adminService.register(admin);
        }

        @PostMapping("/login")
        public String login(@RequestParam String email,
                            @RequestParam String password) {

            return adminService.login(email, password);
        }

        @PostMapping("/forgot-password")
        public String forgotPassword(@RequestParam String email) {

            return adminService.forgotPassword(email);
        }

        @PostMapping("/reset-password")
        public String resetPassword(@RequestParam String token,
                                    @RequestParam String newPassword) {

            return adminService.resetPassword(
                    token,
                    newPassword
            );
        }
}
