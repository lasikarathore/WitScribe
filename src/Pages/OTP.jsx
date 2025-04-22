import { useState, useRef } from "react";
import { Link } from "react-router";

export default function OTPVerification() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    setError("OTP resent successfully.");
  };

  const handleSubmit = () => {
    if (otp.includes("")) {
      setError("Please enter all 6 digits of the OTP.");
    } else {
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-2xl shadow-2xl text-center py-16 px-12 relative">
        <div className="absolute top-0 left-0 w-full h-48 bg-red-500 clip-path-triangle"></div>
        <div className="relative z-10">
          <div className="w-44 h-44 mx-auto mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/5957/5957507.png"
              alt="Verify Illustration"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold mb-3">Please Verify Your Account</h1>
          <p className="text-lg text-gray-500 mb-8">
            Enter the six digit code we sent to your email address to verify your
            new WitScribe account.
          </p>

          <div className="flex justify-center gap-4 mb-5">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-16 h-16 text-center text-2xl border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-base mb-4">{error}</p>}

          <button
            onClick={handleSubmit}
            className="bg-red-500 hover:bg-red-600 text-white text-lg px-10 py-3 rounded-md"
          >
           <Link to='/home'>Verify & Continue</Link>
          </button>

          <p className="text-base text-gray-600 mt-6">
            Didn't Receive it?{' '}
            <button onClick={handleResend} className="text-black font-semibold underline">
              Resend OTP
            </button>
          </p>
        </div>
      </div>

      <style>{`
        .clip-path-triangle {
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
      `}</style>
    </div>
  );
}