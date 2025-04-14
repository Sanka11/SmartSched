package com.smartsched.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "custom_schedule")
public class CustomSchedule {

    @Id
    private String id;
    private String email;
    private String day;
    private String time;
    private String title;
    private String description;
    private String icon;
    private String color;

    public void setId(String id) {
        this.id = id;
    }

    public CustomSchedule() {
    }

    public CustomSchedule(String email, String day, String time, String title, String description, String icon,
            String color) {
        this.email = email;
        this.day = day;
        this.time = time;
        this.title = title;
        this.description = description;
        this.icon = icon;
        this.color = color;
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
