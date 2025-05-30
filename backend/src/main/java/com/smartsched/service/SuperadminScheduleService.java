package com.smartsched.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartsched.dto.BulkScheduleRequest;
import com.smartsched.model.ConflictIssue;
import com.smartsched.model.GeneratedSchedule;
import com.smartsched.model.User;
import com.smartsched.repository.GeneratedScheduleRepository;
import com.smartsched.repository.UserRepository;
import com.smartsched.utils.ConflictChecker;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SuperadminScheduleService {

    private final UserRepository userRepository;
    private final GeneratedScheduleRepository scheduleRepository;

    private final String PYTHON_PATH = "venv/bin/python3"; // adjust if needed
    private final String SCRIPT_PATH = "src/main/resources/ai/scheduler.py";

    public SuperadminScheduleService(UserRepository userRepository,
                                     GeneratedScheduleRepository scheduleRepository) {
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public Map<String, Object> generateBulkSchedules(BulkScheduleRequest request) {
        List<String> emails = getTargetEmails(request);
        String role = request.getRole();

        if (emails.isEmpty()) {
            throw new IllegalArgumentException("No valid users found for bulk generation.");
        }

        try {
            // Prepare Python script arguments
            List<String> command = new ArrayList<>();
            command.add(PYTHON_PATH);
            command.add(SCRIPT_PATH);
            command.add("--emails");
            command.add(String.join(",", emails));
            command.add("--role");
            command.add(role == null ? "" : role);

            // Run the script
            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder outputLog = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                outputLog.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("AI scheduler failed: " + outputLog);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("message", "Timetables generated successfully.");
            result.put("log", outputLog.toString());
            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate schedules: " + e.getMessage(), e);
        }
    }

    public List<ConflictIssue> checkConflicts(BulkScheduleRequest request) {
        List<String> emails = getTargetEmails(request);
        if (emails.isEmpty()) {
            throw new IllegalArgumentException("No valid users found to check conflicts.");
        }

        List<GeneratedSchedule> schedules = scheduleRepository.findByUserEmailIn(emails);
        return ConflictChecker.detectConflicts(schedules);
    }

    // ✅ Utility method to fetch target emails
    private List<String> getTargetEmails(BulkScheduleRequest request) {
        if (request.getGroupName() != null && !request.getGroupName().isEmpty()) {
            return userRepository.findByGroupName(request.getGroupName())
                    .stream()
                    .map(User::getEmail)
                    .collect(Collectors.toList());
        } else if (request.getEmails() != null && !request.getEmails().isEmpty()) {
            return request.getEmails();
        } else {
            return Collections.emptyList();
        }
    }
}
