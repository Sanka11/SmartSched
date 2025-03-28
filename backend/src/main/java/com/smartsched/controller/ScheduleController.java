package com.smartsched.controller;

import com.smartsched.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = "*") // Optional: update for your frontend URL
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
}
