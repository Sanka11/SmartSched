package com.smartsched.controller;

import com.smartsched.dto.BulkScheduleRequest;
import com.smartsched.model.ConflictIssue;
import com.smartsched.service.SuperadminScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedule")
public class SuperadminScheduleController {

    private final SuperadminScheduleService scheduleService;

    public SuperadminScheduleController(SuperadminScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping("/generate/bulk")
    public ResponseEntity<?> generateBulk(@RequestBody BulkScheduleRequest request) {
        Map<String, Object> result = scheduleService.generateBulkSchedules(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/conflicts")
    public ResponseEntity<?> checkConflicts(@RequestBody BulkScheduleRequest request) {
        List<ConflictIssue> conflicts = scheduleService.checkConflicts(request);
        return ResponseEntity.ok(Map.of("conflicts", conflicts));
    }
}
