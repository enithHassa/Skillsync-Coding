// src/components/interactivity/CommentItem.jsx
import { useState } from 'react';
import { commentService } from '../../services/commentService';
import CommentForm from './CommentForm';
import { formatDistanceToNow } from 'date-fns';

const CommentItem = ({ comment, currentUserId, postOwnerId, onCommentDeleted, onReplyAdded }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isCommentOwner = currentUserId === comment.userId;
  const isPostOwner = currentUserId === postOwnerId;
  const canEdit = isCommentOwner;
  const canDelete = isCommentOwner || isPostOwner;

  const handleEdit = async () => {
    try {
      await commentService.updateComment(
        comment.id,
        editContent,
        currentUserId
      );
      comment.content = editContent;
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentService.deleteComment(comment.id, currentUserId);
        onCommentDeleted(comment.id);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const loadReplies = async () => {
    if (!showReplies) {
      setIsLoading(true);
      try {
        const fetchedReplies = await commentService.getCommentReplies(comment.id);
        setReplies(fetchedReplies);
        comment.replies = fetchedReplies.map(reply => reply.id);
      } catch (error) {
        console.error('Failed to load replies:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setShowReplies(!showReplies);
  };

  const handleReplyAdded = (newReply) => {
    setReplies([...replies, newReply]);
    comment.replies = [...(comment.replies || []), newReply.id];
    setShowReplies(true);
    setShowReplyForm(false);
    onReplyAdded();
  };

  const handleReplyDeleted = (replyId) => {
    setReplies(replies.filter(reply => reply.id !== replyId));
    comment.replies = comment.replies.filter(id => id !== replyId);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <div className="border-b border-gray-200 py-4 comment-item">
      <div className="flex items-start">
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-700 font-medium">
            {comment.userDisplayName ? comment.userDisplayName.charAt(0).toUpperCase() : comment.userId.slice(0, 1).toUpperCase()}
          </span>
        </div>
        <div className="ml-3 flex-grow">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              {comment.userDisplayName || `User ${comment.userId.slice(0, 5)}`}
            </span>
            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
          </div>
          
          {isEditing ? (
            <div className="mt-1">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
          )}
          
          <div className="mt-2 flex space-x-4 text-xs">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-500 hover:text-blue-500"
            >
              Reply
            </button>
            
            {comment.replies && comment.replies.length > 0 && (
              <button 
                onClick={loadReplies} 
                className="text-gray-500 hover:text-blue-500 flex items-center"
              >
                {isLoading ? 'Loading...' : `${showReplies ? 'Hide' : 'Show'} replies (${comment.replies.length})`}
              </button>
            )}
            
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-blue-500"
              >
                Edit
              </button>
            )}
            
            {canDelete && (
              <button
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-500"
              >
                Delete
              </button>
            )}
          </div>
          
          {showReplyForm && (
            <CommentForm
              postId={comment.postId}
              userId={currentUserId}
              parentCommentId={comment.id}
              onCommentAdded={handleReplyAdded}
              placeholder="Write a reply..."
              isReply={true}
            />
          )}
          
          {showReplies && replies.length > 0 && (
            <div className="mt-3 pl-6 border-l-2 border-gray-200">
              {replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  postOwnerId={postOwnerId}
                  onCommentDeleted={handleReplyDeleted}
                  onReplyAdded={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;