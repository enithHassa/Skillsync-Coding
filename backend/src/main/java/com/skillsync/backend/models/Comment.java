package com.skillsync.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    private String postId;          // ID of the SkillPost
    private String userId;          // ID of the User who commented
    private String content;
    private String parentCommentId; // null if it's a top-level comment

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
