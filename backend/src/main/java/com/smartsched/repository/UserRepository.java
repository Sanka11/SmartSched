package com.smartsched.repository;

import com.smartsched.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findAll(); 
    List<User> findByGroupName(String groupName);
    // Method to find a user by email
}