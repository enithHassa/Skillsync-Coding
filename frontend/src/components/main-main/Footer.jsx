import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/skillsync-logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', path: '/features' },
      { name: 'Skill Posts', path: '/s' },
      { name: 'Learning Plans', path: '/plans' },
      { name: 'Progress Tracking', path: '/progress' }
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Blog', path: '/blog' },
      { name: 'Contact', path: '/contact' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'FAQ', path: '/faq' }
    ]
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, url: '#', name: 'Facebook' },
    { icon: <Twitter size={20} />, url: '#', name: 'Twitter' },
    { icon: <Instagram size={20} />, url: '#', name: 'Instagram' },
    { icon: <Linkedin size={20} />, url: '#', name: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-50 border-t-4 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="SkillSync Logo" className="h-12 w-12 rounded-full bg-white p-1 shadow-md border border-gray-200" />
              <span className="flex items-center text-2xl font-bold">
                <span className="text-blue-800">Skill</span>
                <span className="text-gray-800">Sync</span>
                <Code2 className="ml-1 text-gray-600" size={22} />
              </span>
            </div>
            <p className="text-gray-700 mb-6">
              Empowering learners to achieve their goals through collaborative skill development
              and personalized learning journeys.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-700 hover:text-blue-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="border-t-3 border-gray-200 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail size={20} className="text-gray-600" />
              <span>contact@skillsync.com</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Phone size={20} className="text-gray-600" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <MapPin size={20} className="text-gray-600" />
              <span>123 Learning Street, Education City</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t-3 border-gray-200 mt-8 pt-8">
          <p className="text-center text-gray-600">
            © {currentYear} SkillSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 