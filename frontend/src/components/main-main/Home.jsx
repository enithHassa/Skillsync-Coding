import { useNavigate } from 'react-router-dom';
import { Share2, Book, LineChart, Users, MessageCircle } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import logo from '../../assets/skillsync-logo.png';
import backgroundImage from '../../assets/background-2.jpg';

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const features = [
    {
      icon: <Share2 className="w-12 h-12 text-blue-500" />,
      title: 'Skill Posts',
      description: 'Share and discover new skills with the community.',
      path: '/s'
    },
    {
      icon: <Book className="w-12 h-12 text-blue-500" />,
      title: 'Learning Plans',
      description: 'Create and follow structured learning paths.',
      path: '/courses'
    },
    {
      icon: <LineChart className="w-12 h-12 text-blue-500" />,
      title: 'Learning Progress',
      description: 'Track your learning journey and achievements.',
      path: '/progress'
    },
    {
      icon: <Users className="w-12 h-12 text-blue-500" />,
      title: 'Community',
      description: 'Follow others, grow your network, and collaborate.',
      path: '/profile'
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-blue-500" />,
      title: 'Comments & Feedback',
      description: 'Engage with posts and share your thoughts.',
      path: '/posts'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div
          className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-15 mb-0"
          style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay' }}
        >
          <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
            <img src={logo} alt="SkillSync Logo" className="w-24 h-24 mb-4 drop-shadow-xl bg-white rounded-full p-2" />
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">Welcome to SkillSync</h1>
            <p className="text-2xl text-blue-100 mb-8 max-w-2xl mx-auto drop-shadow">Your all-in-one platform to share, learn, and track skills. Join a vibrant community and accelerate your learning journey!</p>
            <button
              className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-blue-50 transition-colors text-lg"
              onClick={() => navigate('/profile')}
            >
              Go to My Profile
            </button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/70 to-blue-400/60 z-0" style={{ pointerEvents: 'none' }} />
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">What You Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.path)}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col items-center text-center border border-blue-100 hover:border-blue-300"
              >
                <div className="mb-4 p-3 bg-blue-50 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-700">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community/Engagement Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-16">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">Connect, Collaborate, and Grow</h2>
              <p className="text-lg text-blue-900 mb-6">SkillSync is more than just a learning platform. It's a thriving community where you can:</p>
              <ul className="list-disc list-inside text-blue-800 space-y-2">
                <li>Follow and connect with other learners</li>
                <li>Share your progress and celebrate achievements</li>
                <li>Comment on posts and give feedback</li>
                <li>Build your personal learning network</li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <img src={logo} alt="Community" className="w-48 h-48 rounded-full shadow-lg bg-white p-4" />
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-8 text-blue-700">Your Learning Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                <div className="text-gray-600">Skills Shared</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                <div className="text-gray-600">Active Plans</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                <div className="text-gray-600">Progress Rate</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 