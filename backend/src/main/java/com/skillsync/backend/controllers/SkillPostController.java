package com.skillsync.backend.controllers;

import com.skillsync.backend.models.SkillPost;
import com.skillsync.backend.repositories.SkillPostRepository;
import com.skillsync.backend.models.User;
import com.skillsync.backend.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class SkillPostController {

    private static final Logger logger = LoggerFactory.getLogger(SkillPostController.class);

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
        @RequestParam(value = "media", required = false) MultipartFile[] mediaFiles,
        @RequestParam(value = "isVideo", required = false, defaultValue = "false") boolean isVideo
    ) {
        try {
            // Validate userId
            User user = userService.getUserById(userId);
            if (user == null) {
                logger.warn("Invalid userId: {}", userId);
                return ResponseEntity.badRequest().body("Invalid user ID");
            }

            // Check authentication
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || !auth.getName().equals(userId)) {
                logger.warn("Unauthorized post creation attempt by user: {}", auth != null ? auth.getName() : "anonymous");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: You can only create posts for yourself");
            }

            if (mediaFiles != null && mediaFiles.length > 3 && !isVideo) {
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
            post.setVideo(isVideo);

            postRepository.save(post);
            return ResponseEntity.ok(post);

        } catch (Exception e) {
            logger.error("Error saving post for userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error saving post: " + e.getMessage());
        }
    }

    // ✅ Get all posts
    @GetMapping
    public List<Map<String, Object>> getAllPosts() {
        List<SkillPost> posts = postRepository.findAll();
        // TODO: Consider using a DTO (SkillPostResponse) for better maintainability
        return posts.stream().map(post -> {
            Map<String, Object> postWithUser = new HashMap<>();
            postWithUser.put("id", post.getId());
            postWithUser.put("description", post.getDescription());
            postWithUser.put("userId", post.getUserId());
            postWithUser.put("mediaUrls", post.getMediaUrls());
            postWithUser.put("createdAt", post.getCreatedAt());
            postWithUser.put("isVideo", post.isVideo());
            
            try {
                User user = userService.getUserById(post.getUserId());
                postWithUser.put("userName", user.getFirstName() + " " + user.getLastName());
            } catch (Exception e) {
                logger.warn("Failed to fetch user for postId: {}", post.getId(), e);
                postWithUser.put("userName", "Unknown User");
            }
            
            return postWithUser;
        }).collect(Collectors.toList());
    }

    // ✅ Get posts by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getPostsByUserId(@PathVariable String userId) {
        try {
            // Validate userId
            User user = userService.getUserById(userId);
            if (user == null) {
                logger.warn("Invalid userId for fetching posts: {}", userId);
                return ResponseEntity.badRequest().body(Collections.singletonList(
                    Collections.singletonMap("error", "Invalid user ID")));
            }

            List<SkillPost> userPosts = postRepository.findByUserId(userId);
            // TODO: Consider using a DTO (SkillPostResponse) for better maintainability
            List<Map<String, Object>> postsWithUserInfo = userPosts.stream().map(post -> {
                Map<String, Object> postWithUser = new HashMap<>();
                postWithUser.put("id", post.getId());
                postWithUser.put("description", post.getDescription());
                postWithUser.put("userId", post.getUserId());
                postWithUser.put("mediaUrls", post.getMediaUrls());
                postWithUser.put("createdAt", post.getCreatedAt());
                postWithUser.put("isVideo", post.isVideo());
                
                try {
                    postWithUser.put("userName", user.getFirstName() + " " + user.getLastName());
                } catch (Exception e) {
                    logger.warn("Failed to fetch user for postId: {}", post.getId(), e);
                    postWithUser.put("userName", "Unknown User");
                }
                
                return postWithUser;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(postsWithUserInfo);
        } catch (Exception e) {
            logger.error("Error fetching posts for userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonList(
                    Collections.singletonMap("error", "Error fetching posts: " + e.getMessage())));
        }
    }

    // 🛠️ Update a post
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePost(
        @PathVariable("id") String id,
        @RequestParam("userId") String userId,
        @RequestParam("description") String description,
        @RequestParam(value = "media", required = false) MultipartFile[] mediaFiles,
        @RequestParam(value = "isVideo", required = false, defaultValue = "false") boolean isVideo
    ) {
        try {
            // Validate userId
            User user = userService.getUserById(userId);
            if (user == null) {
                logger.warn("Invalid userId for updating post: {}", userId);
                return ResponseEntity.badRequest().body("Invalid user ID");
            }

            // Check authentication
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || !auth.getName().equals(userId)) {
                logger.warn("Unauthorized post update attempt by user: {}", auth != null ? auth.getName() : "anonymous");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: You can only update your own posts");
            }

            if (mediaFiles != null && mediaFiles.length > 3 && !isVideo) {
                return ResponseEntity.badRequest().body("Maximum 3 images allowed per post");
            }

            Optional<SkillPost> optionalPost = postRepository.findById(id);
            if (optionalPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
            }

            SkillPost post = optionalPost.get();
            if (!post.getUserId().equals(userId)) {
                logger.warn("User {} attempted to update post {} owned by {}", userId, id, post.getUserId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own posts");
            }

            post.setUserId(userId);
            post.setDescription(description);
            post.setVideo(isVideo);

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

                post.setMediaUrls(mediaPaths);
            }

            postRepository.save(post);
            return ResponseEntity.ok(post);

        } catch (Exception e) {
            logger.error("Error updating postId: {}", id, e);
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

            // Check authentication
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || !auth.getName().equals(post.getUserId())) {
                logger.warn("Unauthorized post deletion attempt by user: {}", auth != null ? auth.getName() : "anonymous");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: You can only delete your own posts");
            }

            if (post.getMediaUrls() != null) {
                for (String url : post.getMediaUrls()) {
                    // Convert URL to absolute file path
                    String filePath = Paths.get("").toAbsolutePath().toString() + url;
                    File file = new File(filePath);
                    if (file.exists()) {
                        if (!file.delete()) {
                            logger.warn("Failed to delete file: {}", filePath);
                        }
                    }
                }
            }

            postRepository.delete(post);
            return ResponseEntity.ok("Post deleted successfully");

        } catch (Exception e) {
            logger.error("Error deleting postId: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting post: " + e.getMessage());
        }
    }
}