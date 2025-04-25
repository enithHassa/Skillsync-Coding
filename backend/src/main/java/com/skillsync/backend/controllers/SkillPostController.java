package com.skillsync.backend.controllers;

import com.skillsync.backend.models.SkillPost;
import com.skillsync.backend.repositories.SkillPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.skillsync.backend.controllers.UserController;
import com.skillsync.backend.services.UserService;
import com.skillsync.backend.models.User;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class SkillPostController {

    @Autowired
    private SkillPostRepository postRepository;

    @Autowired
    private UserService userService;

    private final String uploadDir = Paths.get("").toAbsolutePath().toString() + "/uploads/";

    // 🆕 Create a new post with media upload
    @PostMapping
    public ResponseEntity<?> createPost(
        @RequestParam("userId") String userId,
        @RequestParam("description") String description,
        @RequestParam(value = "media", required = false) MultipartFile[] mediaFiles
    ) {
        try {
            if (mediaFiles != null && mediaFiles.length > 3) {
                return ResponseEntity.badRequest().body("Maximum 3 images allowed per post");
            }

            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }

            List<String> mediaPaths = new ArrayList<>();
            if (mediaFiles != null) {
                for (MultipartFile file : mediaFiles) {
                    if (!file.isEmpty()) {
                        String fileName = System.currentTimeMillis() + "-" + file.getOriginalFilename();
                        Path destinationPath = Paths.get(uploadDir, fileName);
                        Files.write(destinationPath, file.getBytes());
                        mediaPaths.add("/uploads/" + fileName);
                    }
                }
            }

            SkillPost post = new SkillPost(description, userId, mediaPaths);
            post.setCreatedAt(LocalDateTime.now());

            postRepository.save(post);
            return ResponseEntity.ok(post);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error saving post: " + e.getMessage());
        }
    }

    // ✅ Get all posts
    @GetMapping
    public List<Map<String, Object>> getAllPosts() {
        List<SkillPost> posts = postRepository.findAll();
        return posts.stream().map(post -> {
            Map<String, Object> postWithUser = new HashMap<>();
            postWithUser.put("id", post.getId());
            postWithUser.put("description", post.getDescription());
            postWithUser.put("userId", post.getUserId());
            postWithUser.put("mediaUrls", post.getMediaUrls());
            postWithUser.put("createdAt", post.getCreatedAt());
            
            try {
                User user = userService.getUserById(post.getUserId());
                postWithUser.put("userName", user.getFirstName() + " " + user.getLastName());
            } catch (Exception e) {
                postWithUser.put("userName", "Unknown User");
            }
            
            return postWithUser;
        }).collect(Collectors.toList());
    }

    // 🛠️ Update a post
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePost(
        @PathVariable("id") String id,
        @RequestParam("userId") String userId,
        @RequestParam("description") String description,
        @RequestParam(value = "media", required = false) MultipartFile[] mediaFiles
    ) {
        try {
            if (mediaFiles != null && mediaFiles.length > 3) {
                return ResponseEntity.badRequest().body("Maximum 3 images allowed per post");
            }

            Optional<SkillPost> optionalPost = postRepository.findById(id);
            if (optionalPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
            }

            SkillPost post = optionalPost.get();
            post.setUserId(userId);
            post.setDescription(description);

            if (mediaFiles != null && mediaFiles.length > 0) {
                List<String> mediaPaths = new ArrayList<>();
                File uploadPath = new File(uploadDir);
                if (!uploadPath.exists()) {
                    uploadPath.mkdirs();
                }

                for (MultipartFile file : mediaFiles) {
                    if (!file.isEmpty()) {
                        String fileName = System.currentTimeMillis() + "-" + file.getOriginalFilename();
                        Path destinationPath = Paths.get(uploadDir, fileName);
                        Files.write(destinationPath, file.getBytes());
                        mediaPaths.add("/uploads/" + fileName);
                    }
                }

                post.setMediaUrls(mediaPaths); // Replace old media
            }

            postRepository.save(post);
            return ResponseEntity.ok(post);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating post: " + e.getMessage());
        }
    }

    // 🗑️ Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable("id") String id) {
        try {
            Optional<SkillPost> optionalPost = postRepository.findById(id);
            if (optionalPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
            }

            SkillPost post = optionalPost.get();

            if (post.getMediaUrls() != null) {
                for (String url : post.getMediaUrls()) {
                    String filePath = url.replace("/uploads/", "uploads/");
                    File file = new File(filePath);
                    if (file.exists()) {
                        file.delete();
                    }
                }
            }

            postRepository.delete(post);
            return ResponseEntity.ok("Post deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting post: " + e.getMessage());
        }
    }
}
