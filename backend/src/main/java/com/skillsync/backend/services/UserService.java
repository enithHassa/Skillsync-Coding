package com.skillsync.backend.services;

import com.skillsync.backend.models.User;
import com.skillsync.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User createUser(User user) {
        // Simple validation
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        return userRepository.save(user);
    }

    public User updateUser(String id, User userDetails) {
        User user = getUserById(id); // This will throw if user doesn't exist
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setAge(userDetails.getAge());
        user.setAddress(userDetails.getAddress());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setEmail(userDetails.getEmail());
        user.setPassword(userDetails.getPassword());
        
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public void followUser(String userId, String targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new RuntimeException("You cannot follow yourself.");
        }
        User user = getUserById(userId);
        User targetUser = getUserById(targetUserId);
        if (!user.getFollowing().contains(targetUserId)) {
            user.getFollowing().add(targetUserId);
        }
        if (!targetUser.getFollowers().contains(userId)) {
            targetUser.getFollowers().add(userId);
        }
        userRepository.save(user);
        userRepository.save(targetUser);
    }

    public void unfollowUser(String userId, String targetUserId) {
        User user = getUserById(userId);
        User targetUser = getUserById(targetUserId);
        user.getFollowing().remove(targetUserId);
        targetUser.getFollowers().remove(userId);
        userRepository.save(user);
        userRepository.save(targetUser);
    }

    public List<User> searchUsers(String query) {
        String q = query.trim().toLowerCase();
        return userRepository.findAll().stream()
            .filter(u ->
                u.getFirstName().toLowerCase().contains(q) ||
                u.getLastName().toLowerCase().contains(q) ||
                (u.getFirstName() + " " + u.getLastName()).toLowerCase().contains(q)
            )
            .toList();
    }
}