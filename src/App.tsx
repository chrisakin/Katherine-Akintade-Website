import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
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
      <RouterProvider router={router} />
      {!isAdminRoute && <Footer />}
    </div>
  );
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/photography",
      element: <Photography />,
    },
    {
      path: "/blog",
      element: <Blog />,
    },
    {
      path: "/blog/:slug",
      element: <BlogPost />,
    },
    {
      path: "/shop",
      element: <Shop />,
    },
    {
      path: "/podcast",
      element: <Podcast />,
    },
    {
      path: "/admin/login",
      element: <Admin.Login />,
    },
    {
      path: "/admin/*",
      element: (
        <PrivateRoute>
          <Admin.Dashboard />
        </PrivateRoute>
      ),
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true, // ✅ Fix React Router warning for v7
    },
  }
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ScrollToTop />
        <AppContent />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
