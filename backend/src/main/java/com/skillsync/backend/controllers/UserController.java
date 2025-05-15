package com.skillsync.backend.controllers;

import com.skillsync.backend.models.User;
import com.skillsync.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/skillsync/users")
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

    @PutMapping("update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    }


    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Profile deleted");
    }

    @PostMapping("/{userId}/follow/{targetUserId}")
    public ResponseEntity<String> followUser(@PathVariable String userId, @PathVariable String targetUserId) {
        userService.followUser(userId, targetUserId);
        return ResponseEntity.ok("Followed user successfully");
    }

    @PostMapping("/{userId}/unfollow/{targetUserId}")
    public ResponseEntity<String> unfollowUser(@PathVariable String userId, @PathVariable String targetUserId) {
        userService.unfollowUser(userId, targetUserId);
        return ResponseEntity.ok("Unfollowed user successfully");
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<String>> getFollowers(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user.getFollowers());
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<String>> getFollowing(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user.getFollowing());
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }

}