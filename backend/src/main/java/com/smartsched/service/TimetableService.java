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

    @Autowired
private StudentEnrollmentRepository studentRepo;

@Autowired
private GeneratedScheduleRepository scheduleRepo;


    // ✅ Existing method (by MongoDB _id)
    public List<Map<String, Object>> getTimetableForUser(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String role = user.getRole();
        String email = user.getEmail();

        return getTimetableByEmailAndRole(email, role);
    }

    // ✅ New method (email + role)
    public List<Map<String, Object>> getTimetableByEmailAndRole(String email, String role) {
    GeneratedSchedule latestSchedule = scheduleRepository
    .findTopByUserEmailAndTimetableNotNullOrderByGeneratedAtDesc(email);


    if (latestSchedule == null || latestSchedule.getTimetable() == null) {
        System.out.println("⚠️ No schedule found for user: " + email);
        return List.of();
    }

    List<Map<String, Object>> timetable = latestSchedule.getTimetable();

    if ("student".equalsIgnoreCase(role)) {
        StudentEnrollment student = studentEnrollmentRepository.findByEmail(email).orElse(null);
        if (student == null) {
            System.out.println("⚠️ No student enrollment found for: " + email);
            return List.of();
        }

        Set<String> classNames = new HashSet<>(student.getCourseClasses().values());
        System.out.println("✅ Class names from enrollment: " + classNames);

        return timetable.stream()
                .filter(slot -> {
                    Object className = slot.get("className");
                    if (className == null) return false;
                    boolean match = classNames.contains(className.toString());
                    if (!match) {
                        System.out.println("⛔ Mismatch: " + className + " not in " + classNames);
                    }
                    return match;
                })
                .collect(Collectors.toList());

    } else if ("instructor".equalsIgnoreCase(role) || "lecturer".equalsIgnoreCase(role)) {
        InstructorAssignment instructor = instructorAssignmentRepository.findByEmail(email).orElse(null);
        if (instructor == null) {
            System.out.println("⚠️ No instructor assignment found for: " + email);
            return List.of();
        }

        Set<String> moduleNames = new HashSet<>(instructor.getModules());

        return timetable.stream()
                .filter(slot -> {
                    Object module = slot.get("module");
                    return module != null && moduleNames.contains(module.toString());
                })
                .collect(Collectors.toList());
    }

    return List.of();
}

public Map<String, Object> getStudentScheduleWithMetadata(String email) {
    StudentEnrollment student = studentRepo.findAll().stream()
            .filter(s -> email.equalsIgnoreCase(s.getEmail()))
            .findFirst()
            .orElse(null);

    if (student == null || student.getCourseClasses() == null) {
        return Map.of("timetable", new ArrayList<>(), "generatedAt", null);
    }

    Set<String> groupIds = new HashSet<>(student.getCourseClasses().values());

    GeneratedSchedule latestSchedule = scheduleRepo
            .findTopByUserEmailAndTimetableNotNullOrderByGeneratedAtDesc(email);

    if (latestSchedule == null || latestSchedule.getTimetable() == null) {
        return Map.of("timetable", new ArrayList<>(), "generatedAt", null);
    }

    Set<String> seen = new HashSet<>();
    List<Map<String, Object>> filtered = latestSchedule.getTimetable().stream()
            .filter(entry -> groupIds.contains(String.valueOf(entry.get("group_id"))))
            .filter(entry -> {
                String key = entry.get("module_name") + "|" + entry.get("group_name") + "|" +
                        entry.get("day") + "|" + entry.get("start_time") + "|" + entry.get("end_time") + "|" +
                        entry.get("location");
                return seen.add(key);
            })
            .collect(Collectors.toList());

    return Map.of(
        "timetable", filtered,
        "generatedAt", latestSchedule.getGeneratedAt().toString()
    );
}


}


