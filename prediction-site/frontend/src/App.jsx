import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Predictions from './pages/Predictions';
import Profile from './pages/Profile';
import VIP from './pages/VIP';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Login from './pages/Login';
import Register from './pages/Register';
import Outcomes from './pages/Outcomes';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login with the current location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if current path is admin-related
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user data
      axios.get('http://localhost:5000/api/auth/profile')
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    toast.success('Logged in successfully!');
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully!');
  };

  const register = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    toast.success('Account created successfully!');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      <div className="app-container">
        {!isAdminPath && <Navbar />}
        <main className="app-main">
          <Routes>
            {/* Home page - accessible without authentication */}
            <Route path="/" element={<Home />} />

            {/* All other routes require authentication */}
            <Route path="/predictions" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />

            {/* Top Picks */}
            <Route path="/predictions/top-picks" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/top-picks/win" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/top-picks/over15" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/top-picks/over25" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/top-picks/over35" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/top-picks/players" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />

            {/* VIP */}
            <Route path="/predictions/vip" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />

            {/* Today's Predictions */}
            <Route path="/predictions/today/win" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/today/over15" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/today/over25" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/today/over35" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/today/players" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />

            {/* All Predictions */}
            <Route path="/predictions/win" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/over15" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/over25" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/over35" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/predictions/players" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />

            {/* Profile - requires authentication */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={!user ? <AdminLogin /> : (user.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/" />)}
            />
            <Route
              path="/admin/dashboard"
              element={user?.role === 'admin' ? <Admin /> : <Navigate to="/admin" />}
            />

            {/* Auth routes - accessible without authentication */}
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" />}
            />

            {/* VIP and Outcomes - require authentication */}
            <Route path="/vip" element={
              <ProtectedRoute>
                <VIP />
              </ProtectedRoute>
            } />
            <Route path="/outcomes" element={
              <ProtectedRoute>
                <Outcomes />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
          }}
        />
      </div>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
