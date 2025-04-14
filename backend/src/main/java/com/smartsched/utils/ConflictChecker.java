package com.smartsched.utils;

import com.smartsched.model.ConflictIssue;
import com.smartsched.model.GeneratedSchedule;

import java.util.*;

public class ConflictChecker {

    public static List<ConflictIssue> detectConflicts(List<GeneratedSchedule> schedules) {
        List<ConflictIssue> issues = new ArrayList<>();

        for (GeneratedSchedule schedule : schedules) {
            Set<String> timeSlots = new HashSet<>();

            for (Map<String, Object> session : schedule.getTimetable()) {
                String slotKey = session.get("day") + "-" + session.get("startTime") + "-" + session.get("endTime");
                if (!timeSlots.add(slotKey)) {
                    issues.add(new ConflictIssue(schedule.getUserEmail(), "Duplicate session at " + slotKey));
                }

                if (!session.containsKey("moduleName")) {
                    issues.add(new ConflictIssue(schedule.getUserEmail(), "Missing moduleName in session"));
                }
            }
        }

        return issues;
    }
}
