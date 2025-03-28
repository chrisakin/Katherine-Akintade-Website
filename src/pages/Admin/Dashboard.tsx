import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Image, 
  FileText, 
  ShoppingBag, 
  Mic, 
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

// Admin components
import Overview from './components/Overview';
import Photos from './components/Photos';
import Blog from './components/Blog';
import Shop from './components/Shop';
import Podcast from './components/Podcast';
import Profile from './components/Profile';

export default function Dashboard() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  // Save current route
  useEffect(() => {
    sessionStorage.setItem('adminPath', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const path = sessionStorage.getItem('adminPath');
    if (path && location.pathname.startsWith('/admin') && location.pathname !== path) {
      navigate(path, { replace: true });
    }
  }, [navigate, location.pathname]);
  const navigation = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutGrid },
    { name: 'Photos', href: '/admin/photos', icon: Image },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Shop', href: '/admin/shop', icon: ShoppingBag },
    { name: 'Podcast', href: '/admin/podcast', icon: Mic },
    { name: 'Profile', href: '/admin/profile', icon: User }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white md:hidden"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-gray-900 text-white transition-all duration-300
      `}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {isSidebarOpen && (
              <h1 className="text-xl font-semibold">Kathe's Dashboard</h1>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-800 hidden md:block flex-shrink-0"
            >
              {isSidebarOpen ? '←' : '→'}
            </button>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-colors
                  ${isActive(item.href) 
                    ? 'bg-gray-800 text-white' 
                    : 'hover:bg-gray-800'}
                `}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {isSidebarOpen && <span className="truncate">{item.name}</span>}
              </Link>
            ))}
          </nav>

          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors mt-8"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isSidebarOpen && <span className="truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
      } p-4 md:p-8`}>
        <div className="mt-16 md:mt-0">
          <Routes>
            <Route path="/dashboard"  element={<Overview />} />
            <Route path="/photos" element={<Photos />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}