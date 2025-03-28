package com.smartsched;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
		"com.smartsched.config",
		"com.smartsched.controller",
		"com.smartsched.repository",
		"com.smartsched.model",
		"com.smartsched.service"
}) // ✅ Explicit scan
@EnableMongoRepositories(basePackages = "com.smartsched.repository")
public class SmartschedApplication {
	public static void main(String[] args) {
		SpringApplication.run(SmartschedApplication.class, args);
	}
}
