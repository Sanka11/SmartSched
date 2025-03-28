package com.smartsched.service;

import com.smartsched.repository.AllClassAssignmentRepository;
import com.smartsched.model.AllClassAssignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AllClassAssignmentService {

    @Autowired
    private AllClassAssignmentRepository allClassAssignmentRepository;

    // Save a new class assignment
    public AllClassAssignment saveClassAssignment(AllClassAssignment classAssignment) {
        return allClassAssignmentRepository.save(classAssignment);
    }

    // Get all class assignments
    public List<AllClassAssignment> getAllClassAssignments() {
        return allClassAssignmentRepository.findAll();
    }

    public List<AllClassAssignment> getClassAssignmentsByCourseId(String courseId) {
        return allClassAssignmentRepository.findByCourseId(courseId);
    }

    // Get a class assignment by ID
    public AllClassAssignment getClassAssignmentById(String id) {
        return allClassAssignmentRepository.findById(id).orElse(null);
    }

    
    public AllClassAssignment updateClassAssignment(String id, AllClassAssignment classAssignment) {
        classAssignment.setId(id); // Ensure the ID is set
        return allClassAssignmentRepository.save(classAssignment);
    }

    // Delete a class assignment by ID
    public void deleteClassAssignment(String id) {
        allClassAssignmentRepository.deleteById(id);
    }
}