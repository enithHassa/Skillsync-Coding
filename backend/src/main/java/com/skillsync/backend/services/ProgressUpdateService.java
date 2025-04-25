package com.skillsync.backend.services;

import org.springframework.stereotype.Service;

import com.skillsync.backend.models.ProgressUpdate;
import com.skillsync.backend.repositories.ProgressUpdateRepository;

import java.time.LocalDateTime;
//import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressUpdateService {

    private final ProgressUpdateRepository repository;

    public ProgressUpdateService(ProgressUpdateRepository repository) {
        this.repository = repository;
    }

    public List<ProgressUpdate> getUserUpdates(String userId) {
        return repository.findByUserId(userId);
    }

    public ProgressUpdate create(ProgressUpdate update, String userId) {
        update.setUserId(userId);
        update.setCreatedAt(LocalDateTime.now());
        update.setUpdatedAt(LocalDateTime.now());

        // Normalize completedDate to LocalDate (strip time if accidentally included)
        if (update.getCompletedDate() != null) {
            update.setCompletedDate(update.getCompletedDate());
        }

        return repository.save(update);
    }

    public Optional<ProgressUpdate> update(String id, ProgressUpdate data, String userId) {
        return repository.findById(id).map(existing -> {
            if (!existing.getUserId().equals(userId)) return null;

            existing.setTitle(data.getTitle());
            existing.setDescription(data.getDescription());
            existing.setType(data.getType());
            existing.setProgressDate(data.getProgressDate());

            // Normalize completedDate to LocalDate
            if (data.getCompletedDate() != null) {
                existing.setCompletedDate(data.getCompletedDate());
            }

            existing.setLink(data.getLink());
            existing.setUpdatedAt(LocalDateTime.now());

            return repository.save(existing);
        });
    }

    public boolean delete(String id, String userId) {
        return repository.findById(id).map(update -> {
            if (!update.getUserId().equals(userId)) return false;
            repository.delete(update);
            return true;
        }).orElse(false);
    }
}
