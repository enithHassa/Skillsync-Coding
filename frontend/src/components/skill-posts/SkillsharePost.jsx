import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../main-main/Navbar';
import { PlusCircle, Pencil, Trash2, MessageCircle, Heart, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Comments from '../interactivity/Comments';
import { followUser, unfollowUser, getFollowing } from '../../services/userService';

export default function SkillsharePost() {
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [description, setDescription] = useState('');
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
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
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('postLikes', JSON.stringify(likes));
    } catch (err) {
      console.error('Error saving likes to localStorage:', err);
    }
  }, [likes]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
      fetchPosts();
      // Fetch following list for current user
      getFollowing(user.id).then(res => setFollowing(res.data)).catch(() => setFollowing([]));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const userId = currentUser?.id;

  // Reset comment counts when component mounts or posts change
  useEffect(() => {
    if (posts.length > 0) {
      // Clear existing counts first
      setCommentCounts({});
      // Fetch fresh counts for all posts
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
      // Set count to 0 on error to avoid stale data
      setCommentCounts(prev => ({
        ...prev,
        [postId]: 0
      }));
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/posts');
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts: ' + (err.response?.data || err.message));
      toast.error('Failed to fetch posts: ' + (err.response?.data || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      toast.error('You can only upload up to 3 images');
      return;
    }
    
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setIsVideo(true);
        const preview = URL.createObjectURL(file);
        setVideoPreview(preview);
        setImagePreviews([preview]);
      } else {
        setIsVideo(false);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
        setVideoPreview(null);
      }
    } else {
      setImagePreviews(editingPost?.mediaUrls?.map(url => `http://localhost:8080${url}`) || []);
      setIsVideo(editingPost?.isVideo || false);
      setVideoPreview(editingPost?.isVideo ? `http://localhost:8080${editingPost.mediaUrls[0]}` : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please log in to create a post');
      navigate('/');
      return;
    }

    const formData = new FormData();
    formData.append('userId', currentUser.id);
    formData.append('description', description);
    formData.append('isVideo', isVideo);

    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (file.type.startsWith('video/')) {
        if (file.size > 30 * 1024 * 1024) { // 30MB limit
          toast.error('Video file size should be less than 30MB');
          return;
        }
        formData.append('media', file);
      } else {
        Array.from(fileInput.files).forEach(file => {
          formData.append('media', file);
        });
      }
    }

    try {
      if (editingPost) {
        await axios.put(`http://localhost:8080/api/posts/${editingPost.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Post updated successfully!');
      } else {
        await axios.post('http://localhost:8080/api/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Post created successfully!');
      }

      setDescription('');
      setImagePreviews([]);
      setIsVideo(false);
      fileInput.value = '';
      setEditingPost(null);
      fetchPosts();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(
        `Failed to ${editingPost ? 'update' : 'create'} post: ` +
          (err.response?.data || err.message)
      );
    }
  };

  const handleEdit = (post) => {
    if (post.userId !== currentUser?.id) {
      toast.error('You can only edit your own posts');
      return;
    }
    setEditingPost(post);
    setDescription(post.description);
    setImagePreviews(post.mediaUrls?.map(url => `http://localhost:8080${url}`) || []);
    setIsVideo(post.isVideo);
    setIsModalOpen(true);
  };

  const handleDelete = async (postId, postUserId) => {
    if (postUserId !== currentUser?.id) {
      toast.error('You can only delete your own posts');
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`);
      toast.success('Post deleted successfully!');
      fetchPosts();
    } catch (err) {
      toast.error('Failed to delete post: ' + (err.response?.data || err.message));
    }
  };

  const handleLike = (postId) => {
    if (!currentUser) {
      toast.error('Please log in to like posts');
      navigate('/');
      return;
    }

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setDescription('');
    setImagePreviews([]);
    setIsVideo(false);
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
    // Always fetch fresh count when toggling
    await fetchCommentCount(postId);
  };

  // Helper to check if current user is following a given user
  const isFollowing = (targetUserId) => following.includes(targetUserId);

  // Handle follow/unfollow
  const handleFollow = async (targetUserId) => {
    try {
      if (isFollowing(targetUserId)) {
        await unfollowUser(currentUser.id, targetUserId);
        setFollowing(following.filter(id => id !== targetUserId));
        toast.success('Unfollowed user');
      } else {
        await followUser(currentUser.id, targetUserId);
        setFollowing([...following, targetUserId]);
        toast.success('Followed user');
      }
    } catch (err) {
      toast.error('Failed to update follow status');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Posts</h2>
          <button
            onClick={() => navigate('/my-posts')}
            className="p-2 text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2 rounded-lg hover:bg-green-50"
            title="My Posts"
          >
            <User size={24} />
            <span className="text-sm font-medium">My Posts</span>
          </button>
        </div>

        <div className="fixed right-6 bottom-6 z-50">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            <PlusCircle size={32} />
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingPost ? 'Edit Post' : 'Share a Skill Post'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-semibold">Upload Images (max 3) or Video (max 30MB)</label>
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/quicktime"
                    multiple={!isVideo}
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {imagePreviews.length > 0 && !isVideo && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                  {isVideo && videoPreview && (
                    <div className="mt-3">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-48 object-cover rounded-md"
                        preload="metadata"
                        playsInline
                        controlsList="nodownload"
                      >
                        <source src={videoPreview} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-semibold">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Write something about your skill..."
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {editingPost ? 'Update Post' : 'Share Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Posts</h2>
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={fetchPosts}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available.</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => {
                const isLiked = isPostLikedByUser(post.id);
                const isOwnPost = post.userId === currentUser.id;
                return (
                  <div
                    key={post.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow max-w-2xl mx-auto"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-500">
                        <span className="font-bold text-base text-gray-800">
                          {post.userName || (isOwnPost ? `${currentUser.firstName} ${currentUser.lastName}` : `User ${post.userId}`)}
                        </span>
                        {' '}posted on{' '}
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                      {/* Follow/Unfollow Button */}
                      {!isOwnPost && (
                        <button
                          onClick={() => handleFollow(post.userId)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ml-2 ${isFollowing(post.userId) ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200' : 'bg-green-500 text-white border-green-500 hover:bg-green-600'}`}
                        >
                          {isFollowing(post.userId) ? 'Following' : 'Follow'}
                        </button>
                      )}
                    </div>

                    <p className="text-gray-800 mb-3 text-sm">{post.description}</p>
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
                            className="w-full h-96 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setExpandedImage(`http://localhost:8080${post.mediaUrls[0]}`)}
                          />
                        ) : post.mediaUrls.length === 2 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {post.mediaUrls.map((url, index) => (
                              <img
                                key={index}
                                src={`http://localhost:8080${url}`}
                                alt={`Post media ${index + 1}`}
                                className="w-full h-96 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setExpandedImage(`http://localhost:8080${url}`)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {post.mediaUrls.map((url, index) => (
                              <div
                                key={index}
                                className={`${
                                  index === 0 && post.mediaUrls.length === 3
                                    ? 'row-span-2'
                                    : ''
                                }`}
                              >
                                <img
                                  src={`http://localhost:8080${url}`}
                                  alt={`Post media ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => setExpandedImage(`http://localhost:8080${url}`)}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-2">
                      <div className="flex items-center gap-2">
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
                          className={`flex items-center gap-1 ${
                            visibleComments.has(post.id) 
                              ? 'text-green-600' 
                              : 'text-gray-500 hover:text-green-600'
                          }`}
                        >
                          <MessageCircle size={18} />
                          <span>{commentCounts[post.id] || 0}</span>
                        </button>
                      </div>
                      {isOwnPost && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="text-gray-500 hover:text-blue-600"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id, post.userId)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>

                    {visibleComments.has(post.id) && (
                      <div className="mt-4 border-t pt-4">
                        <Comments
                          postId={post.id}
                          currentUserId={userId}
                          postOwnerId={post.userId}
                          onCommentAdded={async () => {
                            await fetchCommentCount(post.id);
                          }}
                          onCommentDeleted={async () => {
                            await fetchCommentCount(post.id);
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
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