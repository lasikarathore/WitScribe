import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar-container flex mt-8 relative">
      <div className="navbar flex flex-wrap gap-4 md:gap-44 m-auto bg-[#dcdcdc] justify-between md:justify-center rounded-2xl items-center mx-auto px-10 md:px-8 py-3 w-full max-w-2xl">
        <Link to="/landing">
          <div className="logo text-2xl font-bold">WitScribe</div>
        </Link>

        {/* Hamburger Menu Button (visible on mobile) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="flex items-center p-2 rounded hover:bg-gray-200 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links hidden md:flex items-center gap-4">
          <Link to="/" className="active" id="redLink">
            Home
          </Link>
          <Link to="/quiz" className="hover:text-red-500 px-3 py-2 rounded transition">Quiz</Link>
          <Link to="/community" className="hover:text-red-500 px-3 py-2 rounded transition">Community</Link>
          <Link to="/profile">
            <img
              loading="lazy"
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="profile-pic rounded-full"
            />
          </Link>
        </div>

        {/* Mobile Navigation (Dropdown) */}
        {isMenuOpen && (
          <div className="mobile-nav-links flex flex-col w-full md:hidden mt-4 gap-4 py-2">
            <Link to="/" className="active py-2" id="redLink">
              Home
            </Link>
            <Link to="/quiz" className="hover:text-red-500 px-3 py-2 rounded transition">Quiz</Link>
            <Link to="/community" className="hover:text-red-500 px-3 py-2 rounded transition">Community</Link>
            <Link to="/profile" className="py-2 flex items-center">
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="profile-pic rounded-full mr-2"
              />
              <span>Profile</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;