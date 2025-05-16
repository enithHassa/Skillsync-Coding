package com.skillsync.backend.services;

import com.skillsync.backend.models.Note;
import com.skillsync.backend.repositories.NoteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NoteService {
    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> getNotesByUser(String userId) {
        return noteRepository.findByUserId(userId);
    }

    public Note createNote(String userId, String content) {
        Note note = new Note(userId, content);
        return noteRepository.save(note);
    }

    public Optional<Note> updateNote(String noteId, String userId, String content) {
        return noteRepository.findById(noteId).map(note -> {
            if (!note.getUserId().equals(userId)) return null;
            note.setContent(content);
            note.setUpdatedAt(LocalDateTime.now());
            return noteRepository.save(note);
        });
    }

    public boolean deleteNote(String noteId, String userId) {
        return noteRepository.findById(noteId).map(note -> {
            if (!note.getUserId().equals(userId)) return false;
            noteRepository.delete(note);
            return true;
        }).orElse(false);
    }
} 