package com.skillsync.backend.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "progress_updates")
public class ProgressUpdate {

    @Id
    private String id;

    private String title;
    private String description;
    private ProgressType type;
    private LocalDateTime progressDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String userId;  // Store user ID as reference

    // Getters and Setters
}

