import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../main-main/Navbar';
import { User } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user'));
      if (updatedUser) {
        setUser(updatedUser);
      }
    };

    syncUser();

    // Optional: Re-sync if localStorage changes in other tabs or elsewhere
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex justify-center mt-10">
        <div className="bg-white p-10 rounded-lg shadow-lg w-[500px]">
          {/* Profile Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-40 h-40 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300">
              <User size={80} className="text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-center">Profile Details</h2>
          
          {user ? (
            <div className="space-y-6">
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-lg">{user.firstName} {user.lastName}</p>
              </div>
              
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium text-lg">{user.age}</p>
              </div>
              
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-lg">{user.address}</p>
              </div>
              
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-lg">{user.phoneNumber}</p>
              </div>
              
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-lg">{user.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No user data found.</p>
          )}
          
          <button
            className="mt-8 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg"
            onClick={() => navigate('/update')}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
}
