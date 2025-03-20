package com.smartsched.controller;

import com.smartsched.model.StudentEnrollment;
import com.smartsched.service.StudentEnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/student-enrollments")
public class StudentEnrollmentController {

    private final StudentEnrollmentService studentEnrollmentService;

    @Autowired
    public StudentEnrollmentController(StudentEnrollmentService studentEnrollmentService) {
        this.studentEnrollmentService = studentEnrollmentService;
    }

    // Create a new student enrollment
    @PostMapping
    public ResponseEntity<StudentEnrollment> createEnrollment(@RequestBody StudentEnrollment enrollment) {
        StudentEnrollment createdEnrollment = studentEnrollmentService.createEnrollment(enrollment);
        return ResponseEntity.ok(createdEnrollment);
    }

    // Get all student enrollments
    @GetMapping
    public ResponseEntity<List<StudentEnrollment>> getAllEnrollments() {
        List<StudentEnrollment> enrollments = studentEnrollmentService.getAllEnrollments();
        return ResponseEntity.ok(enrollments);
    }

    // Get a specific student enrollment by ID
    @GetMapping("/{id}")
    public ResponseEntity<StudentEnrollment> getEnrollmentById(@PathVariable String id) {
        StudentEnrollment enrollment = studentEnrollmentService.getEnrollmentById(id);
        return ResponseEntity.ok(enrollment);
    }

    // Update a student enrollment
    @PutMapping("/{id}")
    public ResponseEntity<StudentEnrollment> updateEnrollment(
            @PathVariable String id, 
            @RequestBody StudentEnrollment enrollment) {
        StudentEnrollment updatedEnrollment = studentEnrollmentService.updateEnrollment(id, enrollment);
        return ResponseEntity.ok(updatedEnrollment);
    }

    // Delete a student enrollment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable String id) {
        studentEnrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }

    // Add a course to a student's enrollment
    @PostMapping("/{id}/courses")
    public ResponseEntity<StudentEnrollment> addCourse(
            @PathVariable String id,
            @RequestParam String courseName) {
        StudentEnrollment updatedEnrollment = studentEnrollmentService.addCourse(id, courseName);
        return ResponseEntity.ok(updatedEnrollment);
    }

    // Remove a course from a student's enrollment
    @DeleteMapping("/{id}/courses/{courseName}")
    public ResponseEntity<StudentEnrollment> removeCourse(
            @PathVariable String id,
            @PathVariable String courseName) {
        StudentEnrollment updatedEnrollment = studentEnrollmentService.removeCourse(id, courseName);
        return ResponseEntity.ok(updatedEnrollment);
    }

    // Add a module to a specific course
    @PostMapping("/{id}/courses/{courseName}/modules")
    public ResponseEntity<StudentEnrollment> addModule(
            @PathVariable String id,
            @PathVariable String courseName,
            @RequestParam String moduleName) {
        StudentEnrollment updatedEnrollment = studentEnrollmentService.addModule(id, courseName, moduleName);
        return ResponseEntity.ok(updatedEnrollment);
    }

    // Remove a module from a specific course
    @DeleteMapping("/{id}/courses/{courseName}/modules/{moduleName}")
    public ResponseEntity<StudentEnrollment> removeModule(
            @PathVariable String id,
            @PathVariable String courseName,
            @PathVariable String moduleName) {
        StudentEnrollment updatedEnrollment = studentEnrollmentService.removeModule(id, courseName, moduleName);
        return ResponseEntity.ok(updatedEnrollment);
    }

    // Assign/Update class for a specific course
    @PutMapping("/{id}/courses/{courseName}/class")
    public ResponseEntity<StudentEnrollment> assignClass(
            @PathVariable String id,
            @PathVariable String courseName,
            @RequestParam String className) {
        StudentEnrollment updatedEnrollment = studentEnrollmentService.assignClass(id, courseName, className);
        return ResponseEntity.ok(updatedEnrollment);
    }

    // Search students by name
    @GetMapping("/search")
    public ResponseEntity<List<StudentEnrollment>> searchStudents(
            @RequestParam String name) {
        List<StudentEnrollment> results = studentEnrollmentService.searchByName(name);
        return ResponseEntity.ok(results);
    }
}