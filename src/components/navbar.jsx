import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const API = import.meta.env.VITE_API_URL;

    const { isLoggedIn, logout, user } = useContext(AuthContext);
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
                    <li onClick={() => navigate("/")}
                        className="cursor-pointer">Home</li>

                    {isLoggedIn && (
                        <>
                            <li onClick={() => navigate("/allBlogs")}
                                className="cursor-pointer"
                            >All Blogs</li>
                            <li onClick={() => navigate("/myBlogs")}
                                className="cursor-pointer"
                            >Your Blogs</li>
                        </>
                    )}
                </ul>

                <span className='flex items-center space-x-4'>
                    {isLoggedIn ? (
                        user?.profilePic ? (
                            <img
                                src={`${API}${user.profilePic}`}
                                alt="profile"
                                className="w-8 h-8 rounded-full cursor-pointer"
                                onClick={() => navigate("/profile")}
                            />
                        ) : (
                            <FaUserCircle
                                className="w-8 h-8 cursor-pointer text-gray-600"
                                onClick={() => navigate("/profile")}
                            />
                        )) : (
                        <>
                            <button
                                onClick={() => navigate("/signup")}
                                className="bg-white text-black w-20 rounded-md"
                            >
                                Register
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-white text-black w-20 rounded-md"
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
