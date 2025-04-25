import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/users/Login';
import Profile from './components/users/Profile';
import Logout from './components/users/Logout';
import EditProfile from './components/users/EditProfile';
import Signup from './components/users/Signup';
import Home from './components/main-main/Home';
import SkillsharePost from './components/skill-posts/SkillsharePost';
import CourseManager from './components/courses/CourseList';
import ProgressPage from './components/learning-progress/pages/ProgressPage';
import Comments from './components/interactivity/Comments';

import SkillsharePost from './components/skill-posts/SkillsharePost';
// import CourseManager from './components/courses/CourseList'
import ProgressPage from './components/learning-progress/pages/ProgressPage';
import Comments from './components/interactivity/Comments';
import CoursePage from './components/courses/CoursePage';







function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update" element={<EditProfile />} />
        <Route path="/s" element={<SkillsharePost />} />
        <Route path="/plans" element={<CourseManager />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/comments/:id" element={<Comments />} />

      </Routes>
    </Router>
  );
}

export default App;
