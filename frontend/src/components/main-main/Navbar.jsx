import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Share2,
  Book,
  LineChart,
  UserCircle,
  LogOut,
  User,
  X,
  Home
} from 'lucide-react';
import logo from '../../assets/skillsync-logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigateToHome = () => {
    navigate('/home');
    setSidebarOpen(false);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white px-6 py-2 shadow-md w-full z-50 relative">
        {/* Left: Logo & SkillSync */}
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="SkillSync Logo"
            className="h-10 w-10 cursor-pointer"
            onClick={toggleSidebar}
          />
          <h1
            className="text-xl font-bold text-blue-600 cursor-pointer"
            onClick={navigateToHome}
          >
            SkillSync
          </h1>
        </div>

        {/* Center: Search and Icons */}
        <div className="flex items-center space-x-8">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-1 border border-black rounded-md w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="relative group flex items-center">
            <button onClick={() => navigate('/s')} className="hover:text-blue-600">
              <Share2 className="w-6 h-6 text-black" />
            </button>
            <span className="absolute top-full mt-1 px-2 py-0.5 text-sm text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
              Skill Posts
            </span>
          </div>

          <div className="relative group flex items-center">
            <button onClick={() => navigate('/plans')} className="hover:text-blue-600">
              <Book className="w-6 h-6 text-black" />
            </button>
            <span className="absolute top-full mt-1 px-2 py-0.5 text-sm text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
              Learning Plans
            </span>
          </div>

          <div className="relative group flex items-center">
            <button onClick={() => navigate('/progress')} className="hover:text-blue-600">
              <LineChart className="w-6 h-6 text-black" />
            </button>
            <span className="absolute top-full mt-1 px-2 py-0.5 text-sm text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
              Learning Progress
            </span>
          </div>
        </div>

        {/* Right: Profile dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown}>
            <UserCircle className="w-6 h-6 text-black hover:text-blue-600 transition-colors" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
              <button
                onClick={() => navigate('/profile')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  View Profile
                </div>
              </button>
              <button
                onClick={() => navigate('/update')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Update Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </div>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-blue-100 shadow-lg p-4 z-40 transition-transform duration-300 ease-in-out">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <ul className="space-y-4">
            <li 
              className="flex items-center space-x-2 cursor-pointer hover:text-blue-700"
              onClick={navigateToHome}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </li>
            <li className="cursor-pointer hover:text-blue-700">My Posts</li>
            <li className="cursor-pointer hover:text-blue-700">Settings</li>
            <li className="cursor-pointer hover:text-blue-700">Help</li>
          </ul>
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            onClick={toggleSidebar}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
