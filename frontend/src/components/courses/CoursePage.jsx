import Navbar from "../main-main/Navbar";
import CourseList from "./CourseList";

export default function CoursePage() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen pt-4">
        <CourseList />
      </div>
    </>
  );
}
