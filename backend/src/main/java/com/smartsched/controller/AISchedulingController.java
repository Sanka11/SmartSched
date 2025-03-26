package com.smartsched.controller;

import com.smartsched.service.ai.AISchedulingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scheduler")
public class AISchedulingController {

    @Autowired
    private AISchedulingService aiSchedulingService;

    @GetMapping("/generate")
    @ResponseBody // Ensure JSON is returned properly
    public String generateSchedule() {
        return aiSchedulingService.generateSchedule();
    }
}
