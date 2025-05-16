import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../../assets/background-3.jpg';
import { Code2 } from 'lucide-react';
import googleLogo from '../../assets/google-logo.png';
import githubLogo from '../../assets/github-logo.png';

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
      setTimeout(() => navigate('/home'), 1000); // delay to show toast before redirect
    } catch (err) {
      toast.error('Login failed. Check your email or password.');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: 'rgba(255, 255, 255, 0.59)',
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
      <div className="bg-white p-8 rounded-lg shadow-xl w-100 backdrop-blur-sm bg-opacity-90">
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
          <p className="text-sm text-center mt-4">
            Create account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Signup
            </Link>
          </p>
        </form>
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
      </div>
    </div>
  );
}
