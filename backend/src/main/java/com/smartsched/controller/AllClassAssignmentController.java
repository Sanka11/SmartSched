package com.smartsched.controller;

import com.smartsched.model.AllClassAssignment;
import com.smartsched.service.AllClassAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Allow frontend access
@RequestMapping("/api/allClassAssignments")
public class AllClassAssignmentController {

    @Autowired
    private AllClassAssignmentService allClassAssignmentService;

    // Save a new class assignment
    @PostMapping
    public AllClassAssignment saveClassAssignment(@RequestBody AllClassAssignment classAssignment) {
        return allClassAssignmentService.saveClassAssignment(classAssignment);
    }

    // Get all class assignments
    @GetMapping
    public List<AllClassAssignment> getAllClassAssignments() {
        return allClassAssignmentService.getAllClassAssignments();
    }

    // Get a class assignment by ID
    @GetMapping("/{id}")
    public AllClassAssignment getClassAssignmentById(@PathVariable String id) {
        return allClassAssignmentService.getClassAssignmentById(id);
    }

    // Update a class assignment
   
    @PutMapping("/{id}")
    public AllClassAssignment updateClassAssignment(@PathVariable String id, @RequestBody AllClassAssignment classAssignment) {
        return allClassAssignmentService.updateClassAssignment(id, classAssignment);
    }

    // Delete a class assignment by ID
    @DeleteMapping("/{id}")
    public void deleteClassAssignment(@PathVariable String id) {
        allClassAssignmentService.deleteClassAssignment(id);
    }
}