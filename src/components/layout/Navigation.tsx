import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Camera, Menu, X, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    
    // If it's a hash link and we're on the home page
    if (path.startsWith('#') && location.pathname === '/') {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false); // Close mobile menu if open
      }
    } else if (path.startsWith('#')) {
      // If it's a hash link but we're not on home page, navigate home first
      navigate('/', { state: { scrollTo: path } });
    } else {
      // For non-hash links, use normal navigation
      navigate(path);
      setIsOpen(false);
    }
  };

  // Handle scrolling when navigating from another page
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.querySelector(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '#photography', label: 'Photography' },
    { path: '#blog', label: 'Blog' },
    { path: '#shop', label: 'Shop' }
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/identityshaper", label: "Instagram" },
    { icon: Twitter, href: "https://x.com/ayobolae", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com/@katherineoluwaseunakintade7617", label: "YouTube" },
    { icon: Facebook, href: "https://web.facebook.com/katherine.akintade/", label: "Facebook" }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Camera size={24} className={`transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            <span className={`font-medium text-lg transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              Katherine Ayobola Akintade
            </span>
          </Link>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6 text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`transition-colors hover:opacity-75 ${
                    isScrolled 
                      ? 'text-gray-900' 
                      : 'text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4 border-l border-gray-200/30 pl-8">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors hover:opacity-75 ${
                    isScrolled ? 'text-gray-900' : 'text-white'
                  }`}
                  aria-label={link.label}
                >
                  <link.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100/10">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`transition-colors ${
                    isScrolled ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              
              <div className="flex space-x-4 pt-4 border-t border-gray-100/10">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-colors hover:opacity-75 ${
                      isScrolled ? 'text-gray-900' : 'text-white'
                    }`}
                    aria-label={link.label}
                  >
                    <link.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}