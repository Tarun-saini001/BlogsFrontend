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
      <div className='  h-[70%] w-full  bg-[url(./img/home.jpg)] bg-cover flex justify-center space-y-6 flex-col'>
        <p className='text-amber-500 text-3xl font-bold ml-[25%]'>Welcome<br /> Wild life Blogs</p>
        {isLoggedIn && <WriteBlog />}
      </div>
      {/* Latest Blogs Section */}
     { isLoggedIn&& (<div className="max-w-6xl mx-auto py-10 px-4">
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
      </div> )}
    </div>
  )
}

export default Home
