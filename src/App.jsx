import { useState } from 'react'
import './App.css'
import Navbar from './components/navbar'
import { Routes, Route } from 'react-router-dom'
import AllBlogs from './pages/AllBlogs'
import Home from './pages/home'
import MyBlogs from './pages/MyBlogs'
import Signup from './pages/Signup'
import Login from './pages/Loginn'
import PublishBlog from './pages/PublishBolg'
import BlogDetails from './pages/BlogDetails'
import VerifyOtp from './pages/VerifyOtp'
import Profile from './pages/Profile'



function App() {

  return (
    <div className='h-[100vh] m-1'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/allBlogs' element={<AllBlogs />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path='/myBlogs' element={<MyBlogs />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/addBlog' element={<PublishBlog />} />
        <Route path="/edit-blog/:id" element={<PublishBlog />} />
        <Route path='/verify-otp' element={<VerifyOtp />} />
        <Route path='/profile' element={<Profile />} />

      </Routes>
    </div>
  )
}

export default App
