package com.smartsched.service;

import com.smartsched.model.AllClassAssignment;
import com.smartsched.model.User;
import com.smartsched.repository.AllClassAssignmentRepository;
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
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
private AllClassAssignmentRepository classAssignmentRepo;


    // ✅ Register a new user
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

    // 👇 TEMP LOGGING TO SEE WHAT PASSWORD IS SAVED
    System.out.println("Original raw password: " + user.getPassword());
    String encodedPassword = passwordEncoder.encode(user.getPassword());
    System.out.println("Encoded password: " + encodedPassword);

    user.setPassword(encodedPassword);

    User savedUser = userRepository.save(user);

    // Send welcome email
    emailService.sendRegistrationEmail(savedUser.getEmail(), savedUser.getFullName());

    return savedUser;
}


    // ✅ Login (authentication)
    public User authenticateUser(String email, String rawPassword) {
    System.out.println("Login attempt for email: " + email);
    System.out.println("Raw password input: " + rawPassword);

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    System.out.println("Encoded password stored: " + user.getPassword());

    if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
        System.out.println("Password mismatch");
        throw new RuntimeException("Invalid credentials");
    }

    System.out.println("Password matched successfully!");
    return user;
}


    // ✅ Update password
    public boolean updatePassword(String email, String newPassword) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            User existingUser = user.get();

            String encodedPassword = passwordEncoder.encode(newPassword);
            existingUser.setPassword(encodedPassword);

            userRepository.save(existingUser);
            return true;
        }
        return false;
    }

    // ✅ Update user role and permissions
    public User updateUserRoleAndPermissions(String userId, String role, List<String> permissions) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (role != null) {
            user.setRole(role);
        }

        if (permissions != null) {
            user.setPermissions(permissions);
        }

        return userRepository.save(user);
    }

    // ✅ Get all users
    public List<User> getAllUsersWithGroups() {
    List<User> users = userRepository.findAll();

    for (User user : users) {
        List<AllClassAssignment> assignments = classAssignmentRepo.findByEmailMatch(user.getEmail());

if (!assignments.isEmpty()) {
    user.setGroupName(assignments.get(0).getGroupName()); // or combine multiple
}

    
    }

    return users;
}


    // ✅ Delete user
    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }

    // ✅ Add user manually (used in /add endpoint)
    public User addUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (user.getRole() == null) {
            user.setRole("user");
        }

        if (user.getPermissions() == null) {
            user.setPermissions(List.of("read"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // ✅ Fetch user by ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
}
