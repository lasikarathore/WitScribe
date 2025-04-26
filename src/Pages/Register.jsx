import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
  const navigate = useNavigate();
  
  // State for form toggle
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    password: '',
    email: '',
    phone: ''
  });

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const errors = {
      username: '',
      password: '',
      email: '',
      phone: ''
    };

    if (!username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6 && !isLogin) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!isLogin) {
      if (!email) {
        errors.email = 'Email is required';
        isValid = false;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.email = 'Please enter a valid email address';
          isValid = false;
        }
      }

      if (!phone) {
        errors.phone = 'Phone number is required';
        isValid = false;
      } else {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
          errors.phone = 'Enter a valid 10-digit phone number';
          isValid = false;
        }
      }
    }

    setFieldErrors(errors);
    return isValid;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login logic
        console.log('Logging in with:', { username, password });
        // Here you would normally make an API call
        // For demo, just redirect
        navigate('/home');
      } else {
        // Registration logic
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: username,
            email,
            phone,
            password
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        if (data.success) {
          sessionStorage.setItem('registrationEmail', email);
          sessionStorage.setItem('registrationPhone', phone);
          sessionStorage.setItem('userId', data.data.id);
          alert('Registration successful! Please verify your phone number.');
          navigate('/home');
        } else {
          setError('Registration failed');
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Banner */}
        <div className="md:w-1/2 bg-black p-8 flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Join Us'}
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-transparent mb-6" 
              id="strokeText" 
              style={{ WebkitTextStroke: '1px white' }}>
            {isLogin ? 'User!' : 'Today!'}
          </h2>
          <p className="text-lg mb-8">
            {isLogin 
              ? "Don't have an account?" 
              : "Already have an account?"}
            <span 
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-500 ml-2 cursor-pointer hover:underline font-semibold">
              {isLogin ? 'Register Here →' : 'Login Here →'}
            </span>
          </p>
          <div className="hidden md:block">
            <img 
              src={isLogin ? '/assets/login.svg' : '/assets/register.webp'} 
              alt="Authentication illustration" 
              className="max-w-xs mx-auto opacity-70" 
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Login' : 'Create Account'}
            </h2>
            <div className="flex">
              <button
                className={`px-4 py-2 mr-2 rounded-full ${isLogin ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`px-4 py-2 rounded-full ${!isLogin ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
                Username
              </label>
              <div className={`flex items-center border rounded-md px-3 py-2 ${fieldErrors.username ? 'border-red-500' : 'border-gray-300'}`}>
                <span className="text-gray-500 mr-2">👤</span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full outline-none"
                />
              </div>
              {fieldErrors.username && <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <div className={`flex items-center border rounded-md px-3 py-2 ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 ml-2 cursor-pointer"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
              {fieldErrors.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>}
            </div>

            {/* Registration-only fields */}
            {!isLogin && (
              <>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <div className={`flex items-center border rounded-md px-3 py-2 ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}>
                    <span className="text-gray-500 mr-2">📧</span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full outline-none"
                    />
                  </div>
                  {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
                    Phone Number <span className="text-sm text-gray-500">(10 digits)</span>
                  </label>
                  <div className={`flex items-center border rounded-md px-3 py-2 ${fieldErrors.phone ? 'border-red-500' : 'border-gray-300'}`}>
                    <span className="text-gray-500 mr-2">📱</span>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full outline-none"
                    />
                  </div>
                  {fieldErrors.phone && <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-bold transition-colors duration-200 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </button>

            {/* Forgot Password - only for login */}
            {isLogin && (
              <div className="text-center mt-4">
                <a href="#" className="text-sm text-red-500 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Authentication;