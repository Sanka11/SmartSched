package com.smartsched.repository;

import com.smartsched.model.StudentEnrollment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentEnrollmentRepository extends MongoRepository<StudentEnrollment, String> {

    Optional<StudentEnrollment> findByEmail(String email);

    List<StudentEnrollment> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName);
}
