import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile Details</h2>
        {user && (
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Phone:</strong> {user.phoneNumber}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
        <button
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          onClick={() => navigate('/update')}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
