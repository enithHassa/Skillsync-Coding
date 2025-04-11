import { Routes, Route } from 'react-router-dom';
import Login from './components/users/Login';
import Profile from './components/users/Profile';
import UpdateProfile from './components/users/UpdateProfile';
import Logout from './components/users/Logout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/update" element={<UpdateProfile />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}

export default App;
