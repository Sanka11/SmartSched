package com.smartsched.controller;

import com.smartsched.model.InstructorAssignment;
import com.smartsched.service.InstructorAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/instructors")
@CrossOrigin(origins = "*")
public class InstructorAssignmentController {

    @Autowired
    private InstructorAssignmentService service;

    @GetMapping
    public List<InstructorAssignment> getAllInstructors() {
        return service.getAllInstructors();
    }

    @GetMapping("/{email}")
    public Optional<InstructorAssignment> getInstructorByEmail(@PathVariable String email) {
        return service.getInstructorByEmail(email);
    }

    @PostMapping
    public InstructorAssignment createInstructor(@RequestBody InstructorAssignment instructor) {
        return service.saveInstructor(instructor);
    }

    @PutMapping("/{email}/assignModule/{module}")
    public InstructorAssignment assignModule(@PathVariable String email, @PathVariable String module) {
        return service.assignModule(email, module);
    }

    @PutMapping("/{email}/assignClass/{module}/{className}")
    public InstructorAssignment assignClass(@PathVariable String email, @PathVariable String module, @PathVariable String className) {
        return service.assignClass(email, module, className);
    }

    // Delete module and its associated class from instructor
    @DeleteMapping("/{email}/deleteModule/{module}")
    public String deleteModule(@PathVariable String email, @PathVariable String module) {
        boolean isDeleted = service.deleteModuleAndClass(email, module);
        if (isDeleted) {
            return "Module " + module + " and its associated class removed from instructor " + email;
        } else {
            return "Failed to remove module " + module + " and its associated class from instructor " + email;
        }
    }
}
