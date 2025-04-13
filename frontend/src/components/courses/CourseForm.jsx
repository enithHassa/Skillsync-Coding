import { useState, useEffect } from "react";

const defaultForm = {
  title: "",
  platform: "",
  shortDescription: "",
  url: "",
  category: "",
  completed: false,
  userId: "test"
};

const CourseForm = ({ onSubmit, selected }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (selected) setForm(selected);
    else setForm(defaultForm);
  }, [selected]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm(defaultForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded-xl shadow">
      <h2 className="text-lg font-semibold">{selected ? "Update Course" : "Add New Course"}</h2>
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
