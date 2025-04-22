
import './App.css'
import Register from './Pages/Register'
import Home from './Pages/Home'
import Contact from './Pages/Contact'
import Error from './Pages/Error'


import FAQ from './Pages/FAQ'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Quiz from './Pages/Quiz'
import Community from './Pages/Community'
import Notes from './Pages/Notes'
import OTP from './Pages/OTP'
import AboutUs from './Pages/AboutUs'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Landing from './Pages/Landing'

function App() {

  return (
    <>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/home" element={<Home />}/>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Error />}/>
          <Route path='/landing' element={<Landing/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/notes' element={<Notes/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/faq' element={<FAQ/>}/>
          <Route path='/about' element={<AboutUs/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/quiz' element={<Quiz/>}/>
          <Route path='/community' element={<Community/>}/>
          <Route path='/otp' element={<OTP />}/>

        </Routes>
      <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App 
