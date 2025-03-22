package com.smartsched.repository;

import com.smartsched.model.AllClassAssignment;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AllClassAssignmentRepository extends MongoRepository<AllClassAssignment, String> {
    List<AllClassAssignment> findByCourseId(String courseId);
}