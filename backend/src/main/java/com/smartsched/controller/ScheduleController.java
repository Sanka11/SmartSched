package com.smartsched.controller;

import com.smartsched.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = "*") // Optional: limit to frontend domain/port in production
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/student/{email}")
    public Map<String, List<Map<String, Object>>> getStudentTimetable(@PathVariable String email) {
        return scheduleService.getScheduleForStudent(email);
    }

    @GetMapping("/instructor/{email}")
    public Map<String, List<Map<String, Object>>> getInstructorTimetable(@PathVariable String email) {
        return scheduleService.getScheduleForInstructor(email);
    }

    @GetMapping("/test")
    public String testApi() {
        return "Hello from SmartSched!";
    }

    // ✅ FINAL - Generate Timetable for a Specific User Based on Email & Role
    @GetMapping("/generate/{email}/{role}")
    public ResponseEntity<String> generateTimetableForUser(@PathVariable String email, @PathVariable String role) {
        try {
            // ✅ Full path to venv Python interpreter
            String pythonPath = "/Users/pramodravisanka/Documents/Year 3 Semester 2/ITPM/smartsched/backend/venv/bin/python3";
            String scriptPath = "src/main/resources/ai/scheduler.py";

            // ✅ Add --email and --role arguments for Python to handle
            ProcessBuilder pb = new ProcessBuilder(
                    pythonPath, scriptPath,
                    "--email", email,
                        "--role", role);
                    
                    pb.directory(new File(System.getProperty("user.dir")));
            pb.redirectErrorStream(true);

            Process process = pb.start();

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println("[PYTHON OUTPUT] " + line);
                }
            }

            return ResponseEntity.ok("✅ Timetable generation started for " + role + ": " + email);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Failed to run scheduler: " + e.getMessage());
        }
    }
}
