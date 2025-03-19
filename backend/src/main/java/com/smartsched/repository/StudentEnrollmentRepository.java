package com.smartsched.repository;

import com.smartsched.model.StudentEnrollment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StudentEnrollmentRepository extends MongoRepository<StudentEnrollment, String> {
    List<StudentEnrollment> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName);
}