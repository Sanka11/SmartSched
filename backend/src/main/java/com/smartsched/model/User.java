package com.smartsched.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    @JsonProperty("_id") // 👈 This ensures JSON field becomes "_id"
    private String id;

    private String fullName;
    private String email;
    private String password;
    private String contact;
    private String role;
    private List<String> permissions;

    @Field("groupName") // optional, helpful for MongoDB mapping
private String groupName;


    public User() {
    }

    public User(String fullName, String email, String password, String contact, String role, List<String> permissions) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.contact = contact;
        this.role = role;
        this.permissions = permissions;
    }

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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }

    public String getGroupName() {
    return groupName;
}

public void setGroupName(String groupName) {
    this.groupName = groupName;
}

}
