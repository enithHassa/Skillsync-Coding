import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../../assets/background-1.jpg';
import { Code2 } from 'lucide-react';
import googleLogo from '../../assets/google-logo.png';
import githubLogo from '../../assets/github-logo.png';

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
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <h1 className="text-6xl font-bold mb-8 -mt-20 flex items-center">
        <span className="text-blue-800">Skill</span>
        <span className="text-gray-700">Sync</span>
        <Code2 
          className="mx-1 text-gray-600 transform translate-y-3" 
          size={48} 
        />
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-xl w-[600px] backdrop-blur-sm bg-opacity-90">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              name="firstName" 
              placeholder="First Name" 
              onChange={handleChange} 
              required 
            />
            <input 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              name="lastName" 
              placeholder="Last Name" 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              name="age" 
              type="number" 
              placeholder="Age" 
              onChange={handleChange} 
              required 
            />
            <input 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              name="phoneNumber" 
              placeholder="Phone Number" 
              onChange={handleChange} 
              required 
            />
          </div>
          <input 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            name="address" 
            placeholder="Address" 
            onChange={handleChange} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              name="email" 
              type="email" 
              placeholder="Email" 
              onChange={handleChange} 
              required 
            />
            <input 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              name="password" 
              type="password" 
              placeholder="Password" 
              onChange={handleChange} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Sign Up
          </button>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg shadow hover:bg-gray-100 transition-colors duration-200 mb-2"
            >
              <img src={googleLogo} alt="Google" className="w-6 h-6" />
              <span className="font-semibold">Sign in with Google</span>
            </button>
            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/github'}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-3 rounded-lg shadow hover:bg-gray-800 transition-colors duration-200"
            >
              <img src={githubLogo} alt="GitHub" className="w-6 h-6 bg-white rounded-full" />
              <span className="font-semibold">Sign in with GitHub</span>
            </button>
          </div>
          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <Link to="/" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
