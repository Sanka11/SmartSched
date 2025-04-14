package com.smartsched.service;

import com.smartsched.model.CustomSchedule;
import com.smartsched.repository.CustomScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomScheduleService {

    private final CustomScheduleRepository customScheduleRepository;

    @Autowired
    public CustomScheduleService(CustomScheduleRepository customScheduleRepository) {
        this.customScheduleRepository = customScheduleRepository;
    }

    // Save or update task by checking unique combination of email+day+time
    public CustomSchedule saveOrUpdate(CustomSchedule task) {
        List<CustomSchedule> existingTasks = customScheduleRepository.findByEmail(task.getEmail());

        for (CustomSchedule existing : existingTasks) {
            if (existing.getDay().equals(task.getDay()) && existing.getTime().equals(task.getTime())) {
                // Update existing task's content
                existing.setTitle(task.getTitle());
                existing.setDescription(task.getDescription());
                existing.setIcon(task.getIcon());
                existing.setColor(task.getColor());
                return customScheduleRepository.save(existing);
            }
        }

        // If no existing match, create new
        return customScheduleRepository.save(task);
    }

    // Get all tasks for a specific user
    public List<CustomSchedule> getTasksForUser(String email) {
        return customScheduleRepository.findByEmail(email);
    }

    // Get a single task by its ID
    public Optional<CustomSchedule> getById(String id) {
        return customScheduleRepository.findById(id);
    }

    // Delete a task by its ID
    public void deleteById(String id) {
        customScheduleRepository.deleteById(id);
    }

    public void deleteAllByEmail(String email) {
        List<CustomSchedule> tasks = customScheduleRepository.findByEmail(email);
        customScheduleRepository.deleteAll(tasks);
    }

}
