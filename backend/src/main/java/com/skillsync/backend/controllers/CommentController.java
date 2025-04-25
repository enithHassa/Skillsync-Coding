package com.skillsync.backend.controllers;

import com.skillsync.backend.dtos.CommentDTO;
import com.skillsync.backend.models.Comment;
import com.skillsync.backend.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    // Create a new comment
    @PostMapping
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO commentDTO) {
        Comment comment = commentService.createComment(
            commentDTO.getContent(),
            commentDTO.getPostId(),
            commentDTO.getUserId(),
            commentDTO.getParentCommentId()
        );
        return new ResponseEntity<>(convertToDTO(comment), HttpStatus.CREATED);
    }
    
    // Get all comments for a post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTO>> getPostComments(@PathVariable String postId) {
        List<Comment> comments = commentService.getPostComments(postId);
        List<CommentDTO> commentDTOs = comments.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(commentDTOs);
    }
    
    // Get replies for a comment
    @GetMapping("/{commentId}/replies")
    public ResponseEntity<List<CommentDTO>> getCommentReplies(@PathVariable String commentId) {
        List<Comment> replies = commentService.getCommentReplies(commentId);
        List<CommentDTO> replyDTOs = replies.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(replyDTOs);
    }
    
    // Update a comment
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable String commentId,
            @RequestBody CommentDTO commentDTO) {
        Comment updated = commentService.updateComment(
            commentId,
            commentDTO.getContent(),
            commentDTO.getUserId()
        );
        return ResponseEntity.ok(convertToDTO(updated));
    }
    
    // Delete a comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String commentId,
            @RequestParam String userId) {
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }
    
    // Helper method to convert Comment to CommentDTO
    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setPostId(comment.getPostId());
        dto.setUserId(comment.getUserId());
        dto.setUserDisplayName(comment.getUserDisplayName());
        dto.setUserProfileImage(comment.getUserProfileImage());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setParentCommentId(comment.getParentCommentId());
        dto.setReplies(comment.getReplies());
        return dto;
    }
}