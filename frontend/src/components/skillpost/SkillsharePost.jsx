import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../main-main/Navbar';

export default function SkillsharePost() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [posts, setPosts] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editImagePreviews, setEditImagePreviews] = useState([]);

  // Hardcoded userId for demo purposes; replace with actual user authentication
  const userId = '12345';

  // Backend base URL (adjust if your backend runs on a different port)
  const BASE_URL = 'http://localhost:8080';

  // Fetch all posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/posts`);
      setPosts(response.data);
      setImageErrors({});
      setError('');
    } catch (err) {
      setError('Failed to fetch posts: ' + (err.response?.data || err.message));
    }
  };

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Create FormData object to send multipart form data
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('description', description);

    // Append all selected image files
    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput.files.length > 0) {
      Array.from(fileInput.files).forEach((file) => {
        formData.append('media', file);
      });
    }

    try {
      // Send POST request to backend
      await axios.post(`${BASE_URL}/api/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Post created successfully!');
      // Reset form
      setDescription('');
      setImagePreviews([]);
      fileInput.value = '';
      // Refresh posts
      fetchPosts();
    } catch (err) {
      setError('Failed to create post: ' + (err.response?.data || err.message));
    }
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const previews = files.map((file) => URL.createObjectURL(file));
      setEditImagePreviews(previews);
    } else {
      setEditImagePreviews([]);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditDescription(post.description);
    setEditImagePreviews(post.mediaUrls ? post.mediaUrls.map((url) => `${BASE_URL}${url}`) : []);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Create FormData object for update
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('description', editDescription);

    // Append new image files (if any)
    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput.files.length > 0) {
      Array.from(fileInput.files).forEach((file) => {
        formData.append('media', file);
      });
    }

    try {
      // Send PUT request to backend
      await axios.put(`${BASE_URL}/api/posts/${editingPost.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Post updated successfully!');
      // Reset edit form
      setEditingPost(null);
      setEditDescription('');
      setEditImagePreviews([]);
      fileInput.value = '';
      // Refresh posts
      fetchPosts();
    } catch (err) {
      setError('Failed to update post: ' + (err.response?.data || err.message));
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      // Send DELETE request to backend
      await axios.delete(`${BASE_URL}/api/posts/${postId}`);
      setSuccess('Post deleted successfully!');
      // Refresh posts
      fetchPosts();
    } catch (err) {
      setError('Failed to delete post: ' + (err.response?.data || err.message));
    }
  };

  // Handle image load errors
  const handleImageError = (url) => {
    setImageErrors((prev) => ({
      ...prev,
      [url]: 'Failed to load image',
    }));
    console.error(`Image failed to load: ${url}`);
  };

  // Handle successful image load
  const handleImageLoad = (url) => {
    setImageErrors((prev) => ({
      ...prev,
      [url]: null,
    }));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 px-4">
        {/* Post Creation Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Share a Skill Post</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-700"
              />
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  ))}
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

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Share Post
            </button>
          </form>
        </div>

        {/* Existing Posts */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Existing Posts</h2>
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                  {editingPost && editingPost.id === post.id ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <label className="block mb-1 font-semibold">Upload New Images</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleEditImageChange}
                          className="block w-full text-sm text-gray-700"
                        />
                        {editImagePreviews.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {editImagePreviews.map((preview, index) => (
                              <img
                                key={index}
                                src={preview}
                                alt={`Edit Preview ${index + 1}`}
                                className="w-32 h-32 object-cover rounded-md"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold">Description</label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={4}
                          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Update your skill description..."
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPost(null)}
                          className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="text-gray-800 mb-2">{post.description}</p>
                      {post.mediaUrls && post.mediaUrls.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.mediaUrls.map((url, index) => {
                            const fullUrl = `${BASE_URL}${url}`;
                            return (
                              <div key={index} className="relative">
                                <img
                                  src={fullUrl}
                                  alt={`Media ${index + 1}`}
                                  className="w-32 h-32 object-cover rounded-md"
                                  onError={() => handleImageError(fullUrl)}
                                  onLoad={() => handleImageLoad(fullUrl)}
                                />
                                {imageErrors[fullUrl] && (
                                  <p className="text-xs text-red-500 mt-1">
                                    {imageErrors[fullUrl]}: {fullUrl}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No media available</p>
                      )}
                      <p className="text-sm text-gray-500 mb-2">
                        Posted by User {post.userId} on{' '}
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="flex-1 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}