package com.skillsync.backend.controllers;
import org.springframework.web.bind.annotation.*;

import com.skillsync.backend.models.ProgressUpdate;
import com.skillsync.backend.services.ProgressUpdateService;

import java.security.Principal;
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
    public List<ProgressUpdate> getAll(Principal principal) {
        String userId = getUserId(principal);
        return service.getUserUpdates(userId);
    }

  
    @PostMapping
    public ProgressUpdate create(@RequestBody ProgressUpdate update, Principal principal) {
        return service.create(update, getUserId(principal));
    }

    @PutMapping("/{id}")
    public ProgressUpdate update(@PathVariable String id, @RequestBody ProgressUpdate update, Principal principal) {
        return service.update(id, update, getUserId(principal)).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id, Principal principal) {
        if (!service.delete(id, getUserId(principal))) throw new RuntimeException("Not allowed");
    }

    // 🔐 Stub — replace this logic with actual authentication
    // private String getUserId(Principal principal) {
    //     return principal.getName(); // assume principal.getName() returns the user ID
    // }

    private String getUserId(Principal principal) {
        return principal != null ? principal.getName() : "demoUser"; // fallback or throw
    }
    
}
