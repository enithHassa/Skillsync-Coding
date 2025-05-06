import { toast } from "react-toastify";
import { Pencil, Trash2, ArrowUpRight } from "lucide-react"; // Changed icon here

const CourseCard = ({ course, onEdit, onDelete }) => {
  const levelBadge = {
    Beginner: "bg-green-100 text-green-700",
    Intermediate: "bg-yellow-100 text-yellow-700",
    Advanced: "bg-red-100 text-red-700",
  };

  const handleEdit = () => {
    toast.info("Editing this learning plan...", {
      position: "top-right",
      autoClose: 2000,
      style: { backgroundColor: "#dcfce7", color: "#166534" },
    });
    onEdit(course);
  };

  const handleDelete = () => {
    toast.success("Learning plan deleted.", {
      position: "top-right",
      autoClose: 2000,
      style: { backgroundColor: "#fee2e2", color: "#991b1b" },
    });
    onDelete(course.id);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-all border border-gray-200">
      {/* ✅ Image */}
      {course.imagePath && (
        <img
          src={`http://localhost:8080${course.imagePath}`}
          alt={course.title}
          className="w-full h-40 object-cover rounded-md mb-3"
        />
      )}

      {/* Platform */}
      <p className="text-sm text-gray-500 font-semibold">{course.platform}</p>

      {/* Title */}
      <h2 className="text-xl font-bold text-blue-800">{course.title}</h2>

      {/* Description */}
      <p className="text-sm text-gray-700 mt-1">{course.shortDescription}</p>

      {/* Metadata */}
      <div className="text-sm text-gray-600 mt-3 space-y-1">
        <p><strong>Category:</strong> {course.category}</p>
        {course.price && <p><strong>Price:</strong> ${course.price}</p>}
        {course.duration && <p><strong>Duration:</strong> {course.duration}</p>}
        {course.level && (
          <p>
            <strong>Level:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${levelBadge[course.level] || "bg-gray-100 text-gray-700"}`}
            >
              {course.level}
            </span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-5 text-sm">
        <a
          href={course.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition px-3 py-1 rounded-full text-xs font-semibold"
        >
          Visit Course <ArrowUpRight className="w-4 h-4" />
        </a>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 transition px-3 py-1 rounded-full text-xs font-semibold"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 transition px-3 py-1 rounded-full text-xs font-semibold"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
