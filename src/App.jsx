import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/navbar'
import { Routes, Route } from 'react-router-dom'
import AllBlogs from './pages/AllBlogs'
import Home from './pages/home'
import About from './pages/about'
import MyBlogs from './pages/MyBlogs'
import Signup from './pages/Signup'
import Login from './pages/login'
import VerifyOtp from './pages/VerifyOtp'


function App() {
  const [email, setEmail] = useState("")
  const [password , setPassword] = useState("")

  return (
    <div className='h-[100vh] m-1'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/allBlogs' element={<AllBlogs />}/>
        <Route path='/myBlogs' element={<MyBlogs />}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/verifyOtp' element={<VerifyOtp/>}/>
      </Routes>
    </div>
  )
}

export default App
