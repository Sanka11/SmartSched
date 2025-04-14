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
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from frontend
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Register new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            if (user.getRole() == null) {
                user.setRole("USER"); // Default role without ROLE_ prefix
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

    // ✅ Login endpoint
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

    // ✅ Get all users (SUPERADMIN or ADMIN)
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ✅ Update user role and permissions
    @PutMapping("/{userId}/role")
    @PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN')")
    public ResponseEntity<?> updateUserRoleAndPermissions(
            @PathVariable String userId,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) List<String> permissions) {
        try {
            User updatedUser = userService.updateUserRoleAndPermissions(userId, role, permissions);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // ✅ Add a new user
    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN')")
    public ResponseEntity<?> addUser(@RequestBody User user) {
        try {
            if (user.getRole() == null) {
                user.setRole("USER");
            }
            if (user.getPermissions() == null) {
                user.setPermissions(List.of("read"));
            }
            User newUser = userService.registerUser(user);
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // ✅ Delete user
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            userService.deleteUser(userId);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // ✅ Forgot password endpoint
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
    

    // ✅ Get user by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'SUPERADMIN', 'ADMIN')")
    public ResponseEntity<?> getUserProfile(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
