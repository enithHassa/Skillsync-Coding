import { useState, useEffect, useRef } from 'react';
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
  Search,
  Code2
} from 'lucide-react';
import logo from '../../assets/skillsync-logo.png';
import axios from 'axios';

export default function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef();

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

  useEffect(() => {
    if (!showSearch) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchInput.trim()) {
      setSearchResults({ users: [], posts: [] });
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setSearchLoading(true);
      Promise.all([
        axios.get(`http://localhost:8080/skillsync/users/search?query=${encodeURIComponent(searchInput.trim())}`),
        axios.get(`http://localhost:8080/api/posts/search?query=${encodeURIComponent(searchInput.trim())}`)
      ]).then(([userRes, postRes]) => {
        setSearchResults({ users: userRes.data, posts: postRes.data });
        setShowDropdown(true);
      }).finally(() => setSearchLoading(false));
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput, showSearch]);

  const handleResultClick = (type, item) => {
    setShowSearch(false);
    setShowDropdown(false);
    setSearchInput("");
    if (type === 'user') {
      navigate(`/profile/${item.id}`); // You may need to implement this route
    } else if (type === 'post') {
      // navigate to post detail if you have it, or just to posts page
      navigate('/posts');
    }
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="bg-gray-100 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center h-16 px-6">
            {/* Left: Logo & SkillSync */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={navigateToHome}>
                <img
                  src={logo}
                  alt="SkillSync Logo"
                  className="h-12.5 w-12.5 rounded-full bg-white p-1 shadow-md border border-gray-200 hover:opacity-80 transition-opacity"
                />
                <span className="flex items-center text-2xl font-bold">
                  <span className="text-blue-800">Skill</span>
                  <span className="text-gray-800">Sync</span>
                  <Code2 className="ml-1 text-gray-600" size={28} />
                </span>
              </div>
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
                    onClick={() => navigate('/courses')} 
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
        <div className="absolute top-16 left-0 w-full z-40">
          <div className="max-w-3xl mx-auto py-4 px-6 relative">
            <form className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                autoFocus
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onFocus={() => setShowDropdown(!!searchInput.trim())}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <button
                type="button"
                onClick={toggleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            {/* Dropdown Results */}
            {showDropdown && (searchInput.trim() || searchLoading) && (
              <div className="absolute left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg mt-1 z-50 max-h-96 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 text-gray-500">Searching...</div>
                ) : (
                  <>
                    <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500">Users</div>
                    {searchResults.users.length === 0 ? (
                      <div className="px-4 pb-2 text-gray-400">No users found.</div>
                    ) : (
                      searchResults.users.map(user => (
                        <div
                          key={user.id}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                          onClick={() => handleResultClick('user', user)}
                        >
                          <User className="w-5 h-5 text-blue-400" />
                          <span className="font-medium">{user.firstName} {user.lastName}</span>
                          <span className="ml-2 text-gray-400 text-xs">{user.email}</span>
                        </div>
                      ))
                    )}
                    <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500">Posts</div>
                    {searchResults.posts.length === 0 ? (
                      <div className="px-4 pb-2 text-gray-400">No posts found.</div>
                    ) : (
                      searchResults.posts.map(post => (
                        <div
                          key={post.id}
                          className="px-4 py-2 hover:bg-green-50 cursor-pointer"
                          onClick={() => handleResultClick('post', post)}
                        >
                          <span className="font-medium">{post.description}</span>
                          <span className="ml-2 text-gray-400 text-xs">By {post.userName}</span>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            )}
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
