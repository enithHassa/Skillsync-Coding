import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OAuth2Redirect() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/user/me', { withCredentials: true })
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data));
        setLoading(false);
        navigate('/home');
      })
      .catch(err => {
        setError('OAuth2 login failed. Please try again.');
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  return null;
} 