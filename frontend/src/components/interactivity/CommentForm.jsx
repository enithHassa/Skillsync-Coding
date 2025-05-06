// src/components/interactivity/CommentForm.jsx
import { useState } from 'react';
import { commentService } from '../../services/commentService';

const CommentForm = ({ postId, userId, parentCommentId = null, onCommentAdded, placeholder = "Add a comment...", isReply = false }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const newComment = {
        content: content.trim(),
        postId,
        userId,
        parentCommentId
      };
      
      const addedComment = await commentService.addComment(newComment);
      onCommentAdded(addedComment);
      setContent('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex ${isReply ? 'mt-2 ml-6' : 'mt-4'}`}>
      <div className="flex-grow">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
      >
        {isSubmitting ? 'Posting...' : isReply ? 'Reply' : 'Post'}
      </button>
    </form>
  );
};

export default CommentForm;