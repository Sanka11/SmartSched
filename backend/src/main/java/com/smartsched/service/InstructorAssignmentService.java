package com.smartsched.service;

import com.smartsched.model.InstructorAssignment;
import com.smartsched.repository.InstructorAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

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
        return repository.save(instructor);
    }

    public InstructorAssignment assignModule(String email, String module) {
        Optional<InstructorAssignment> instructor = repository.findByEmail(email);
        if (instructor.isPresent()) {
            instructor.get().getModules().add(module); // Assuming modules is a list
            return repository.save(instructor.get());
        }
        return null;
    }

    public InstructorAssignment assignClass(String email, String module, String className) {
        Optional<InstructorAssignment> instructor = repository.findByEmail(email);
        if (instructor.isPresent()) {
            instructor.get().getClasses().put(module, className); // Assuming classes is a map with module as key
            return repository.save(instructor.get());
        }
        return null;
    }

    // Delete module and its associated class from the instructor
    public boolean deleteModuleAndClass(String email, String module) {
        Optional<InstructorAssignment> instructor = repository.findByEmail(email);
        if (instructor.isPresent()) {
            InstructorAssignment instructorAssignment = instructor.get();
            // Remove the module
            instructorAssignment.getModules().remove(module);
            // Remove the associated class
            instructorAssignment.getClasses().remove(module);

            repository.save(instructorAssignment);
            return true; // Successfully deleted
        }
        return false; // Instructor not found or module not present
    }
}
