import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/users/Login';
import Profile from './components/users/Profile';
import Logout from './components/users/Logout';
import EditProfile from './components/users/EditProfile';
import Signup from './components/users/Signup';
import SkillsharePost from './components/skill-posts/SkillsharePost';
import CourseManager from './components/courses/CourseList';
import ProgressPage from './components/learning-progress/pages/ProgressPage';
import Comment from './components/interactivity/Comment';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update" element={<EditProfile />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/s" element={<SkillsharePost />} />
        <Route path="/courses" element={<CourseManager />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/comment" element={<Comment />} />

      </Routes>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default App;
