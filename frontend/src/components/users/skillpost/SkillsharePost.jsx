import { useState } from 'react';
import Navbar from '../../main-main/Navbar';
export default function SkillsharePost() {
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Post submitted:', { imagePreview, description });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center mt-10">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Share a Skill Post</h2>
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
      </div>
    </>
  );
}
