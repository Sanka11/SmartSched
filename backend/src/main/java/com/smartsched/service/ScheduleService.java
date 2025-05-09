package com.smartsched.service;

import com.smartsched.model.GeneratedSchedule;
import com.smartsched.model.InstructorAssignment;
import com.smartsched.model.StudentEnrollment;
import com.smartsched.repository.GeneratedScheduleRepository;
import com.smartsched.repository.InstructorAssignmentRepository;
import com.smartsched.repository.StudentEnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    @Autowired
    private GeneratedScheduleRepository scheduleRepo;

    @Autowired
    private StudentEnrollmentRepository studentRepo;

    @Autowired
    private InstructorAssignmentRepository instructorRepo;

    // ✅ Get Student Timetable (Filtered by groupId)
    public Map<String, List<Map<String, Object>>> getScheduleForStudent(String email) {
        StudentEnrollment student = studentRepo.findAll().stream()
                .filter(s -> email.equalsIgnoreCase(s.getEmail()))
                .findFirst()
                .orElse(null);

        if (student == null || student.getCourseClasses() == null) {
            return Collections.singletonMap("timetable", new ArrayList<>());
        }

        Set<String> groupIds = new HashSet<>(student.getCourseClasses().values());

        GeneratedSchedule latestSchedule = scheduleRepo
    .findTopByUserEmailAndTimetableNotNullOrderByGeneratedAtDesc(email);


        if (latestSchedule == null || latestSchedule.getTimetable() == null) {
            return Collections.singletonMap("timetable", new ArrayList<>());
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

        return Collections.singletonMap("timetable", filtered);
    }

    // ✅ Get Instructor Timetable (Filtered by instructorId)
    public Map<String, List<Map<String, Object>>> getScheduleForInstructor(String email) {
        InstructorAssignment instructor = instructorRepo.findAll().stream()
                .filter(i -> email.equalsIgnoreCase(i.getEmail()))
                .findFirst()
                .orElse(null);

        if (instructor == null) {
            return Collections.singletonMap("timetable", new ArrayList<>());
        }

        String instructorId = String.valueOf(instructor.getId());

        GeneratedSchedule latestSchedule = scheduleRepo
    .findTopByUserEmailAndTimetableNotNullOrderByGeneratedAtDesc(email);

        if (latestSchedule == null || latestSchedule.getTimetable() == null) {
            return Collections.singletonMap("timetable", new ArrayList<>());
        }

        Set<String> seen = new HashSet<>();
        List<Map<String, Object>> filtered = latestSchedule.getTimetable().stream()
                .filter(entry -> instructorId.equals(String.valueOf(entry.get("instructor_id"))))
                .filter(entry -> {
                    // Use a more strict key to eliminate duplicates
                    String key = entry.get("module_name") + "|" + entry.get("group_name") + "|" +
                            entry.get("day") + "|" + entry.get("start_time") + "|" + entry.get("end_time") + "|" +
                            entry.get("location");
                    return seen.add(key);
                })
                .collect(Collectors.toList());

        return Collections.singletonMap("timetable", filtered);
    }

    public List<GeneratedSchedule> getAllSchedules() {
        return scheduleRepo.findAll();
    }

    public List<Map<String, Object>> getScheduleConflicts() {
        List<GeneratedSchedule> allSchedules = scheduleRepo.findAll();
    
        Map<String, List<Map<String, Object>>> groupedByTimeSlot = new HashMap<>();
        for (GeneratedSchedule schedule : allSchedules) {
            for (Map<String, Object> session : schedule.getTimetable()) {
                String key = session.get("day") + "-" + session.get("start_time") + "-" + session.get("end_time") + "-" + session.get("location");
                groupedByTimeSlot.computeIfAbsent(key, k -> new ArrayList<>()).add(session);
            }
        }
    
        List<Map<String, Object>> conflicts = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : groupedByTimeSlot.entrySet()) {
            if (entry.getValue().size() > 1) {
                Map<String, Object> conflict = new HashMap<>();
                conflict.put("timeSlot", entry.getKey());
                conflict.put("sessions", entry.getValue());
                conflicts.add(conflict);
            }
        }
    
        return conflicts;
    }
    
    
}
