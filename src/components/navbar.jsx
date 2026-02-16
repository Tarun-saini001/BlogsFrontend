import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {

    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className='bg-black h-[8%] text-white flex justify-between'>
            <p
                className='text-sm pl-10 flex justify-center items-center cursor-pointer'
                onClick={() => navigate("/")}
            >
                INTERESTING<br />BLOGS
            </p>

            <nav className='flex justify-between items-center pr-10 w-[60%]'>

                <ul className='flex space-x-10 items-center'>
                    <li onClick={() => navigate("/")}>Home</li>

                    {isLoggedIn && (
                        <>
                            <li onClick={() => navigate("/allBlogs")}>All Blogs</li>
                            <li onClick={() => navigate("/myBlogs")}>Your Blogs</li>
                        </>
                    )}
                </ul>

                <span className='flex items-center space-x-4'>
                    {isLoggedIn ? (
                        <>
                            <FaUserCircle
                                size={28}
                                onClick={() => navigate("/profile")}
                            />
                            <button
                                onClick={logout}
                                className='bg-white text-black px-3 rounded-md'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate("/signup")}
                                className='bg-white text-black w-20 rounded-md'
                            >
                                Signup
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className='bg-white text-black w-20 rounded-md'
                            >
                                Login
                            </button>
                        </>
                    )}
                </span>
            </nav>
        </div>
    )
}

export default Navbar
