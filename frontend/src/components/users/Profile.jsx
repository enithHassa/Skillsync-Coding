import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../main-main/Navbar';
import { User } from 'lucide-react';
import { getFollowers, getFollowing, getUser } from '../../services/userService';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [posts, setPosts] = useState([]);
  const [followerUsers, setFollowerUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const navigate = useNavigate();

  // Color options for the profile icon
  const colorOptions = {
    blue: 'from-blue-400 to-purple-500',
    green: 'from-green-400 to-teal-500',
    pink: 'from-pink-400 to-rose-500',
    orange: 'from-orange-400 to-red-500',
    indigo: 'from-indigo-400 to-violet-500'
  };

  useEffect(() => {
    const syncUser = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user'));
      if (updatedUser) {
        setUser(updatedUser);
        getFollowers(updatedUser.id).then(res => setFollowers(res.data)).catch(() => setFollowers([]));
        getFollowing(updatedUser.id).then(res => setFollowing(res.data)).catch(() => setFollowing([]));
        // Fetch user's posts
        axios.get(`http://localhost:8080/api/posts/user/${updatedUser.id}`).then(res => setPosts(res.data)).catch(() => setPosts([]));
      }
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  // Fetch user details for followers/following
  useEffect(() => {
    Promise.all(followers.map(id => getUser(id).then(res => res.data).catch(() => null)))
      .then(users => setFollowerUsers(users.filter(Boolean)));
  }, [followers]);
  useEffect(() => {
    Promise.all(following.map(id => getUser(id).then(res => res.data).catch(() => null)))
      .then(users => setFollowingUsers(users.filter(Boolean)));
  }, [following]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto mt-12">
        {/* Followers Sidebar (Left) */}
        <div className="hidden md:flex flex-col items-end w-1/4 pr-6">
          <h3 className="text-lg font-semibold mb-2">Followers</h3>
          <div className="bg-gray-50 rounded-lg shadow p-2 w-full max-h-96 overflow-y-auto">
            {followerUsers.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">No followers yet.</p>
            ) : (
              <ul className="space-y-2">
                {followerUsers.map(u => (
                  <li key={u.id} className="text-gray-700 text-sm font-medium">{u.firstName} {u.lastName}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Main Profile Card (Center) */}
        <div className="flex-1 flex flex-col items-center">
          {/* Profile Icon */}
          <div className={`w-32 h-32 md:w-40 md:h-40 bg-gradient-to-r ${colorOptions[user?.iconColor || 'blue']} rounded-full flex items-center justify-center shadow-lg border-4 border-white -mt-16 md:mt-0 mb-4`}>
            <User size={80} className="text-white" />
          </div>
          <div className="bg-white w-full max-w-xl rounded-xl shadow-lg pt-8 pb-10 px-6 md:px-12 flex flex-col items-center">
            {/* Name, Bio */}
            <h2 className="text-3xl font-bold text-center">{user?.displayName || (user ? `${user.firstName} ${user.lastName}` : '')}</h2>
            {/* Stats Bar */}
            <div className="flex justify-center gap-10 mt-6 mb-4 w-full">
              <div className="text-center">
                <p className="text-xl font-bold">{followerUsers.length}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{followingUsers.length}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{posts.length}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex gap-6 mt-6 mb-8 border-b w-full justify-center">
              <button className={`pb-2 px-4 text-lg font-medium border-b-2 transition-colors ${activeTab === 'about' ? 'border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'}`} onClick={() => setActiveTab('about')}>About</button>
              <button className={`pb-2 px-4 text-lg font-medium border-b-2 transition-colors ${activeTab === 'posts' ? 'border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'}`} onClick={() => setActiveTab('posts')}>Posts</button>
            </div>
            {/* Tab Content */}
            {activeTab === 'about' && (
              <div className="w-full max-w-xl mx-auto space-y-4">
                <div className="flex flex-col md:flex-row md:gap-8">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-lg">{user?.firstName} {user?.lastName}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium text-lg">{user?.age}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-8">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-lg">{user?.address}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-lg">{user?.phoneNumber}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-lg">{user?.email}</p>
                </div>
              </div>
            )}
            {activeTab === 'posts' && (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {posts.length === 0 ? (
                  <p className="text-gray-400 text-center col-span-2">No posts yet.</p>
                ) : (
                  posts.map(post => (
                    <div key={post.id} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col">
                      {post.mediaUrls && post.mediaUrls.length > 0 && (
                        <img src={`http://localhost:8080${post.mediaUrls[0]}`} alt="Post media" className="w-full h-48 object-cover rounded mb-3" />
                      )}
                      <p className="text-gray-800 mb-2">{post.description}</p>
                      <div className="flex justify-between text-xs text-gray-500 mt-auto">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>{post.isVideo ? 'Video' : 'Image'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            <button
              className="mt-8 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg"
              onClick={() => navigate('/update')}
            >
              Edit Profile
            </button>
          </div>
        </div>
        {/* Following Sidebar (Right) */}
        <div className="hidden md:flex flex-col items-start w-1/4 pl-6">
          <h3 className="text-lg font-semibold mb-2">Following</h3>
          <div className="bg-gray-50 rounded-lg shadow p-2 w-full max-h-96 overflow-y-auto">
            {followingUsers.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">Not following anyone yet.</p>
            ) : (
              <ul className="space-y-2">
                {followingUsers.map(u => (
                  <li key={u.id} className="text-gray-700 text-sm font-medium">{u.firstName} {u.lastName}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {/* Mobile: Stack followers/profile/following */}
      <div className="flex flex-col md:hidden w-full max-w-xl mx-auto mt-8 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Followers</h3>
          <div className="bg-gray-50 rounded-lg shadow p-2 w-full max-h-64 overflow-y-auto">
            {followerUsers.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">No followers yet.</p>
            ) : (
              <ul className="space-y-2">
                {followerUsers.map(u => (
                  <li key={u.id} className="text-gray-700 text-sm font-medium">{u.firstName} {u.lastName}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Following</h3>
          <div className="bg-gray-50 rounded-lg shadow p-2 w-full max-h-64 overflow-y-auto">
            {followingUsers.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">Not following anyone yet.</p>
            ) : (
              <ul className="space-y-2">
                {followingUsers.map(u => (
                  <li key={u.id} className="text-gray-700 text-sm font-medium">{u.firstName} {u.lastName}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
