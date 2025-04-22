import React from 'react'
import '../App.css'
import UserImage from '../assets/user.png'
import PadlockIcon from '../assets/padlock.png'
import RegisterImage from '../assets/register.webp'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'; // Add this at the top



const Register = () => {

  const navigate = useNavigate();

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



      <section className='register bg-[#efefef] flex flex-col lg:flex-row justify-center items-center min-h-screen lg:gap-30 gap-10 px-4 py-10'>
        <form className='flex flex-col w-full max-w-md'>
          <label htmlFor="username" className='mt-4'>
            Username <span id='strokeText'><img src={UserImage} alt="" className='formIcons inline-block w-4 h-4 ml-1' /></span>
          </label>
          <input type="text" id='username' className='mt-2 p-2 rounded-md bg-black text-white px-3' />

          <label htmlFor="password" className='mt-4'>
            Password <span><img src={PadlockIcon} alt="" className='formIcons inline-block w-4 h-4 ml-1' /></span>
          </label>
          <input type="password" id='password' className='mt-2 p-2 rounded-md bg-black text-white px-3' />

          <label htmlFor="email" className='mt-4'>
            Email @
          </label>
          <input type="text" id='email' className='mt-2 p-2 rounded-md bg-black text-white px-3' />

          <p className='mt-4'>
            Already Registered?{' '}
            <Link to="/login" className='text-[#E63946]'>
              Login Here &rarr;
            </Link>
          </p>

          <button className='bg-[#E63946] rounded-md px-6 p-2 mt-4 text-white self-center'>
            <Link to="/otp">Register</Link>
          </button>
        </form>

        <div className="registerNow flex flex-col items-center lg:items-start">
          <h1 className='text-5xl md:text-7xl text-black font-semibold text-center lg:text-left'>
            Register <span id='strokeText' className='stroke-black text-transparent'>Now</span>
          </h1>
          <img src={RegisterImage} alt="" className='mt-6 max-w-xs md:max-w-md h-auto' />
        </div>
      </section>
    </>
  )
}

export default Register
