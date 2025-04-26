import React, { useState } from 'react'
import '../App.css'
import UserImage from '../assets/user.png'
import PadlockIcon from '../assets/padlock.png'
import RegisterImage from '../assets/register.webp'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    password: '',
    email: '',
    phone: ''
  })

  const validateForm = () => {
    let isValid = true
    const errors = {
      username: '',
      password: '',
      email: '',
      phone: ''
    }

    if (!username.trim()) {
      errors.username = 'Username is required'
      isValid = false
    }

    if (!password) {
      errors.password = 'Password is required'
      isValid = false
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    if (!email) {
      errors.email = 'Email is required'
      isValid = false
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }
    }

    if (!phone) {
      errors.phone = 'Phone number is required'
      isValid = false
    } else {
      const phoneRegex = /^[0-9]{10}$/ // adjust for country if needed
      if (!phoneRegex.test(phone)) {
        errors.phone = 'Enter a valid 10-digit phone number'
        isValid = false
      }
    }

    setFieldErrors(errors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
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
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      if (data.success) {
        sessionStorage.setItem('registrationEmail', email)
        sessionStorage.setItem('registrationPhone', phone)
        sessionStorage.setItem('userId', data.data.id)
        alert('Registration successful! Please verify your phone number.')
        navigate('/home')
      } else {
        setError('Registration failed')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-black hover:text-red-500 font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-1"
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

      <section className='register bg-[#efefef] flex flex-col lg:flex-row justify-center items-center min-h-screen lg:gap-10 gap-10 px-4 py-10'>
        <form onSubmit={handleSubmit} className='flex flex-col w-full max-w-md'>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username" className='mt-4 block'>
              Username <img src={UserImage} alt="" className='formIcons inline-block w-4 h-4 ml-1' />
            </label>
            <input
              type="text"
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='mt-2 p-2 rounded-md bg-black text-white px-3 w-full'
            />
            {fieldErrors.username && <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phone" className='mt-4 block'>
              Phone Number <span className="text-sm text-gray-500">(10 digits)</span>
            </label>
            <input
              type="tel"
              id='phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className='mt-2 p-2 rounded-md bg-black text-white px-3 w-full'
              placeholder="e.g. 9876543210"
            />
            {fieldErrors.phone && <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className='mt-4 block'>
              Password <img src={PadlockIcon} alt="" className='formIcons inline-block w-4 h-4 ml-1' />
            </label>
            <input
              type="password"
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-2 p-2 rounded-md bg-black text-white px-3 w-full'
            />
            {fieldErrors.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className='mt-4 block'>
              Email <span aria-hidden="true">@</span>
            </label>
            <input
              type="email"
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-2 p-2 rounded-md bg-black text-white px-3 w-full'
            />
            {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
          </div>

          <p className='mt-4'>
            Already Registered?{' '}
            <Link to="/login" className='text-[#E63946]'>
              Login Here &rarr;
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className='bg-[#E63946] rounded-md px-6 p-2 mt-4 text-white self-center disabled:bg-gray-400'
          >
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>

        <div className="registerNow flex flex-col items-center lg:items-start">
          <h1 className='text-5xl md:text-7xl text-black font-semibold text-center lg:text-left'>
            Register <span id='strokeText' className='stroke-black text-transparent'>Now</span>
          </h1>
          <img src={RegisterImage} alt="Registration illustration" className='mt-6 max-w-xs md:max-w-md h-auto' />
        </div>
      </section>
    </>
  )
}

export default Register
