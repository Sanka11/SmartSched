package com.smartsched.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.smartsched.model.Event;


public interface EventRepository extends MongoRepository<Event, String> {

}

