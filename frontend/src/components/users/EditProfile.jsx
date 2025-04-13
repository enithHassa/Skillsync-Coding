import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser, deleteUser } from '../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditProfile() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState(storedUser);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(storedUser.id, form);
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Profile updated successfully!', {
        onClose: () => navigate('/profile')
      });
    } catch (error) {
      toast.error('Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(storedUser.id);
      localStorage.removeItem('user');
      toast.success('Account deleted successfully!', {
        onClose: () => navigate('/')
      });
    } catch (error) {
      toast.error('Failed to delete account.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        {['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'age', 'password'].map((field) => (
          <input
            key={field}
            type={field === 'age' ? 'number' : 'text'}
            name={field}
            placeholder={field}
            className="w-full border p-2"
            value={form[field]}
            onChange={handleChange}
            required
          />
        ))}
        <button className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
      </form>
      <button onClick={handleDelete} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">Delete Account</button>
    </div>
  );
}
