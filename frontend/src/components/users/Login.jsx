import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/userService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/profile');
    } catch (err) {
      setErr('Login failed. Check credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-md w-96" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <input className="w-full p-2 mb-3 border rounded" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input className="w-full p-2 mb-3 border rounded" placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
}
