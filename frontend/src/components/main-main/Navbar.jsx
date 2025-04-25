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
  Home,
  Search
} from 'lucide-react';
import logo from '../../assets/skillsync-logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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
  const toggleSearch = () => setShowSearch(!showSearch);

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="bg-gray-100 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center h-16 px-6">
            {/* Left: Logo & SkillSync */}
            <div className="flex items-center space-x-4">
              <img
                src={logo}
                alt="SkillSync Logo"
                className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={toggleSidebar}
              />
              <h1
                className="text-2xl font-bold text-blue-700 cursor-pointer hover:text-blue-800 transition-colors"
                onClick={navigateToHome}
              >
                SkillSync
              </h1>
            </div>

            {/* Center: Icons */}
            <div className="flex-1 flex items-center justify-start pl-[25%]">
              <div className="flex items-center space-x-8">
                {/* Search Icon */}
                <div className="relative group">
                  <button 
                    onClick={toggleSearch} 
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Search className="w-7 h-7 text-gray-700 group-hover:text-blue-700 transition-colors" />
                  </button>
                  <span className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-1 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    Search
                  </span>
                </div>

                <div className="relative group">
                  <button 
                    onClick={() => navigate('/s')} 
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-7 h-7 text-gray-700 group-hover:text-blue-700 transition-colors" />
                  </button>
                  <span className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-1 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    Skill Posts
                  </span>
                </div>

                <div className="relative group">
                  <button 
                    onClick={() => navigate('/plans')} 
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Book className="w-7 h-7 text-gray-700 group-hover:text-blue-700 transition-colors" />
                  </button>
                  <span className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-1 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    Learning Plans
                  </span>
                </div>

                <div className="relative group">
                  <button 
                    onClick={() => navigate('/progress')} 
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <LineChart className="w-7 h-7 text-gray-700 group-hover:text-blue-700 transition-colors" />
                  </button>
                  <span className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-1 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    Learning Progress
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Profile dropdown */}
            <div className="ml-auto">
              <button 
                onClick={toggleDropdown}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <UserCircle className="w-7 h-7 text-gray-700 hover:text-blue-700 transition-colors" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => navigate('/update')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      Update Profile
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Input Overlay */}
      {showSearch && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg z-40 border-b border-gray-200">
          <div className="max-w-3xl mx-auto py-4 px-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                autoFocus
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <button
                onClick={toggleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200 shadow-lg p-6 z-40 transition-transform duration-300 ease-in-out">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Menu</h2>
          <ul className="space-y-4">
            <li 
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer p-2 rounded-lg hover:bg-gray-50"
              onClick={navigateToHome}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              <Share2 className="w-5 h-5" />
              <span>My Posts</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              <User className="w-5 h-5" />
              <span>Settings</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              <Book className="w-5 h-5" />
              <span>Help</span>
            </li>
          </ul>
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={toggleSidebar}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
