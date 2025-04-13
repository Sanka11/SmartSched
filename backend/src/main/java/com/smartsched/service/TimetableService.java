package com.smartsched.service;

import com.smartsched.model.GeneratedSchedule;
import com.smartsched.model.InstructorAssignment;
import com.smartsched.model.StudentEnrollment;
import com.smartsched.model.User;
import com.smartsched.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TimetableService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeneratedScheduleRepository scheduleRepository;

    @Autowired
    private StudentEnrollmentRepository studentEnrollmentRepository;

    @Autowired
    private InstructorAssignmentRepository instructorAssignmentRepository;

    public List<Map<String, Object>> getTimetableForUser(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String role = user.getRole();
        String email = user.getEmail();

        GeneratedSchedule latestSchedule = scheduleRepository.findTopByOrderByIdDesc();
        if (latestSchedule == null) {
            throw new RuntimeException("No schedule found");
        }

        List<Map<String, Object>> timetable = latestSchedule.getTimetable();

        if ("student".equalsIgnoreCase(role)) {
            StudentEnrollment student = studentEnrollmentRepository.findByEmail(email).orElse(null);
            if (student == null)
                return List.of();

            Set<String> classNames = new HashSet<>(student.getCourseClasses().values());

            return timetable.stream()
                    .filter(slot -> classNames.contains((String) slot.get("className")))
                    .collect(Collectors.toList());

        } else if ("instructor".equalsIgnoreCase(role) || "lecturer".equalsIgnoreCase(role)) {
            InstructorAssignment instructor = instructorAssignmentRepository.findByEmail(email).orElse(null);
            if (instructor == null)
                return List.of();

            Set<String> moduleNames = new HashSet<>(instructor.getModules());

            return timetable.stream()
                    .filter(slot -> moduleNames.contains((String) slot.get("module")))
                    .collect(Collectors.toList());

        } else {
            throw new RuntimeException("Invalid user role");
        }
    }

}
