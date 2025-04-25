// src/components/interactivity/Comments.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { commentService } from '../../services/commentService';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { toast } from 'react-toastify';

const Comments = ({ postId, currentUserId, postOwnerId, onCommentAdded, onCommentDeleted }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    if (!postId) return;
    
    setLoading(true);
    try {
      const data = await commentService.getPostComments(postId);
      setComments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load comments. Please try again later.');
      console.error('Error fetching comments:', err);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentAdded = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
    toast.success('Comment added successfully!');
    if (onCommentAdded) onCommentAdded();
  };

  const handleCommentDeleted = (commentId) => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    toast.success('Comment deleted successfully!');
    if (onCommentDeleted) onCommentDeleted();
  };

  const handleReplyAdded = () => {
    // Refresh comments to get the updated reply structure
    fetchComments();
    toast.success('Reply added successfully!');
  };

  // Don't show comments section if no authenticated user
  if (!currentUserId) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Please log in to view and post comments.</p>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      
      <CommentForm
        postId={postId}
        userId={currentUserId}
        onCommentAdded={handleCommentAdded}
      />
      
      <div className="mt-6">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading comments...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchComments}
              className="mt-2 text-blue-500 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                postOwnerId={postOwnerId}
                onCommentDeleted={handleCommentDeleted}
                onReplyAdded={handleReplyAdded}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;