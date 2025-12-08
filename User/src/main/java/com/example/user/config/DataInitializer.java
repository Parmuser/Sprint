package com.example.user.config;

import com.example.user.entity.User;
import com.example.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if users already exist
        if (userRepository.count() == 0) {
            // Create some sample users for testing
            User user1 = new User();
            user1.setUsername("admin");
            user1.setEmail("admin@example.com");
            user1.setPassword(passwordEncoder.encode("admin123"));

            User user2 = new User();
            user2.setUsername("john");
            user2.setEmail("john@example.com");
            user2.setPassword(passwordEncoder.encode("john123"));

            User user3 = new User();
            user3.setUsername("jane");
            user3.setEmail("jane@example.com");
            user3.setPassword(passwordEncoder.encode("jane123"));

            userRepository.save(user1);
            userRepository.save(user2);
            userRepository.save(user3);

            System.out.println("Sample users created successfully!");
        } else {
            System.out.println("Users already exist in the database.");
        }
    }
}
