const CourseCard = ({ course, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-all border border-gray-200">

      {/* ✅ Image Preview Section */}
      {course.imagePath && (
        <img
          src={`http://localhost:8080${course.imagePath}`}
          alt={course.title}
          className="w-full h-40 object-cover rounded-md mb-3"
        />
      )}

      {/* Course Platform */}
      <p className="text-sm text-gray-500 font-semibold">{course.platform}</p>

      {/* Course Title */}
      <h2 className="text-xl font-bold text-blue-800">{course.title}</h2>

      {/* Short Description */}
      <p className="text-sm text-gray-700 mt-1">{course.shortDescription}</p>

      {/* Metadata */}
      <div className="text-sm text-gray-500 mt-2">
        <p><strong>Category:</strong> {course.category}</p>
        <p><strong>Status:</strong> {course.completed ? "✅ Completed" : "🕒 In Progress"}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <a
          href={course.url}
          className="text-blue-600 underline"
          target="_blank"
          rel="noreferrer"
        >
          Visit Course
        </a>
        <div className="space-x-3">
          <button onClick={() => onEdit(course)} className="text-yellow-500 hover:underline">
            ✏️ Edit
          </button>
          <button
            onClick={() => {
              console.log("Deleting:", course.id);
              onDelete(course.id);
            }}
            className="text-red-500 hover:underline"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
