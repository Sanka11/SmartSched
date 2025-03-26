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

    public Map<String, List<Map<String, Object>>> getScheduleForStudent(String email) {
        Optional<StudentEnrollment> optionalStudent = studentRepo.findByEmail(email);
        if (optionalStudent.isEmpty())
            return null;
        StudentEnrollment student = optionalStudent.get();

        Set<String> groupIds = new HashSet<>(student.getCourseClasses().values());

        GeneratedSchedule latestSchedule = scheduleRepo.findTopByOrderByIdDesc();
        if (latestSchedule == null)
            return null;

        return latestSchedule.getTimetable().stream()
                .filter(entry -> groupIds.contains((String) entry.get("group_id")))
                .collect(Collectors.groupingBy(e -> (String) e.get("day")));
    }

    public Map<String, List<Map<String, Object>>> getScheduleForInstructor(String email) {
        Optional<InstructorAssignment> optionalInstructor = instructorRepo.findByEmail(email);
        if (optionalInstructor.isEmpty())
            return null;
        InstructorAssignment instructor = optionalInstructor.get();

        GeneratedSchedule latestSchedule = scheduleRepo.findTopByOrderByIdDesc();
        if (latestSchedule == null)
            return null;

        return latestSchedule.getTimetable().stream()
                .filter(entry -> instructor.getId().equals(entry.get("instructor_id")))
                .collect(Collectors.groupingBy(e -> (String) e.get("day")));
    }
}
