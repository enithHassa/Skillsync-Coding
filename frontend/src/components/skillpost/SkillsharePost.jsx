import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../main-main/Navbar';

export default function SkillsharePost() {
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [posts, setPosts] = useState([]);

  // Hardcoded userId for demo purposes; replace with actual user authentication
  const userId = '12345';

  // Fetch all posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/posts');
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts: ' + (err.response?.data || err.message));
    }
  };

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
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

    // Append the image file if it exists
    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput.files[0]) {
      formData.append('media', fileInput.files[0]);
    }

    try {
      // Send POST request to backend
      await axios.post('http://localhost:8080/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Post created successfully!');
      // Reset form
      setDescription('');
      setImagePreview(null);
      fileInput.value = '';
      // Refresh posts
      fetchPosts();
    } catch (err) {
      setError('Failed to create post: ' + (err.response?.data || err.message));
    }
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
              <label className="block mb-1 font-semibold">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-700"
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
          <h2 className="text-2xl font-bold mb-4 text-center"> Posts</h2>
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-800 mb-2">{post.description}</p>
                  {post.mediaUrls && post.mediaUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.mediaUrls.map((url, index) => (
                        <img
                          key={index}
                          src={`http://localhost:8080${url}`}
                          alt={`Media ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    Posted by User {post.userId} on{' '}
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}