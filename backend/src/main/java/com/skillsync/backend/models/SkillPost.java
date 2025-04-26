package com.skillsync.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "posts")
public class SkillPost {

    @Id
    private String id;

    private String description;
    private String userId;
    private List<String> mediaUrls;
    private LocalDateTime createdAt;
    private boolean isVideo;

    public SkillPost() {}

    public SkillPost(String description, String userId, List<String> mediaUrls) {
        this.description = description;
        this.userId = userId;
        this.mediaUrls = mediaUrls;
        this.createdAt = LocalDateTime.now();
        this.isVideo = false;
    }

    // 🔄 Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isVideo() {
        return isVideo;
    }

    public void setVideo(boolean video) {
        isVideo = video;
    }
}
