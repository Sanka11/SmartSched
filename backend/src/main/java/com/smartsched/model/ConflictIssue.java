package com.smartsched.model;

public class ConflictIssue {
    private String userEmail;
    private String issue;

    public ConflictIssue(String userEmail, String issue) {
        this.userEmail = userEmail;
        this.issue = issue;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getIssue() {
        return issue;
    }
}
