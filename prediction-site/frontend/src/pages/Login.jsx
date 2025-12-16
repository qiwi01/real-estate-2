import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import '../css/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-text">OE</span>
          </div>
          <h2 className="login-title">
            Welcome Back
          </h2>
          <p className="login-subtitle">
            Sign in to your OddsEdge account to access premium predictions
          </p>
          <p className="login-signup-prompt">
            Don't have an account?{' '}
            <Link to="/register" className="login-link">
              Create one here
            </Link>
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="email" className="login-form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="login-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="login-form-label">
              Password
            </label>
            <div className="login-password-input">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="login-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="login-password-icon" />
                ) : (
                  <Eye className="login-password-icon" />
                )}
              </button>
            </div>
          </div>

          <div className="login-form-actions">
            <button
              type="submit"
              disabled={loading}
              className="login-submit-btn"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="login-links">
            Don't have an account?{' '}
            <Link to="/register" className="login-link">
              Sign up here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
