package com.smartsched.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Document(collection = "generated_schedules")
public class GeneratedSchedule {

    @Id
    private String id;

    private String generatedBy;
    private int fitnessScore;
    private List<Map<String, Object>> timetable; // Dynamic session structure

    // Getters and Setters
    public String getId() {
        return id;
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

    public List<Map<String, Object>> getTimetable() {
        return timetable;
    }

    public void setTimetable(List<Map<String, Object>> timetable) {
        this.timetable = timetable;
    }
}
