import Navbar from "../main-main/Navbar";
import CourseList from "./CourseList";

export default function CoursePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="sticky top-0 z-50 bg-white shadow">
        <Navbar />
      </div>
      <div className="pt-4 px-4">
        <CourseList />
      </div>
    </div>
  );
}
