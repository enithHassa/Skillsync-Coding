import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    address: '',
    phoneNumber: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      toast.success('Account created! Redirecting to profile...');
      setTimeout(() => navigate('/profile'), 1000);
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-md w-96" onSubmit={handleSignup}>
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
        <input className="w-full p-2 mb-3 border rounded" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input className="w-full p-2 mb-3 border rounded" name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input className="w-full p-2 mb-3 border rounded" name="age" type="number" placeholder="Age" onChange={handleChange} required />
        <input className="w-full p-2 mb-3 border rounded" name="address" placeholder="Address" onChange={handleChange} required />
        <input className="w-full p-2 mb-3 border rounded" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
        <input className="w-full p-2 mb-3 border rounded" name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input className="w-full p-2 mb-3 border rounded" name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Sign Up
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
