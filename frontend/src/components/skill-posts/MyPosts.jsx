import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../main-main/Navbar';
import { Pencil, Trash2, MessageCircle, Heart, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Comments from '../interactivity/Comments';

export default function MyPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [visibleComments, setVisibleComments] = useState(new Set());
  const [commentCounts, setCommentCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(() => {
    try {
      const savedLikes = localStorage.getItem('postLikes');
      return savedLikes ? JSON.parse(savedLikes) : {};
    } catch (err) {
      console.error('Error loading likes from localStorage:', err);
      return {};
    }
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      console.log('User ID:', user.id);
      setCurrentUser(user);
      fetchUserPosts(user.id);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach(post => fetchCommentCount(post.id));
    }
  }, [posts]);

  const fetchCommentCount = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/post/${postId}`);
      const comments = response.data;
      const parentComments = comments.filter(comment => !comment.parentCommentId);
      
      setCommentCounts(prev => ({
        ...prev,
        [postId]: parentComments.length
      }));
    } catch (err) {
      console.error('Failed to fetch comments for post:', postId, err);
      setCommentCounts(prev => ({
        ...prev,
        [postId]: 0
      }));
    }
  };

  const fetchUserPosts = async (userId) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching posts for user ID:', userId);
      const response = await axios.get(`http://localhost:8080/api/posts/user/${userId}`);
      console.log('Posts response:', response.data);
      setPosts(response.data);
    } catch (err) {
      console.error('Error details:', err.response || err);
      setError('Failed to fetch posts: ' + (err.response?.data || err.message));
      toast.error('Failed to fetch posts: ' + (err.response?.data || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`);
      toast.success('Post deleted successfully!');
      fetchUserPosts(currentUser.id);
    } catch (err) {
      toast.error('Failed to delete post: ' + (err.response?.data || err.message));
    }
  };

  const handleEdit = (post) => {
    navigate('/posts', { state: { editingPost: post } });
  };

  const handleLike = (postId) => {
    setLikes(prevLikes => {
      const postLikes = prevLikes[postId] || { count: 0, users: [] };
      const userIndex = postLikes.users.indexOf(currentUser.id);
      
      if (userIndex === -1) {
        return {
          ...prevLikes,
          [postId]: {
            count: postLikes.count + 1,
            users: [...postLikes.users, currentUser.id]
          }
        };
      } else {
        const updatedUsers = [...postLikes.users];
        updatedUsers.splice(userIndex, 1);
        return {
          ...prevLikes,
          [postId]: {
            count: postLikes.count - 1,
            users: updatedUsers
          }
        };
      }
    });
  };

  const toggleComments = async (postId) => {
    setVisibleComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const isPostLikedByUser = (postId) => {
    try {
      return likes[postId]?.users.includes(currentUser?.id);
    } catch (err) {
      console.error('Error checking like status:', err);
      return false;
    }
  };

  const getLikeCount = (postId) => {
    try {
      return likes[postId]?.count || 0;
    } catch (err) {
      console.error('Error getting like count:', err);
      return 0;
    }
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/posts')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Posts
          </button>
          <h2 className="text-2xl font-bold text-center flex-grow mr-8">My Posts</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading your posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => fetchUserPosts(currentUser.id)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">You haven't created any posts yet.</p>
            <button
              onClick={() => navigate('/posts')}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">
                    Posted on {new Date(post.createdAt).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-800 mb-3">{post.description}</p>

                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className="mb-3">
                    {post.isVideo ? (
                      <div className="relative w-full">
                        <video
                          key={`video-${post.id}`}
                          className="w-full h-96 object-contain rounded-lg shadow-md bg-black"
                          controls
                          preload="metadata"
                          playsInline
                          controlsList="nodownload"
                        >
                          <source 
                            src={`http://localhost:8080${post.mediaUrls[0]}`} 
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : post.mediaUrls.length === 1 ? (
                      <img
                        src={`http://localhost:8080${post.mediaUrls[0]}`}
                        alt="Post media"
                        className="w-full h-96 object-cover rounded-lg shadow-md cursor-pointer"
                        onClick={() => setExpandedImage(`http://localhost:8080${post.mediaUrls[0]}`)}
                      />
                    ) : (
                      <div className={`grid grid-cols-${post.mediaUrls.length} gap-2`}>
                        {post.mediaUrls.map((url, index) => (
                          <img
                            key={index}
                            src={`http://localhost:8080${url}`}
                            alt={`Post media ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg shadow-md cursor-pointer"
                            onClick={() => setExpandedImage(`http://localhost:8080${url}`)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-2">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 ${
                        isPostLikedByUser(post.id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={isPostLikedByUser(post.id) ? 'currentColor' : 'none'}
                      />
                      <span>{getLikeCount(post.id)}</span>
                    </button>
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1 text-gray-500 hover:text-green-600"
                    >
                      <MessageCircle size={18} />
                      <span>{commentCounts[post.id] || 0}</span>
                    </button>
                  </div>
                </div>

                {visibleComments.has(post.id) && (
                  <div className="mt-4 border-t pt-4">
                    <Comments
                      postId={post.id}
                      currentUserId={currentUser.id}
                      postOwnerId={post.userId}
                      onCommentAdded={() => {}}
                      onCommentDeleted={() => {}}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
            <img
              src={expandedImage}
              alt="Expanded view"
              className="max-h-[90vh] w-auto mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
} 