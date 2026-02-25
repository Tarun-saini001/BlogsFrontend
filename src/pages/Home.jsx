import React, { useContext, useEffect, useState } from 'react'
import WriteBlog from '../components/WriteBlog'
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isLoggedIn) {
      fetchBlogs();
    } else {
      setBlogs([]);
    }
  }, [isLoggedIn]);


  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/blogs/user/getBlogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('data getblogs: ', data);

      if (response.ok) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className=' h-screen '>
      <div className='  h-full w-full  bg-[url(./img/homepage.png)] bg-cover flex justify-center space-y-6 flex-col'>
        {/* <p className='text-white font-bold w-80 text-center text-3xl mt-[42%] p-1 rounded-2xl bg-black ml-[10%]'>Share you experience</p>
        {isLoggedIn && <WriteBlog />} */}
      </div>

      {!isLoggedIn && (
        <>
          {/* Introduction Section */}
          <div className="py-16 px-6 bg-white text-center">
            <h2 className="text-4xl font-bold mb-6">Welcome to BlogSphere</h2>
            <p className="max-w-3xl mx-auto text-gray-600 text-lg">
              BlogSphere is a platform where you can share your thoughts, experiences,
              and stories with the world. Whether you're a traveler, tech enthusiast,
              photographer, or writer — this is your space.
            </p>
          </div>

          {/* About Section */}
          <div className="py-16 px-6 bg-gray-100">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">Why Choose BlogSphere?</h3>
                <p className="text-gray-600 mb-4">
                  We provide a simple and powerful blogging experience with secure
                  authentication, image uploads, profile customization, and a clean UI.
                </p>
                <p className="text-gray-600">
                  Start writing in minutes and connect with readers around the world.
                </p>
              </div>
              <div className="bg-white shadow-lg rounded-xl p-6">
                <ul  className="space-y-3 pl-2 list-disc text-gray-700">
                  <li> Secure Authentication</li>
                  <li> Create & Edit Blogs</li>
                  <li> Upload Cover Images</li>
                  <li> Personalized Profile</li>
                  <li> Share experience</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call To Action */}
          <div className="py-16 text-center bg-black text-white">
            <h2 className="text-3xl font-bold mb-4">Start Sharing Your Story Today</h2>
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
            >
              Get Started
            </button>
          </div>
        </>
      )}

      {isLoggedIn && (
        <div className='flex mt-10 gap-10 justify-center items-center'>
          <p className='text-black font-bold w-80 text-center text-3xl  p-2 rounded-2xl bg-white shadow'>Share you experience</p>
          {isLoggedIn && <WriteBlog />}
        </div>
      )}

      {/* latest blogs list */}
      {isLoggedIn && (<div className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">Latest Blogs</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Image */}
              {blog.img && (
                <img
                  src={`${API}${blog.img}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 space-y-3">
                {/* Author information */}
                <div className="flex items-center space-x-3 mb-6">
                  <img
                    src={blog.author?.profilePic ? `${API}${blog.author.profilePic}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="author"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className='flex justify-between w-full items-center'>
                    <p className="font-semibold text-lg">{blog.author?.name || "Unknown User"}</p>
                    <p className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold">{blog.title}</h3>

                {/* First 3-4 lines */}
                <p className="text-gray-600 line-clamp-3">
                  {blog.content}
                </p>

                <button
                  onClick={() => navigate(`/blog/${blog._id}`)}
                  className="text-blue-600 cursor-pointer font-semibold"
                >
                  {/* Read More → */}
                  ...Read More
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

            <div>
              <h3 className="text-xl font-bold text-white mb-3">BlogSphere</h3>
              <p className="text-sm">
                A modern blogging platform built with MERN stack.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li className="cursor-pointer hover:text-white">Home</li>
                <li className="cursor-pointer hover:text-white">About</li>
                <li className="cursor-pointer hover:text-white">Contact</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Contact</h4>
              <p className="text-sm">support@blogsphere.com</p>
              <p className="text-sm">© {new Date().getFullYear()} BlogSphere</p>
            </div>

          </div>
        </footer>
      </div>)}
    </div>
  )
}

export default Home
