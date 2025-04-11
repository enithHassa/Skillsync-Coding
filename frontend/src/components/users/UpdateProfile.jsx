import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser, deleteUser } from '../../services/userService';

export default function EditProfile() {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState(localUser);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await updateUser(localUser.id, form);
    localStorage.setItem('user', JSON.stringify(res.data));
    navigate('/profile');
  };

  const handleDelete = async () => {
    await deleteUser(localUser.id);
    localStorage.removeItem('user');
    navigate('/login');
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
