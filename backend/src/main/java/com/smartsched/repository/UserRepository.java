package com.smartsched.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.smartsched.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

}