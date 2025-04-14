package com.smartsched;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.smartsched.repository") // ✅ This enables scanning for MongoDB repositories
public class SmartschedApplication {
	public static void main(String[] args) {
		SpringApplication.run(SmartschedApplication.class, args);
	}
}
