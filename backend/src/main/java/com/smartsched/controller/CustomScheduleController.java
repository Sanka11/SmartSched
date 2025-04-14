package com.smartsched.controller;

import com.smartsched.model.CustomSchedule;
import com.smartsched.service.CustomScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/custom-schedule")
@CrossOrigin(origins = "http://localhost:5173") // ✅ Or use "*" only in dev
public class CustomScheduleController {

    private final CustomScheduleService customScheduleService;

    @Autowired
    public CustomScheduleController(CustomScheduleService customScheduleService) {
        this.customScheduleService = customScheduleService;
    }

    // ✅ Save or update a personal task
    @PostMapping
    public CustomSchedule saveOrUpdateTask(@RequestBody CustomSchedule task) {
        return customScheduleService.saveOrUpdate(task);
    }

    // ✅ Get all tasks for a specific user by email
    @GetMapping("/{email}")
    public List<CustomSchedule> getTasksByEmail(@PathVariable String email) {
        return customScheduleService.getTasksForUser(email);
    }

    // ✅ Get a specific task by ID (for editing)
    @GetMapping("/task/{id}")
    public Optional<CustomSchedule> getTaskById(@PathVariable String id) {
        return customScheduleService.getById(id);
    }

    // ✅ Delete a specific task by ID
    @DeleteMapping("/delete/{id}")
    public void deleteTask(@PathVariable String id) {
        System.out.println("🗑 Deleting task with ID: " + id);
        customScheduleService.deleteById(id);
    }

    @DeleteMapping("/custom-schedule/user/{email}")
    public ResponseEntity<Void> deleteAllByUser(@PathVariable String email) {
        customScheduleService.deleteAllByEmail(email);
        return ResponseEntity.ok().build();
    }

}
