import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../main-main/Navbar';

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
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile Details</h2>
        {user ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Phone:</strong> {user.phoneNumber}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500">No user data found.</p>
        )}
        <button
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          onClick={() => navigate('/update')}
        >
          Update Profile
        </button>
      </div>
    </div>
    </>
  );
}
