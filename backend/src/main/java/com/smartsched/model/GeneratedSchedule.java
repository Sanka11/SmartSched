package com.smartsched.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "generated_schedules")
public class GeneratedSchedule {

    @Id
    private String id;

    private String userEmail; // 🔥 ADD THIS FIELD

    private String generatedBy;
    private int fitnessScore;

    @Field(name = "generatedAt")
    private LocalDateTime generatedAt;

    private List<Map<String, Object>> timetable;

    public GeneratedSchedule() {
    }

    public GeneratedSchedule(String id, String userEmail, String generatedBy, int fitnessScore,
            LocalDateTime generatedAt,
            List<Map<String, Object>> timetable) {
        this.id = id;
        this.userEmail = userEmail;
        this.generatedBy = generatedBy;
        this.fitnessScore = fitnessScore;
        this.generatedAt = generatedAt;
        this.timetable = timetable;
    }

    public String getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getGeneratedBy() {
        return generatedBy;
    }

    public void setGeneratedBy(String generatedBy) {
        this.generatedBy = generatedBy;
    }

    public int getFitnessScore() {
        return fitnessScore;
    }

    public void setFitnessScore(int fitnessScore) {
        this.fitnessScore = fitnessScore;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public List<Map<String, Object>> getTimetable() {
        return timetable;
    }

    public void setTimetable(List<Map<String, Object>> timetable) {
        this.timetable = timetable;
    }
}
