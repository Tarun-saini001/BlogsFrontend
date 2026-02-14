import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    
        const navigate = useNavigate();
 
    return (
        <div className='bg-black h-[8%]  text-white flex justify-between'>
            <p className='text-sm pl-10 flex justify-center items-center'>INTERESTING<br />BLOGS</p>
            <nav className='text-white flex justify-between items-center pr-10 space-x-30 w-[60%]'>
                <ul className='flex space-x-10'>
                    <li onClick={()=>navigate("/")}>Home</li>
                    <li onClick={()=>navigate("/about")}>About</li>
                    <li onClick={()=>navigate("/allBlogs")}>All Blogs</li>
                    <li onClick={()=>navigate("/myBlogs")}>Your Blogs</li>
                </ul>
                <span className='space-x-4 '>
                    <button onClick={()=>navigate("/signup")}
                     className='bg-white text-black w-20 rounded-md'>Signup</button>
                    <button onClick={()=>navigate("/login")}
                     className='bg-white text-black w-20 rounded-md'>Login</button>
                </span>
            </nav>
        </div>
    )
}

export default Navbar
