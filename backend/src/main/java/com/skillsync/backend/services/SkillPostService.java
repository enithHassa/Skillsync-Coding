package com.skillsync.backend.services;

import com.skillsync.backend.models.SkillPost;
import com.skillsync.backend.repositories.SkillPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class SkillPostService {

    @Autowired
    private SkillPostRepository skillPostRepository;

    @Autowired
    private CommentService commentService;

    // Delete a post and all its associated comments
    @Transactional
    public void deletePost(String postId, String userId) {
        Optional<SkillPost> post = skillPostRepository.findById(postId);
        
        if (post.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }

        // Check if user is the post owner
        if (!post.get().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                "You can only delete your own posts");
        }

        // First delete all comments associated with this post
        commentService.deleteAllCommentsForPost(postId);

        // Then delete the post itself
        skillPostRepository.deleteById(postId);
    }

    // ... rest of your existing methods ...
}
