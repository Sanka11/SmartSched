package com.smartsched.repository.custom;

import com.mongodb.client.DistinctIterable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
public class CustomAllClassAssignmentRepositoryImpl implements CustomAllClassAssignmentRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<String> findDistinctGroupNames() {
        DistinctIterable<String> iterable = mongoTemplate
            .getCollection("allclassassignment")
            .distinct("groupName", String.class);

        return StreamSupport.stream(iterable.spliterator(), false)
            .collect(Collectors.toList());
    }
}
