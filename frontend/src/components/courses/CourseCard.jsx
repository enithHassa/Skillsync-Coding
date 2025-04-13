const CourseCard = ({ course, onEdit, onDelete }) => {
    return (
      <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-all border border-gray-200">
        <p className="text-sm text-gray-500 font-semibold">{course.platform}</p>
  
        <h2 className="text-xl font-bold text-blue-800">{course.title}</h2>
  
        <p className="text-sm text-gray-700 mt-1">{course.shortDescription}</p>
  
        <div className="text-sm text-gray-500 mt-2">
          <p><strong>Category:</strong> {course.category}</p>
          <p><strong>Status:</strong> {course.completed ? "✅ Completed" : "🕒 In Progress"}</p>
        </div>
  
        <div className="flex justify-between items-center mt-4 text-sm">
          <a href={course.url} className="text-blue-600 underline" target="_blank" rel="noreferrer">
            Visit Course
          </a>
          <div className="space-x-3">
            <button onClick={() => onEdit(course)} className="text-yellow-500 hover:underline">
              ✏️ Edit
            </button>
            <button onClick={() => onDelete(course._id)} className="text-red-500 hover:underline">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default CourseCard;
  