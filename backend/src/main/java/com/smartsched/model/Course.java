package com.smartsched.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



@Document(collection = "courses")
public class Course {
    @Id
    private String courseId;
    
    private String courseName;
    private String courseDuration;
    private int courseFee;
    private String lectures;
    private String contactMail;
    private String description;

    // Constructors
    public Course() {
    }

    public Course(String courseId, String courseName, String courseDuration, int courseFee, String lectures, String contactMail, String description) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseDuration = courseDuration;
        this.courseFee = courseFee;
        this.lectures = lectures;
        this.contactMail = contactMail;
        this.description = description;
    }

    // Getters and Setters
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getCourseDuration() { return courseDuration; }
    public void setCourseDuration(String courseDuration) { this.courseDuration = courseDuration; }

    public int getCourseFee() { return courseFee; }
    public void setCourseFee(int courseFee) { this.courseFee = courseFee; }

    public String getLectures() { return lectures; }
    public void setLectures(String lectures) { this.lectures = lectures; }

    public String getContactMail() { return contactMail; }
    public void setContactMail(String contactMail) { this.contactMail = contactMail; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
