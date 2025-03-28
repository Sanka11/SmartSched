package com.smartsched.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "allclassassignment")
public class AllClassAssignment {
    
    @Id
    private String id;

    // Course Details
    private String courseId;
    private String courseName;

    // Group Details
    private String groupId;
    private String groupName;

    // Module Details
    private String moduleId;
    private String moduleName;

    // Instructor Details
    private String instructorId;
    private String instructorName;

    // Class Details
    private String location;
    private String date;
    private String starttime;
    private String endtime;


    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    
    public String getGroupId() { return groupId; }
    public void setGroupId(String groupId) { this.groupId = groupId; }

    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }

    public String getModuleId() { return moduleId; }
    public void setModuleId(String moduleId) { this.moduleId = moduleId; }

    public String getModuleName() { return moduleName; }
    public void setModuleName(String moduleName) { this.moduleName = moduleName; }

    public String getInstructorId() { return instructorId; }
    public void setInstructorId(String instructorId) { this.instructorId = instructorId; }

    public String getInstructorName() { return instructorName; }
    public void setInstructorName(String instructorName) { this.instructorName = instructorName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStartTime() { return starttime; }
    public void setStartTime(String starttime) { this.starttime = starttime; }

    public String getEndTime() { return endtime; }
    public void setEndTime(String endtime) { this.endtime = endtime; }
    
}

