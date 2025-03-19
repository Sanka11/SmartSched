package com.smartsched.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "student_enrollments")
public class StudentEnrollment {

    @Id
    private String id;

    private String firstName;
    private String lastName;
    private String email;
    private List<String> courses; // List of course names
    private Map<String, List<String>> courseModules; // Map of courseName -> List of module names
    private Map<String, String> courseClasses; // Map of courseName -> className

    // Constructors
    public StudentEnrollment() {
        this.courseModules = new HashMap<>();
        this.courseClasses = new HashMap<>();
    }

    public StudentEnrollment(String firstName, String lastName, String email) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getCourses() {
        return courses;
    }

    public void setCourses(List<String> courses) {
        this.courses = courses;
    }

    public Map<String, List<String>> getCourseModules() {
        return courseModules;
    }

    public void setCourseModules(Map<String, List<String>> courseModules) {
        this.courseModules = courseModules;
    }

    public Map<String, String> getCourseClasses() {
        return courseClasses;
    }

    public void setCourseClasses(Map<String, String> courseClasses) {
        this.courseClasses = courseClasses;
    }
}