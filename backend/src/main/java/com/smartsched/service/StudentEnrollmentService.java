package com.smartsched.service;

import com.smartsched.model.StudentEnrollment;
import com.smartsched.repository.StudentEnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class StudentEnrollmentService {

    private final StudentEnrollmentRepository repository;

    @Autowired
    public StudentEnrollmentService(StudentEnrollmentRepository repository) {
        this.repository = repository;
    }

    // Create a new enrollment
    public StudentEnrollment createEnrollment(StudentEnrollment enrollment) {
        return repository.save(enrollment);
    }

    // Get all enrollments
    public List<StudentEnrollment> getAllEnrollments() {
        return repository.findAll();
    }

    // Get enrollment by ID
    public StudentEnrollment getEnrollmentById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));
    }

    // Update an enrollment
    public StudentEnrollment updateEnrollment(String id, StudentEnrollment enrollment) {
        StudentEnrollment existingEnrollment = getEnrollmentById(id);
        
        // Update fields
        existingEnrollment.setFirstName(enrollment.getFirstName());
        existingEnrollment.setLastName(enrollment.getLastName());
        existingEnrollment.setEmail(enrollment.getEmail());
        existingEnrollment.setCourses(enrollment.getCourses());
        existingEnrollment.setCourseModules(enrollment.getCourseModules());
        existingEnrollment.setCourseClasses(enrollment.getCourseClasses());
        
        return repository.save(existingEnrollment);
    }

    // Delete an enrollment
    public void deleteEnrollment(String id) {
        repository.deleteById(id);
    }

    // Add a course to enrollment
    public StudentEnrollment addCourse(String id, String courseName) {
        StudentEnrollment enrollment = getEnrollmentById(id);
        
        if (!enrollment.getCourses().contains(courseName)) {
            enrollment.getCourses().add(courseName);
            enrollment.getCourseModules().put(courseName, List.of());
            enrollment.getCourseClasses().put(courseName, null);
        }
        
        return repository.save(enrollment);
    }

    // Remove a course from enrollment
    public StudentEnrollment removeCourse(String id, String courseName) {
        StudentEnrollment enrollment = getEnrollmentById(id);
        
        enrollment.getCourses().remove(courseName);
        enrollment.getCourseModules().remove(courseName);
        enrollment.getCourseClasses().remove(courseName);
        
        return repository.save(enrollment);
    }

    // Add a module to a course
    public StudentEnrollment addModule(String id, String courseName, String moduleName) {
        StudentEnrollment enrollment = getEnrollmentById(id);
        
        if (enrollment.getCourseModules().containsKey(courseName)) {
            List<String> modules = enrollment.getCourseModules().get(courseName);
            if (!modules.contains(moduleName)) {
                modules.add(moduleName);
                enrollment.getCourseModules().put(courseName, modules);
            }
        }
        
        return repository.save(enrollment);
    }

    // Remove a module from a course
    public StudentEnrollment removeModule(String id, String courseName, String moduleName) {
        StudentEnrollment enrollment = getEnrollmentById(id);
        
        if (enrollment.getCourseModules().containsKey(courseName)) {
            List<String> modules = enrollment.getCourseModules().get(courseName);
            modules.remove(moduleName);
            enrollment.getCourseModules().put(courseName, modules);
        }
        
        return repository.save(enrollment);
    }

    // Assign/Update class for a course
    public StudentEnrollment assignClass(String id, String courseName, String className) {
        StudentEnrollment enrollment = getEnrollmentById(id);
        
        if (enrollment.getCourseClasses().containsKey(courseName)) {
            enrollment.getCourseClasses().put(courseName, className);
        }
        
        return repository.save(enrollment);
    }

    // Search students by name
    public List<StudentEnrollment> searchByName(String name) {
        return repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }
}