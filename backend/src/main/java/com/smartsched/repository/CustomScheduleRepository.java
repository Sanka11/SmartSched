package com.smartsched.repository;

import com.smartsched.model.CustomSchedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomScheduleRepository extends MongoRepository<CustomSchedule, String> {
    List<CustomSchedule> findByEmail(String email);

    Optional<CustomSchedule> findByEmailAndDayAndTime(String email, String day, String time);

    void deleteByEmailAndDayAndTime(String email, String day, String time);
}