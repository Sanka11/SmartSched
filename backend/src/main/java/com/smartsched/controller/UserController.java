package com.smartsched.controller;

import com.smartsched.model.User;
import com.smartsched.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend requests
public class UserController {

    @Autowired
    private UserService userService;

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Set default role and permissions if not provided
            if (user.getRole() == null) {
                user.setRole("user");
            }
            if (user.getPermissions() == null) {
                user.setPermissions(List.of("read"));
            }

            User registeredUser = userService.registerUser(user);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Login a user
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            User authenticatedUser = userService.loginUser(user.getEmail(), user.getPassword());
            return new ResponseEntity<>(authenticatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    // Update user role and permissions (Admin-only endpoint)
    @PutMapping("/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')") // Restrict to admins
    public ResponseEntity<?> updateUserRoleAndPermissions(
            @PathVariable String userId,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) List<String> permissions
    ) {
        try {
            User updatedUser = userService.updateUserRoleAndPermissions(userId, role, permissions);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all users (Admin-only endpoint)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Restrict to admins
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a user by ID (Admin-only endpoint)
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')") // Restrict to admins
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            userService.deleteUser(userId);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}