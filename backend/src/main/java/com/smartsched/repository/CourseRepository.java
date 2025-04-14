package com.smartsched.repository;

import com.smartsched.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;  // Add this import


public interface CourseRepository extends MongoRepository<Course, String> {
    Optional<Course> findByCustomCourseId(String customCourseId);
}