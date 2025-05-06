package com.skillsync.backend.controllers;

import com.skillsync.backend.models.ProgressUpdate;
import com.skillsync.backend.services.ProgressUpdateService;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:5173")
public class ProgressUpdateController {

    private final ProgressUpdateService service;

    public ProgressUpdateController(ProgressUpdateService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProgressUpdate> getAll(@RequestHeader("X-User-Id") String userId) {
        return service.getUserUpdates(userId);
    }

    @PostMapping
    public ProgressUpdate create(@RequestBody ProgressUpdate update, @RequestHeader("X-User-Id") String userId) {
        update.setUserId(userId);
        update.setCreatedAt(LocalDateTime.now());
        update.setUpdatedAt(LocalDateTime.now());
        return service.create(update, userId);
    }

    @PutMapping("/{id}")
    public ProgressUpdate update(@PathVariable String id, @RequestBody ProgressUpdate update, @RequestHeader("X-User-Id") String userId) {
        update.setUpdatedAt(LocalDateTime.now());
        return service.update(id, update, userId)
                .orElseThrow(() -> new RuntimeException("Update not found or not authorized"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id, @RequestHeader("X-User-Id") String userId) {
        if (!service.delete(id, userId)) {
            throw new RuntimeException("Not authorized to delete this update");
        }
    }
}
