package com.smartsched.dto;

import java.util.List;

public class BulkScheduleRequest {
    private List<String> emails;
    private String role;

    public List<String> getEmails() {
        return emails;
    }

    public void setEmails(List<String> emails) {
        this.emails = emails;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
