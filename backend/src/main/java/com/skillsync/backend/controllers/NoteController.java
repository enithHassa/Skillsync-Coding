package com.skillsync.backend.controllers;

import com.skillsync.backend.models.Note;
import com.skillsync.backend.services.NoteService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:5173")
public class NoteController {
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<Note> getNotes(@RequestHeader("X-User-Id") String userId) {
        return noteService.getNotesByUser(userId);
    }

    @PostMapping
    public Note createNote(@RequestHeader("X-User-Id") String userId, @RequestBody Note note) {
        return noteService.createNote(userId, note.getContent());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable String id, @RequestHeader("X-User-Id") String userId, @RequestBody Note note) {
        return noteService.updateNote(id, userId, note.getContent())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable String id, @RequestHeader("X-User-Id") String userId) {
        boolean deleted = noteService.deleteNote(id, userId);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
} 