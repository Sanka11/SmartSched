package com.smartsched.controller;

import com.smartsched.service.ai.AISchedulingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scheduler")
@CrossOrigin(origins = "*") // ✅ Allows access from frontend
public class AISchedulingController {

    @Autowired
    private AISchedulingService aiSchedulingService;

    // ✅ Accepts query parameters from frontend
    @GetMapping("/generate")
    @ResponseBody
    public String generateSchedule(
            @RequestParam("email") String email,
            @RequestParam("role") String role) {

        return aiSchedulingService.generateSchedule(email, role);
    }
}
