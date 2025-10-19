import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.login(email, password);
      if (response.success) {
        localStorage.setItem('authToken', response.token);
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 flex flex-col items-center justify-center p-6">
      {/* Combined Logo and Login Card */}
      <div className="bg-white rounded-3xl w-full max-w-md px-8 py-10 shadow-2xl">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/logo.png" 
            alt="Public Eye JM" 
            className="h-20 w-auto mb-3"
          />
          <img 
            src="/name.png" 
            alt="Public Eye JM" 
            className="h-8 w-auto"
          />
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Log In</h1>
            <p className="text-gray-700 text-lg">
              Let's Build the <span className="text-yellow-400 font-semibold">Future</span> Together
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                placeholder="Please enter your email address"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                placeholder="Please enter your password"
                disabled={loading}
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button className="text-gray-900 font-semibold text-sm hover:text-gray-700">
                Forgot Password
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-gray-900 font-bold text-lg py-4 rounded-full transition-all shadow-md hover:shadow-lg mt-6"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          {/* Sign Up Link */}
          <div className="text-center text-gray-700 mt-6">
            Don't have an account?{' '}
            <button className="text-gray-900 font-semibold hover:text-gray-700">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;