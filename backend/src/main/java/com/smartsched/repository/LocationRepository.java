package com.smartsched.repository;

import com.smartsched.model.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends MongoRepository<Location, String> {
    // You can define custom query methods here if needed
}
