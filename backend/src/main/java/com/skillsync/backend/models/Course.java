package com.skillsync.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "courses")
public class Course {
    @Id
    private String id;

    private String title;
    private String platform;
    private String shortDescription;
    private String url;
    private String category;
    private boolean completed;
    private String userId;

    // Default constructor
    public Course() {}

    // Constructor with all fields
    public Course(String title, String platform, String shortDescription, String url, String category, boolean completed, String userId) {
        this.title = title;
        this.platform = platform;
        this.shortDescription = shortDescription;
        this.url = url;
        this.category = category;
        this.completed = completed;
        this.userId = userId;
    }

    // 🔁 Generate Getters & Setters (in IDE or manually)
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getPlatform() {
        return platform;
    }
    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getShortDescription() {
        return shortDescription;
    }
    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }

    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isCompleted() {
        return completed;
    }
    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
}

