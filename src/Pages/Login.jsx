import React, { useState } from 'react';
import '../App.css'
import { Link } from 'react-router';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();

    const newErrors = { username: '', password: '' };
    if (!username.trim()) newErrors.username = 'Please enter your username';
    if (!password.trim()) newErrors.password = 'Please enter your password';

    setErrors(newErrors);

    // If no errors, proceed
    if (!newErrors.username && !newErrors.password) {
      console.log('Logging in with:', { username, password });
      // You can redirect or show success state here
    }
  };

  return (
    // <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center px-4 py-10">
      <div className="bg-[#f0f0f0] w-full max-w-[1400px] rounded border-2 p-6 md:p-12 flex flex-col md:flex-row border-none mx-auto mt-5 gap-10">
        
        {/* Left Side */}
        <div className="md:w-1/2 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-[40px] sm:text-[50px] md:text-[65px] lg:text-[75px] font-extrabold text-black leading-tight">
            Welcome Back
          </h1>
          <h2
            className="text-[40px] sm:text-[50px] md:text-[65px] lg:text-[75px] font-extrabold text-transparent"
            style={{ WebkitTextStroke: '1px black' }}
          >
            User!!
          </h2>
          <p className="mt-6 sm:mt-10 text-[18px] sm:text-[20px] md:text-[24px] font-semibold text-black">
            Are You New Here?{' '}
            <a
              href="/register"
              className="text-red-500 hover:underline inline-flex items-center font-semibold"
            >
              Register Here <span className="ml-1">→</span>
            </a>
          </p>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 flex items-center justify-center">
          <form
            onSubmit={handleLogin}
            className="bg-black text-white px-6 py-8 sm:p-10 md:p-12 rounded-3xl w-full max-w-[600px] space-y-6 flex flex-col justify-center"
          >
            {/* Username */}
            <div>
              <label className="block text-[18px] sm:text-[20px] font-semibold mb-2">Username</label>
              <div className={`flex items-center bg-white rounded-md px-4 py-3 ${errors.username ? 'border-2 border-red-500' : ''}`}>
                <span className="text-black mr-2">👤</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Username"
                  className="w-full outline-none text-black text-base sm:text-lg bg-transparent"
                />
              </div>
              {errors.username && <p className="text-red-500 mt-1 text-sm">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[18px] sm:text-[20px] font-semibold mb-2">Password</label>
              <div className={`flex items-center bg-white rounded-md px-4 py-3 ${errors.password ? 'border-2 border-red-500' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full outline-none text-black text-base sm:text-lg bg-transparent"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-black ml-2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
              </div>
              {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password}</p>}
            </div>

            {/* Login Button */}
            <Link to='/home'>
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md text-base sm:text-lg font-bold"
              >
              Login
            </button>
                </Link>

            {/* OR separator */}
            <div className="flex items-center my-2">
              <hr className="flex-grow border-t border-gray-400" />
              <span className="mx-2 text-sm text-white">OR</span>
              <hr className="flex-grow border-t border-gray-400" />
            </div>

            {/* Social Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <button
                type="button"
                className="flex-1 flex items-center justify-center border border-white py-3 rounded-md bg-white"
                onClick={() => console.log('Google login clicked')}
              >
                <svg className="w-6 h-6" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.5 0 6.5 1.2 8.8 3.5l6.5-6.5C34.6 2.6 29.7 0 24 0 14.9 0 7.1 5.8 3.5 13.8l7.6 5.9C13.3 13.3 18.3 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.4c-.5 2.6-2 4.9-4.3 6.4v5.3h7c4.1-3.7 6.5-9.2 6.5-15z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M11.1 28.3c-1.2-2.3-1.9-4.9-1.9-7.6s.7-5.3 1.9-7.6l-7.6-5.9C1.2 11.8 0 17.7 0 24s1.2 12.2 3.5 17.1l7.6-5.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c5.7 0 10.6-1.9 14.1-5.1l-7-5.3c-2 1.4-4.5 2.2-7.1 2.2-5.7 0-10.6-3.8-12.3-9l-7.6 5.9C7.1 42.2 14.9 48 24 48z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                className="flex-1 flex items-center justify-center border border-white py-3 rounded-md text-xl bg-white text-black font-bold"
              >
                
              </button>
            </div>
          </form>
        </div>
      </div>
    // </div>
  );
};

export default Login;