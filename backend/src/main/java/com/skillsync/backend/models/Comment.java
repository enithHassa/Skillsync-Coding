package com.skillsync.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    
    private String content;
    private String postId;         // Reference to the post this comment belongs to
    private String userId;         // User who wrote the comment
    private String userDisplayName; // Display name of the user
    private String userProfileImage; // Profile image URL of the user
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // For nested replies
    private String parentCommentId; // Null for top-level comments, populated for replies
    private List<String> replies = new ArrayList<>(); // List of comment IDs that are replies to this comment
    
    // Constructor for creating a new comment
    public Comment(String content, String postId, String userId, String parentCommentId) {
        this.content = content;
        this.postId = postId;
        this.userId = userId;
        this.parentCommentId = parentCommentId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}