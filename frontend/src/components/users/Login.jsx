import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../../assets/background-2.jpg';
import { Code2 } from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAuth from './GoogleAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login successful! Redirecting...');
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      toast.error('Login failed. Check your email or password.');
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
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 backdrop-blur-sm bg-opacity-90">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleOAuthProvider clientId="240003374876-vouemc46ift88d5crhtgmm21nqtio286.apps.googleusercontent.com">
              <GoogleAuth />
            </GoogleOAuthProvider>
          </div>

          <p className="text-sm text-center mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
