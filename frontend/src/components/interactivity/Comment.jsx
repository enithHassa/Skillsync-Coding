// src/components/interactivity/Comments.jsx
import { useState, useEffect } from 'react';
import { commentService } from '../../services/commentService';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Comments = ({ postId, currentUserId, postOwnerId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await commentService.getPostComments(postId);
      setComments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load comments. Please try again later.');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleReplyAdded = () => {
    // Optionally refresh all comments if needed
    // fetchComments();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
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
          <div>
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