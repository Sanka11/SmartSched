package com.smartsched.model;



import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "allcourses2")
public class AllCourse {
    @Id
    private String id;
    private String name;
    private double courseFee;
    private String courseDuration;
    private String contactEmail; 
    private String description;
    private List<AllModule> modules;
    private List<AllGroups> groups;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getCourseFee() { return courseFee; }
    public void setCourseFee(double courseFee) { this.courseFee = courseFee; }
    public String getCourseDuration() { return courseDuration; }
    public void setCourseDuration(String courseDuration) { this.courseDuration = courseDuration; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<AllModule> getModules() { return modules; }
    public void setModules(List<AllModule> modules) { this.modules = modules; }
    public List<AllGroups> getGroups() { return groups; }
    public void setGroups(List<AllGroups> groups) { this.groups = groups; }
}

