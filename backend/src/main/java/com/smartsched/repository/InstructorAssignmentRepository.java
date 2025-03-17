package com.smartsched.repository;

import com.smartsched.model.InstructorAssignment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface InstructorAssignmentRepository extends MongoRepository<InstructorAssignment, String> {
    Optional<InstructorAssignment> findByEmail(String email);
}