import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizData, topic } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(30);

  useEffect(() => {
    if (showResult) {
      const redirectInterval = setInterval(() => {
        setRedirectTimer((prev) => {
          if (prev === 1) {
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(redirectInterval);
    }
  }, [showResult, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          handleNext();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, showResult]);

  if (!quizData) {
    return <div className="text-center p-8">No quiz data found.</div>;
  }

  const current = quizData[currentQuestion];

  const handleOptionClick = (index) => {
    if (answered || showResult) return;
    setSelectedOption(index);
    setAnswered(true);

    const correctIndex = current.answer.charCodeAt(0) - 65;
    if (index === correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setAnswered(false);
      setTimer(30);
    } else {
      setShowResult(true);
    }
  };

  const getButtonStyle = (index) => {
    if (!answered) {
      return "bg-white border border-gray-300 text-gray-800 hover:bg-gray-100";
    }
    const correctIndex = current.answer.charCodeAt(0) - 65;
    if (index === correctIndex) return "bg-red-500 text-white";
    if (index === selectedOption) return "bg-black text-white";
    return "bg-white border border-gray-300 text-gray-800";
  };

  if (showResult) {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-3xl flex flex-col space-y-10 text-center">
          <div className="text-4xl font-bold text-gray-800">Quiz Completed</div>
          <div className="text-2xl font-medium text-gray-600">
            Your Score: <span className="text-red-500">{score}</span> / {quizData.length}
          </div>
          <div className="text-gray-500 text-sm">
            Redirecting to home in {redirectTimer} seconds...
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-8 px-8 py-4 bg-gray-800 text-white rounded-full text-lg font-bold hover:bg-black transition-all duration-300"
          >
            Go Home Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className=" my-30 w-full flex flex-col justify-center items-center p-8">
      <div className="w-full max-w-5xl flex flex-col space-y-12">

        {/* Top bar */}
        <div className="flex justify-between items-center">
          <div className="text-gray-400 text-sm font-medium">
            Question {currentQuestion + 1} / {quizData.length}
          </div>
          <div className="text-gray-400 text-sm font-medium">
            00:{timer < 10 ? `0${timer}` : timer}
          </div>
        </div>

        {/* Question */}
        <div className="text-2xl font-semibold text-gray-800 leading-relaxed">
          {current.question}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-8">
          {current.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`w-full py-6 rounded-lg text-lg font-semibold transition-all duration-300 ${getButtonStyle(index)}`}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>

        {/* Next Button */}
        {answered && (
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className="mt-8 px-10 py-4 bg-gray-800 text-white rounded-full text-lg font-bold tracking-wide hover:bg-black transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
    </>

  );
}
