import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';
import ScrollToTop from './components/common/ScrollToTop';
import { AuthProvider, useAuth } from './context/AuthContext';
import Photography from './pages/Photography';
import Blog from './pages/Blog';
import Shop from './pages/Shop';
import Podcast from './pages/Podcast';
import { trackUserSession } from './lib/analytics';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  React.useEffect(() => {
    trackUserSession(location.pathname);
  }, [location.pathname]);
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/admin/login" element={<Admin.Login />} />
        <Route 
          path="/admin/*" 
          element={
            <PrivateRoute>
              <Admin.Dashboard />
            </PrivateRoute>
          } 
        />
      </Routes>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;