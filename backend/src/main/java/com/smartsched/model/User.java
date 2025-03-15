package com.smartsched.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users") // Maps this class to the "users" collection in MongoDB
public class User {

    @Id
    private String id; // MongoDB auto-generates an ID for each document
    private String fullName; // Updated from 'name' to 'fullName'
    private String email;
    private String password; // Added password field
    private String contact; // Added contact field

    // Constructors
    public User() {
    }

    public User(String fullName, String email, String password, String contact) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.contact = contact;
    }

    // Getters & Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }
}