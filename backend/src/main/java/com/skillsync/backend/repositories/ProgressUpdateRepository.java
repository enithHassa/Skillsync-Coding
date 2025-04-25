package com.skillsync.backend.repositories;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillsync.backend.models.ProgressUpdate;

import java.util.List;

public interface ProgressUpdateRepository extends MongoRepository<ProgressUpdate, String> {
    List<ProgressUpdate> findByUserId(String userId);
}

