import { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "./CourseCard";
import CourseForm from "./CourseForm";
import { Plus, ChevronDown, ChevronUp, Filter } from "lucide-react";

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];
const SORTS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("newest");
  const [levelOpen, setLevelOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:8080/skillsync/courses?userId=test");
    setCourses(res.data);
  };

  const handleAddOrUpdate = async (data) => {
    if (data._id) {
      await axios.put(`http://localhost:8080/skillsync/courses/update/${data._id}`, data);
    } else {
      await axios.post("http://localhost:8080/skillsync/courses", data);
    }
    setSelected(null);
    setShowForm(false);
    fetchCourses();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/skillsync/courses/delete/${id}`);
      fetchCourses();
    } catch (err) {
      console.error("Delete failed:", err?.response?.data || err.message);
      alert("Failed to delete the course. Check console for more info.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter and sort courses
  const filteredCourses = courses
    .filter((c) => level === "All" || (c.level && c.level.toLowerCase() === level.toLowerCase()))
    .sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.id?.substring(0, 8) * 1000 || 0) - new Date(a.id?.substring(0, 8) * 1000 || 0);
      } else {
        return new Date(a.id?.substring(0, 8) * 1000 || 0) - new Date(b.id?.substring(0, 8) * 1000 || 0);
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* 🔵 Header Row */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-blue-900">Learning Plans</h2>
        <div className="flex flex-wrap gap-3 items-center">
          {/* Level Filter */}
          <div className="relative">
            <button
              onClick={() => setLevelOpen((v) => !v)}
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 text-gray-700 font-medium shadow-sm"
            >
              <Filter size={16} className="mr-1 text-blue-700" />
              {level} Level
              {levelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {levelOpen && (
              <div className="absolute z-10 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLevel(l); setLevelOpen(false); }}
                    className={`block w-full text-left px-4 py-2 hover:bg-blue-50 ${level === l ? 'bg-blue-100 text-blue-700' : ''}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Sort Filter */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 text-gray-700 font-medium shadow-sm"
            >
              Sort: {SORTS.find(s => s.value === sort)?.label}
              {sortOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {sortOpen && (
              <div className="absolute z-10 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                {SORTS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => { setSort(s.value); setSortOpen(false); }}
                    className={`block w-full text-left px-4 py-2 hover:bg-blue-50 ${sort === s.value ? 'bg-blue-100 text-blue-700' : ''}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Add New Button */}
          <button
            onClick={() => {
              setSelected(null); // clear form if was editing
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            <Plus size={18} />
            Add New Learning Plan
          </button>
        </div>
      </div>

      {/* 📝 Form (conditionally rendered) */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <CourseForm onSubmit={handleAddOrUpdate} selected={selected} />
        </div>
      )}

      {/* 📦 Course Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={(c) => {
              setSelected(c);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseList;
