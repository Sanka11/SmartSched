package com.smartsched.repository;

import com.smartsched.model.AllClassAssignment;
import com.smartsched.repository.custom.CustomAllClassAssignmentRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllClassAssignmentRepository
        extends MongoRepository<AllClassAssignment, String>, CustomAllClassAssignmentRepository {

    List<AllClassAssignment> findByCourseId(String courseId);

    List<AllClassAssignment> findByGroupName(String groupName);

    @Query("{ $or: [ { 'instructorEmail': ?0 }, { 'studentEmail': ?0 } ] }")
    List<AllClassAssignment> findByEmailMatch(String email);
}
