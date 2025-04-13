package com.skillsync.backend.repositories;

import com.skillsync.backend.models.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByUserId(String userId);
}
