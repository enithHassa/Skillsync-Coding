import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/users/Login';
import Profile from './components/users/Profile';
import Logout from './components/users/Logout';
import EditProfile from './components/users/EditProfile';
import Signup from './components/users/Signup';
import CourseManager from './components/courses/CourseList';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update" element={<EditProfile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/courses" element={<CourseManager />} /> {/* ✅ New route */}
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default App;
