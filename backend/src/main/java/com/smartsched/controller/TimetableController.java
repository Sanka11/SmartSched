package com.smartsched.controller;

import com.smartsched.service.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = "*")
public class TimetableController {

    @Autowired
    private TimetableService timetableService;

    @GetMapping("/{userId}")
    public List<Map<String, Object>> getUserTimetable(@PathVariable String userId) {
        return timetableService.getTimetableForUser(userId);
    }

    @GetMapping("/student/{email}")
public Map<String, Object> getStudentTimetable(@PathVariable String email) {
    return timetableService.getStudentScheduleWithMetadata(email);
}


}
