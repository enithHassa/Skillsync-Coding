import { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "./CourseCard";
import CourseForm from "./CourseForm";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);

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
    fetchCourses();
  };

  const handleDelete = async (id) => {
    try {
      console.log("Trying to delete course with ID:", id); // 👈 Log for debug
      await axios.delete(`http://localhost:8080/skillsync/courses/delete/${id}`);
      fetchCourses(); // Refresh the list
    } catch (err) {
      console.error("Delete failed:", err?.response?.data || err.message);
      alert("Failed to delete the course. Check console for more info.");
    }
  };
  

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <CourseForm onSubmit={handleAddOrUpdate} selected={selected} />
      <div className="grid gap-4">
        {courses.map((course) => (
          <CourseCard
          key={course.id} // instead of course._id
          
            course={course}
            onEdit={setSelected}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseList;
