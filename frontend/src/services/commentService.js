// src/services/commentService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const commentService = {
  // Get all comments for a post
  getPostComments: async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Get replies for a comment
  getCommentReplies: async (commentId) => {
    try {
      const response = await axios.get(`${API_URL}/comments/${commentId}/replies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  },

  // Add a new comment
  addComment: async (comment) => {
    try {
      const response = await axios.post(`${API_URL}/comments`, comment);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Update a comment
  updateComment: async (commentId, content, userId) => {
    try {
      const response = await axios.put(`${API_URL}/comments/${commentId}`, {
        content,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId, userId) => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}?userId=${userId}`);
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};