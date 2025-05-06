import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAuth from './GoogleAuth';

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        {/* Google Sign In */}
        <div className="mb-6">
          <GoogleOAuthProvider clientId="1091952021992-2qgqj8vqj8vqj8vqj8vqj8vqj8vqj8vq">
            <GoogleAuth />
          </GoogleOAuthProvider>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Regular Sign Up Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
            name="firstName" 
            placeholder="First Name" 
            onChange={handleChange} 
            required 
          />
          <input 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
            name="lastName" 
            placeholder="Last Name" 
            onChange={handleChange} 
            required 
          />
          <input 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
            name="age" 
            type="number" 
            placeholder="Age" 
            onChange={handleChange} 
            required 
          />
          <input 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
            name="address" 
            placeholder="Address" 
            onChange={handleChange} 
            required 
          />
          <input 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
            name="phoneNumber" 
            placeholder="Phone Number" 
            onChange={handleChange} 
            required 
          />
          <input 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
            name="email" 
            type="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
          />
          <input 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
          />
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
