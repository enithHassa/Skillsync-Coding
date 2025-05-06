import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/users/Login';
import Profile from './components/users/Profile';
import Logout from './components/users/Logout';
import EditProfile from './components/users/EditProfile';
import Signup from './components/users/Signup';
import Home from './components/main-main/Home';

import CourseManager from './components/courses/CourseList';

import Comments from './components/interactivity/Comments';
import MyPosts from './components/skill-posts/MyPosts';

import SkillsharePost from './components/skill-posts/SkillsharePost';
import ProgressPage from './components/learning-progress/pages/ProgressPage';

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
        <Route path="/posts" element={<SkillsharePost />} />
        <Route path="/my-posts" element={<MyPosts />} />

        <Route path="/progress" element={<ProgressPage />} />


        {/* <Route path="/plans" element={<CoursePage />} /> */}
        <Route path="/courses" element={<CoursePage />} />
        


        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />

      </Routes>
    </Router>
  );
}

export default App;