package com.skillsync.backend.repositories;

import com.skillsync.backend.models.SkillPost;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SkillPostRepository extends MongoRepository<SkillPost, String> {
}