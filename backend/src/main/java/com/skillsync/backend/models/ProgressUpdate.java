package com.skillsync.backend.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "progress_updates")
public class ProgressUpdate {

    @Id
    private String id;

    private String title;
    private String description;
    private ProgressType type;

    private LocalDateTime progressDate;      // When progress was made (from form)
    private LocalDate completedDate;     // NEW - when user finished the task
    private String link;                     // NEW - optional course/article/project link

    private LocalDateTime createdAt;         // Set in controller or Mongo event
    private LocalDateTime updatedAt;         // Set in controller or Mongo event

    private String userId;                   // To associate with a specific user
}

