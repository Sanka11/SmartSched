package com.smartsched.service;

import com.smartsched.model.User;
import com.smartsched.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register a new user
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        if (user.getRole() == null) {
            user.setRole("user");
        }
        if (user.getPermissions() == null) {
            user.setPermissions(List.of("read"));
        }

        String rawPassword = user.getPassword();

        // ✅ Check if password is already hashed (starts with $2a or $2b)
        if (rawPassword.startsWith("$2a$") || rawPassword.startsWith("$2b$")) {
            System.out.println("⚠️ WARNING: Password already hashed. Skipping re-hashing.");
            user.setPassword(rawPassword);
        } else {
            String hashedPassword = passwordEncoder.encode(rawPassword);
            user.setPassword(hashedPassword);
        }

        return userRepository.save(user);
    }

    // login
    public User authenticateUser(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Debug: Check password matching
        System.out.println("🔐 Raw password: " + rawPassword);
        System.out.println("🔐 Hashed password: " + user.getPassword());
        boolean isMatch = passwordEncoder.matches(rawPassword, user.getPassword());
        System.out.println("✅ Password match result: " + isMatch);

        if (!isMatch) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    // update password

    public boolean updatePassword(String email, String newPassword) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            User existingUser = user.get();
            existingUser.setPassword(newPassword); // Assuming you have a setter for the password
            userRepository.save(existingUser);
            return true;
        }
        return false;
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

    public User addUser(User user) {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Set default role if not provided
        if (user.getRole() == null) {
            user.setRole("user");
        }
        if (user.getPermissions() == null) {
            user.setPermissions(List.of("read"));
        }

        return userRepository.save(user);
    }

    // Fetch user by ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

}