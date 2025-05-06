package com.skillsync.backend.controllers;

import com.skillsync.backend.models.Course;
import com.skillsync.backend.repositories.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skillsync/courses")
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:3000") // Frontend access
@CrossOrigin(origins = "http://localhost:5173") // Frontend access
public class CourseController {

    private final CourseRepository courseRepository;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }
    // // Get all courses by user ID
    // @GetMapping
    // public ResponseEntity<List<Course>> getCoursesByUser(@RequestParam String userId) {
    //     return ResponseEntity.ok(courseRepository.findByUserId(userId));
    // }

    // // Get course by ID
    // @GetMapping("/{id}")
    // public ResponseEntity<Course> getCourseById(@PathVariable String id) {
    //     return ResponseEntity.ok(courseRepository.findById(id).orElseThrow());
    // }

    // Create new course
    @PostMapping
    public ResponseEntity<String> createCourse(@RequestBody Course course) {
        courseRepository.save(course);
        return ResponseEntity.ok("Course added successfully");
    }

    // Update course
    @PutMapping("/update/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @RequestBody Course updatedCourse) {
        Course course = courseRepository.findById(id).orElseThrow();
        course.setTitle(updatedCourse.getTitle());
        course.setPlatform(updatedCourse.getPlatform());
        course.setShortDescription(updatedCourse.getShortDescription());
        course.setUrl(updatedCourse.getUrl());
        course.setCategory(updatedCourse.getCategory());
        course.setCompleted(updatedCourse.isCompleted());
        courseRepository.save(course);
        return ResponseEntity.ok(course);
    }

    // Delete course
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable String id) {
        courseRepository.deleteById(id);
        return ResponseEntity.ok("Course deleted successfully");
    }
}

