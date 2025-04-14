package com.smartsched.repository;

import com.smartsched.model.GeneratedSchedule;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GeneratedScheduleRepository extends MongoRepository<GeneratedSchedule, String> {

    // Fetch the most recent schedule for a specific user
    GeneratedSchedule findTopByGeneratedByAndTimetableNotNullOrderByGeneratedAtDesc(String generatedBy);

    List<GeneratedSchedule> findByUserEmailIn(List<String> emails);
}
