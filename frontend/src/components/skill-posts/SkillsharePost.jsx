import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../main-main/Navbar';
import { PlusCircle, Pencil, Trash2, MessageCircle, Heart } from 'lucide-react';
import Comments from '../interactivity/Comments';

export default function SkillsharePost() {
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [visibleComments, setVisibleComments] = useState(new Set());
  const [commentCounts, setCommentCounts] = useState({});
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userId = currentUser?.id || '12345';

  const fetchCommentCount = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/post/${postId}`);
      const parentComments = response.data.filter(comment => !comment.parentCommentId);
      setCommentCounts(prev => ({
        ...prev,
        [postId]: parentComments.length
      }));
    } catch (err) {
      console.error('Failed to fetch comments for post:', postId, err);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/posts');
      setPosts(response.data);
      response.data.forEach(post => {
        fetchCommentCount(post.id);
      });
    } catch (err) {
      setError('Failed to fetch posts: ' + (err.response?.data || err.message));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(editingPost?.mediaUrls?.[0] ? `http://localhost:8080${editingPost.mediaUrls[0]}` : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('description', description);

    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput.files[0]) {
      formData.append('media', fileInput.files[0]);
    }

    try {
      if (editingPost) {
        await axios.put(`http://localhost:8080/api/posts/${editingPost.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccess('Post updated successfully!');
      } else {
        await axios.post('http://localhost:8080/api/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccess('Post created successfully!');
      }

      setDescription('');
      setImagePreview(null);
      fileInput.value = '';
      setEditingPost(null);
      fetchPosts();
      setIsModalOpen(false);
    } catch (err) {
      setError(
        `Failed to ${editingPost ? 'update' : 'create'} post: ` +
          (err.response?.data || err.message)
      );
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setDescription(post.description);
    setImagePreview(post.mediaUrls?.[0] ? `http://localhost:8080${post.mediaUrls[0]}` : null);
    setIsModalOpen(true);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`);
      fetchPosts();
    } catch (err) {
      setError('Failed to delete post: ' + (err.response?.data || err.message));
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      await axios.post(
        `http://localhost:8080/api/posts/${postId}/like`,
        { userId, action: isLiked ? 'unlike' : 'like' }
      );
      fetchPosts();
    } catch (err) {
      setError('Failed to update like: ' + (err.response?.data || err.message));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setDescription('');
    setImagePreview(null);
  };

  const handleImageError = (postId, url) => {
    console.error(`Failed to load image for post ${postId}: ${url}`);
  };

  const toggleComments = (postId) => {
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

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 px-4">
        {/* Plus Icon for New Post */}
        <div className="fixed right-6 bottom-6 z-50">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            <PlusCircle size={32} />
          </button>
        </div>

        {/* Modal for Post Creation/Editing */}
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
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {success && <p className="text-green-500 mb-4">{success}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-semibold">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-3 w-full h-48 object-cover rounded-md"
                    />
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

        {/* Posts Display */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available.</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => {
                const isLiked = post.likes?.includes(userId);
                const imageUrl = post.mediaUrls?.[0] ? `http://localhost:8080${post.mediaUrls[0]}` : null;
                if (imageUrl) {
                  console.log(`Image URL for post ${post.id}: ${imageUrl}`);
                } else {
                  console.log(`No image URL for post ${post.id}`);
                }

                return (
                  <div
                    key={post.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow max-w-md mx-auto"
                  >
                    {/* Post Header */}
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-500">
                        Posted by User {post.userId} on{' '}
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 mb-3 text-sm">{post.description}</p>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Post media"
                        className="w-full aspect-square object-cover rounded-md"
                        onError={() => handleImageError(post.id, imageUrl)}
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-md">
                        <p className="text-gray-500">No image available</p>
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLike(post.id, isLiked)}
                          className={`flex items-center gap-1 ${isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                        >
                          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                          <span>{post.likes?.length || 0}</span>
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

                    {visibleComments.has(post.id) && (
                      <div className="mt-4 border-t pt-4">
                        <Comments
                          postId={post.id}
                          currentUserId={userId}
                          postOwnerId={post.userId}
                          onCommentAdded={() => fetchCommentCount(post.id)}
                          onCommentDeleted={() => fetchCommentCount(post.id)}
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
    </>
  );
}