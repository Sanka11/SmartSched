package com.smartsched.controller;

import com.smartsched.model.User;
import com.smartsched.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend requests
public class UserController {

    @Autowired
    private UserService userService;
    

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
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        try {
            User user = userService.authenticateUser(email, password);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
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


    @PutMapping("/forgot-password")
    public ResponseEntity<String> updatePassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String newPassword = requestBody.get("newPassword");
    
        boolean isUpdated = userService.updatePassword(email, newPassword);
        if (isUpdated) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(400).body("User not found or password update failed");
        }
    }
    


    @PostMapping("/add")
@PreAuthorize("hasRole('ADMIN')") // Restrict to admins
public ResponseEntity<?> addUser(@RequestBody User user) {
    try {
        User newUser = userService.registerUser(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    } catch (RuntimeException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}

  // Get user profile by ID
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // Authenticated users only
  public ResponseEntity<?> getUserProfile(@PathVariable String id) {
      Optional<User> user = userService.getUserById(id);
      return user.map(ResponseEntity::ok)
                 .orElseGet(() -> ResponseEntity.notFound().build());
  }
}