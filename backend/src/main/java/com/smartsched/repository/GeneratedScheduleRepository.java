package com.smartsched.repository;

import com.smartsched.model.GeneratedSchedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GeneratedScheduleRepository extends MongoRepository<GeneratedSchedule, String> {

    // Fetch the latest generated schedule (by insertion order)
    GeneratedSchedule findTopByOrderByIdDesc();
}
