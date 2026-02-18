import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import WriteBlog from '../components/WriteBlog'

const MyBlogs = () => {
  const { isLoggedIn } = useContext(AuthContext)
  const [blogs, setBlogs] = useState([])
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchMyBlogs()
  }, [])

  const fetchMyBlogs = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API}/blogs/user/myBlogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      console.log("My Blogs:", data)

      if (response.ok) {
        setBlogs(data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API}/blogs/user/deleteBlog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Delete response:", data);

      if (response.ok) {
        // Remove blog from UI instantly
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Title */}
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-8">My Blogs</h2>

        {blogs.length === 0 ? (
          <p className="text-gray-500">You haven't written any blogs yet.</p>
        ) : (
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

                  <p className="text-gray-600 line-clamp-3">
                    {blog.content}
                  </p>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => navigate(`/blog/${blog._id}`)}
                      className="text-blue-600 font-semibold"
                    >
                      ...Read More 
                    </button>

                    <button
                      onClick={() => navigate(`/edit-blog/:id`)}
                      className="text-green-300 w-10 rounded font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-300 rounded  font-semibold"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write Blog Button at Bottom */}
      {isLoggedIn && (
        <div className="flex justify-center py-10">
          <WriteBlog />
        </div>
      )}

    </div>
  )
}

export default MyBlogs
