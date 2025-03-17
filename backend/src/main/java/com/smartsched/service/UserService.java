package com.smartsched.service;

import com.smartsched.model.User;
import com.smartsched.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // Password encoder

    // Register a new user
    public User registerUser(User user) {
        // Check if the email is already registered
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Set default role and permissions if not provided
        if (user.getRole() == null) {
            user.setRole("user");
        }
        if (user.getPermissions() == null) {
            user.setPermissions(List.of("read"));
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save the user
        return userRepository.save(user);
    }

    // Login a user
    public User loginUser(String email, String password) {
        // Find the user by email
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // If user is not found, throw an exception
        User user = optionalUser.orElseThrow(() -> new RuntimeException("User not found."));

        // Validate password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password.");
        }

        // Return the user if password matches
        return user;
    }

    // Update user role and permissions
    public User updateUserRoleAndPermissions(String userId, String role, List<String> permissions) {
        // Find the user by ID
        Optional<User> optionalUser = userRepository.findById(userId);

        // If user is not found, throw an exception
        User user = optionalUser.orElseThrow(() -> new RuntimeException("User not found."));

        // Update role if provided
        if (role != null) {
            user.setRole(role);
        }

        // Update permissions if provided
        if (permissions != null) {
            user.setPermissions(permissions);
        }

        // Save the updated user
        return userRepository.save(user);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    // Delete a user by ID
    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }
}