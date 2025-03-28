package com.skillsync.backend.controllers;

import com.skillsync.backend.models.User;
import com.skillsync.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User user) {
        userService.createUser(user);
        return ResponseEntity.ok("User added successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        userService.updateUser(id, userDetails);
        return ResponseEntity.ok("Details updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Profile deleted");
    }
}