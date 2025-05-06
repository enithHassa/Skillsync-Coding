import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function GoogleAuth() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google response:', credentialResponse); // Debug log
    try {
      const response = await axios.post('http://localhost:8080/api/auth/google', {
        credential: credentialResponse.credential
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Backend response:', response.data); // Debug log

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Successfully logged in with Google!');
        navigate('/home');
      } else {
        console.error('No token in response:', response.data); // Debug log
        toast.error('Login failed: No token received');
      }
    } catch (error) {
      console.error('Google auth error:', error); // Debug log
      const errorMessage = error.response?.data || error.message;
      console.error('Error details:', errorMessage); // Debug log
      toast.error('Failed to login with Google: ' + errorMessage);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google login failed:', error); // Debug log
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap
        theme="filled_blue"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
} 