import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const OtpVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);

  // References for OTP inputs to allow auto-focus
  const inputRefs = React.useMemo(() => [
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef()
  ], []);

  useEffect(() => {
    // Get email and userId from session storage
    const storedEmail = sessionStorage.getItem('registrationEmail');
    const storedUserId = sessionStorage.getItem('userId');
    
    if (!storedEmail || !storedUserId) {
      navigate('/register');
      return;
    }
    
    setEmail(storedEmail);
    setUserId(storedUserId);
    
    // Focus on first input when component mounts
    inputRefs[0].current.focus();
    
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, [navigate, inputRefs]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus to next input if current input is filled
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index, e) => {
    // If backspace is pressed and current input is empty, focus on previous input
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle paste functionality
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newOtp = [...otp];
      
      digits.forEach((digit, index) => {
        if (index < 4) {
          newOtp[index] = digit;
        }
      });
      
      setOtp(newOtp);
      // Focus on the last input
      inputRefs[3].current.focus();
    }
  };

  // Submit OTP for verification
  const verifyOtp = async () => {
    setError('');
    setLoading(true);
    
    // Check if OTP is complete
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      setError('Please enter the complete 4-digit OTP');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          otp: otpValue
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }
      
      if (data.success) {
        // Clear session storage
        sessionStorage.removeItem('registrationEmail');
        sessionStorage.removeItem('userId');
        
        // Show success message
        alert('Email verified successfully! You can now login.');
        
        // Redirect to login page
        navigate('/login');
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    setError('');
    setResendDisabled(true);
    
    try {
      const response = await fetch('http://localhost:5000/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          email
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }
      
      // Reset timer
      setTimeLeft(180);
      
      // Reset OTP fields
      setOtp(['', '', '', '']);
      inputRefs[0].current.focus();
      
      // Show success message
      alert('New OTP has been sent to your email.');
      
      // Disable resend button for 30 seconds
      setTimeout(() => {
        setResendDisabled(false);
      }, 30000);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setResendDisabled(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#efefef] px-4 py-10">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/register')}
          className="flex items-center text-black hover:text-red-500 font-semibold"
          aria-label="Go back to registration"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-1"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back
        </button>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Email Verification</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {error}
          </div>
        )}
        
        <p className="text-center mb-6">
          We've sent a 4-digit verification code to <strong>{email}</strong>
        </p>
        
        <div className="flex justify-center space-x-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : null}
              className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Time remaining: <span className="font-medium">{formatTime(timeLeft)}</span>
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={verifyOtp}
            disabled={loading || otp.some(digit => digit === '')}
            className="bg-[#E63946] text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
            aria-busy={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          <button
            onClick={resendOtp}
            disabled={timeLeft > 0 && timeLeft < 180 || resendDisabled}
            className="text-[#E63946] hover:text-red-700 transition-colors disabled:text-gray-400"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
