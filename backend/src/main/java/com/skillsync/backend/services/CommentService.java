package com.skillsync.backend.services;

import com.skillsync.backend.models.Comment;
import com.skillsync.backend.models.SkillPost;
import com.skillsync.backend.models.User;
import com.skillsync.backend.repositories.CommentRepository;
import com.skillsync.backend.repositories.SkillPostRepository;
import com.skillsync.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private SkillPostRepository skillPostRepository;

    @Autowired
    private UserRepository userRepository;
    
    // Delete all comments for a post
    @Transactional
    public void deleteAllCommentsForPost(String postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        for (Comment comment : comments) {
            // First delete all replies to this comment
            List<Comment> replies = commentRepository.findByParentCommentId(comment.getId());
            commentRepository.deleteAll(replies);
        }
        // Then delete all top-level comments
        commentRepository.deleteAll(comments);
    }
    
    // Create a new comment
    public Comment createComment(String content, String postId, String userId, String parentCommentId) {
        // Verify post exists
        Optional<SkillPost> post = skillPostRepository.findById(postId);
        if (post.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }

        // Get user information
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        
        Comment comment = new Comment(content, postId, userId, parentCommentId);
        comment.setUserDisplayName(user.get().getDisplayName());
        comment.setUserProfileImage(user.get().getProfileImage());
        
        // If this is a reply to another comment, update the parent
        if (parentCommentId != null) {
            Optional<Comment> parentComment = commentRepository.findById(parentCommentId);
            if (parentComment.isPresent()) {
                Comment parent = parentComment.get();
                parent.getReplies().add(comment.getId());
                commentRepository.save(parent);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent comment not found");
            }
        }
        
        return commentRepository.save(comment);
    }
    
    // Get all comments for a post (only top-level)
    public List<Comment> getPostComments(String postId) {
        return commentRepository.findByPostIdAndParentCommentId(postId, null);
    }
    
    // Get all replies for a comment
    public List<Comment> getCommentReplies(String commentId) {
        // First check if the comment exists
        Optional<Comment> comment = commentRepository.findById(commentId);
        if (comment.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }
        
        // Find all comments where parentCommentId equals the given commentId
        return commentRepository.findByParentCommentId(commentId);
    }
    
    // Update a comment
    public Comment updateComment(String commentId, String content, String userId) {
        Optional<Comment> existingComment = commentRepository.findById(commentId);
        
        if (existingComment.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }
        
        Comment comment = existingComment.get();
        
        // Check if user is author of the comment
        if (!comment.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own comments");
        }
        
        comment.setContent(content);
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }
    
    // Delete a comment
    public void deleteComment(String commentId, String userId) {
        Optional<Comment> existingComment = commentRepository.findById(commentId);
        
        if (existingComment.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }
        
        Comment comment = existingComment.get();
        
        // Check if user is comment author or post owner
        Optional<SkillPost> post = skillPostRepository.findById(comment.getPostId());
        
        if (!comment.getUserId().equals(userId) && 
            (post.isEmpty() || !post.get().getUserId().equals(userId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                "You can only delete your own comments or comments on your posts");
        }
        
        // If this is a parent comment with replies, we might want to handle those too
        // For simplicity, we'll just delete this comment
        
        // If this is a reply, remove it from parent's replies list
        if (comment.getParentCommentId() != null) {
            Optional<Comment> parentComment = commentRepository.findById(comment.getParentCommentId());
            if (parentComment.isPresent()) {
                Comment parent = parentComment.get();
                parent.getReplies().remove(commentId);
                commentRepository.save(parent);
            }
        }
        
        commentRepository.deleteById(commentId);
    }
}