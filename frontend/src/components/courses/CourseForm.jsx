import { useState, useEffect, useRef } from "react";
import axios from "axios";

const defaultForm = {
  title: "",
  platform: "",
  shortDescription: "",
  url: "",
  category: "",
  completed: false,
  userId: "test",
  imagePath: ""
};

const CourseForm = ({ onSubmit, selected }) => {
  const [form, setForm] = useState(defaultForm);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null); // to reset file input manually

  useEffect(() => {
    if (selected) {
      setForm(selected);
      setPreview(selected.imagePath ? `http://localhost:8080${selected.imagePath}` : null);
    } else {
      setForm(defaultForm);
      setPreview(null);
    }
  }, [selected]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      console.log("Uploading image...");
      const res = await axios.post("http://localhost:8080/skillsync/images/upload", formData);
      const imagePath = res.data;
      console.log("✅ Image uploaded. Received path:", imagePath); // 👈 ADD THIS
      setForm((prev) => ({ ...prev, imagePath }));
      setPreview(`http://localhost:8080${imagePath}`);
    } catch (err) {
      console.error("❌ Image upload failed:", err);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🟡 FINAL form.imagePath before submit:", form.imagePath); // ✅
    onSubmit(form);
    setForm(defaultForm);
    setPreview(null);
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded-xl shadow">
      <h2 className="text-lg font-semibold">{selected ? "Update Course" : "Add New Course"}</h2>

      {/* ✅ Image Preview */}
      {preview && (
        <img
          src={preview}
          alt="Course Preview"
          className="w-full h-40 object-cover rounded-md mb-2"
        />
      )}

      {/* ✅ Image Upload */}
      <input
        type="file"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="input"
      />

      <input className="input" name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <input className="input" name="platform" placeholder="Platform" value={form.platform} onChange={handleChange} />
      <textarea className="input" name="shortDescription" placeholder="Short Description" value={form.shortDescription} onChange={handleChange} />
      <input className="input" name="url" placeholder="URL" value={form.url} onChange={handleChange} />
      <input className="input" name="category" placeholder="Category" value={form.category} onChange={handleChange} />

      <label className="flex items-center space-x-2">
        <input type="checkbox" name="completed" checked={form.completed} onChange={handleChange} />
        <span>Completed</span>
      </label>

      <button type="submit" className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700">
        {selected ? "Update" : "Add"} Course
      </button>
    </form>
  );
};

export default CourseForm;
