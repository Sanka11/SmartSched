package com.smartsched.repository;


import com.smartsched.model.AllCourse;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AllCourseRepository extends MongoRepository<AllCourse, String> {
    Optional<AllCourse> findByName(String name);
}
