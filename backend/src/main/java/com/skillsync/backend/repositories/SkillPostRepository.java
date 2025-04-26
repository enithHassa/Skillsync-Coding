package com.skillsync.backend.repositories;

import com.skillsync.backend.models.SkillPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SkillPostRepository extends MongoRepository<SkillPost, String> {
    List<SkillPost> findByUserId(String userId);
}