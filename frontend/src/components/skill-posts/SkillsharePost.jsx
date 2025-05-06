import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../main-main/Navbar';
import { PlusCircle, Pencil, Trash2, MessageCircle, Heart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function SkillsharePost() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const userId = currentUser?.id;

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/posts');
      setPosts(response.data);
    } catch (err) {
      toast.error('Failed to fetch posts: ' + (err.response?.data || err.message));
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
    if (!currentUser) {
      toast.error('Please log in to create a post');
      navigate('/');
      return;
    }

    const formData = new FormData();
    formData.append('userId', currentUser.id);
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
      setImagePreview(null);
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
    setImagePreview(post.mediaUrls?.[0] ? `http://localhost:8080${post.mediaUrls[0]}` : null);
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

  const handleLike = async (postId, isLiked) => {
    if (!currentUser) {
      toast.error('Please log in to like posts');
      navigate('/');
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/posts/${postId}/like`,
        { userId: currentUser.id, action: isLiked ? 'unlike' : 'like' }
      );
      fetchPosts();
    } catch (err) {
      toast.error('Failed to update like: ' + (err.response?.data || err.message));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setDescription('');
    setImagePreview(null);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 px-4">
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

        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available.</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => {
                const isLiked = post.likes?.includes(currentUser.id);
                const isOwnPost = post.userId === currentUser.id;
                return (
                  <div
                    key={post.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow max-w-md mx-auto"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-500">
                        <span className="font-bold text-base text-gray-800">
                          {post.userName || (isOwnPost ? `${currentUser.firstName} ${currentUser.lastName}` : `User ${post.userId}`)}
                        </span>
                        {' '}posted on{' '}
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <p className="text-gray-800 mb-3 text-sm">{post.description}</p>
                    {post.mediaUrls && post.mediaUrls.length > 0 && (
                      <div className="mb-3">
                        <img
                          src={`http://localhost:8080${post.mediaUrls[0]}`}
                          alt="Post media"
                          className="w-full aspect-square object-cover rounded-md"
                        />
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLike(post.id, isLiked)}
                          className={`flex items-center gap-1 ${isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                        >
                          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                          <span>{post.likes?.length || 0}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 hover:text-green-600">
                          <MessageCircle size={18} />
                          <span>0</span>
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