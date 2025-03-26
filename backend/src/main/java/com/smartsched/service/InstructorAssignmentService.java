package com.smartsched.service;

import com.smartsched.model.InstructorAssignment;
import com.smartsched.repository.InstructorAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;

@Service
public class InstructorAssignmentService {

    @Autowired
    private InstructorAssignmentRepository repository;

    public List<InstructorAssignment> getAllInstructors() {
        return repository.findAll();
    }

    public Optional<InstructorAssignment> getInstructorByEmail(String email) {
        return repository.findByEmail(email);
    }

    public InstructorAssignment saveInstructor(InstructorAssignment instructor) {
        // Set default empty collections if null
        if (instructor.getModules() == null) {
            instructor.setModules(new ArrayList<>());
        }
        if (instructor.getClasses() == null) {
            instructor.setClasses(new HashMap<>());
        }
        return repository.save(instructor);
    }

    public InstructorAssignment assignModule(String email, String module) {
        Optional<InstructorAssignment> instructorOpt = repository.findByEmail(email);
        if (instructorOpt.isPresent()) {
            InstructorAssignment instructor = instructorOpt.get();
            if (!instructor.getModules().contains(module)) {
                instructor.getModules().add(module);
                return repository.save(instructor);
            }
            return instructor; // Already exists
        }
        return null; // Instructor not found
    }

    public InstructorAssignment assignClass(String email, String module, String className) {
        Optional<InstructorAssignment> instructorOpt = repository.findByEmail(email);
        if (instructorOpt.isPresent()) {
            InstructorAssignment instructor = instructorOpt.get();
            instructor.getClasses().put(module, className);
            return repository.save(instructor);
        }
        return null; // Instructor not found
    }

    public boolean deleteModuleAndClass(String email, String module) {
        Optional<InstructorAssignment> instructorOpt = repository.findByEmail(email);
        if (instructorOpt.isPresent()) {
            InstructorAssignment instructor = instructorOpt.get();
            instructor.getModules().remove(module);
            instructor.getClasses().remove(module);
            repository.save(instructor);
            return true;
        }
        return false;
    }
}