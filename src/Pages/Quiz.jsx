import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import Navbar from '../Components/Navbar';

// Sample quiz data - in a real app, you'd fetch this from an API
const quizQuestions = [
  {
    id: 832163,
    question: "What are web sockets? And how do we use them?",
    options: [
      { id: "A", content: "A protocol that provides full-duplex communication" },
      { id: "B", content: "A type of HTTP request" },
      { id: "C", content: "A server-side technology only" },
      { id: "D", content: "A deprecated web standard" }
    ],
    correctAnswer: "A"
  },
  {
    id: 832164,
    question: "Which of the following is NOT a JavaScript framework?",
    options: [
      { id: "A", content: "React" },
      { id: "B", content: "Angular" },
      { id: "C", content: "Python" },
      { id: "D", content: "Vue" }
    ],
    correctAnswer: "C"
  },
  {
    id: 832165,
    question: "What does CSS stand for?",
    options: [
      { id: "A", content: "Computer Style Sheets" },
      { id: "B", content: "Cascading Style Sheets" },
      { id: "C", content: "Creative Style System" },
      { id: "D", content: "Colorful Style Sheets" }
    ],
    correctAnswer: "B"
  }
];

function App() {
  return (
    <>
    <Navbar/>
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Quiz />
      </div>
      <Footer />
    </div>
    </>
  );
}

function Header() {
  return (
    <header className="bg-gray-200 py-4 px-4 md:px-8 rounded-md mx-4 my-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-black">WitScribe</div>
      <nav className="flex items-center space-x-4">
        <a href="#" className="text-red-500 hover:text-red-700">Home</a>
        <a href="#" className="text-black hover:text-gray-700">Quiz</a>
        <a href="#" className="text-black hover:text-gray-700">Community</a>
        <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center ml-2">
          <span className="text-lg">🧠</span>
        </div>
      </nav>
    </header>
  );
}

function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      handleNextQuestion();
    }
    return () => clearInterval(interval);
  }, [timer, isTimerRunning]);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    setIsTimerRunning(false);
    
    if (optionId === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimer(30);
      setIsTimerRunning(true);
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setTimer(30);
    setIsTimerRunning(true);
    setScore(0);
    setShowResults(false);
    setCurrentSlide(1);
  };

  return (
    <div className="max-w-5xl mx-auto mt-30 my-8 p-4 bg-gray-200 rounded-lg">
      {showResults ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
          <p className="text-xl mb-4">You scored {score} out of {quizQuestions.length}</p>
          <button 
            onClick={resetQuiz}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="text-right mb-2">
            <div className="inline-flex items-center">
              <Clock size={16} className="mr-1" />
              <span className="font-mono">{String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-md flex items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
                <div className="flex space-x-2 mt-6">
                  {/* {[1, 2, 3].map((dot, index) => (
                    <div 
                      key={index} 
                      className={h-2 w-2 rounded-full ${index === currentQuestionIndex % 3 ? 'bg-black' : 'bg-gray-300'}}
                    />
                  ))} */}
                </div>
                <div className="text-right mt-4">
                  <span className="font-bold text-xl">{currentSlide}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => {
  let optionClass = '';

  if (selectedOption === option.id) {
    if (option.id === currentQuestion.correctAnswer) {
      optionClass = 'bg-red-500 text-white'; // Correct answer
    } else {
      optionClass = 'bg-black-500 text-white'; // Wrong selection
    }
  }

  return (
    <button
      key={option.id}
      className={`rounded-md p-6 flex items-center justify-center border-2 ${optionClass} ${
        selectedOption ? 'cursor-not-allowed' : 'hover:bg-black hover:text-white'
      }`}
      onClick={() => !selectedOption && handleOptionSelect(option.id)}
      disabled={selectedOption !== null}
    >
      <span className="text-2xl font-bold">{option.id}</span>
    </button>
  );
})}

            </div>
          </div>
          <div className="text-right mt-4">
            <span className="text-xs text-gray-500">ID: {currentQuestion.id}</span>
          </div>
          {selectedOption && (
            <div className="mt-4 text-center">
              <button
                onClick={handleNextQuestion}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
              >
                Next Question
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Footer() {
  return (
    <></>
  );
}

export default App;