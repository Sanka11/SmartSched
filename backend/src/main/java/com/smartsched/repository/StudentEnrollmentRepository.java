package com.smartsched.repository;

import com.smartsched.model.StudentEnrollment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StudentEnrollmentRepository extends MongoRepository<StudentEnrollment, String> {
<<<<<<< Updated upstream
    List<StudentEnrollment> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName);
}
=======

    Optional<StudentEnrollment> findByEmail(String email); // ✅ valid

    List<StudentEnrollment> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName); // optional
}
>>>>>>> Stashed changes
