import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const fetchAllBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/blogs/user/getBlogs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      const data = await response.json();
      console.log('data:(get blogs) ', data);
      // console.log('blogs.author?.profilePic: ', blogs.author?.profilePic);
      // console.log('blogs.author?.name: ', blogs.author?.name);
      if (response.ok) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">All Blogs</h1>

        {blogs.length === 0 ? (
          <p>No blogs available.</p>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                {/* Cover Image */}
                {blog.img && (
                  <img
                    src={`${API}${blog.img}`}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4 space-y-3">
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        blog.author?.profilePic
                          ? `${API}${blog.author.profilePic}`
                          : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="author"
                      className="w-8 h-8 rounded-full object-cover"
                    />

                    <div className="flex justify-between items-center  w-full">
                      <p className="text-sm font-semibold">
                        {blog.author?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold">{blog.title}</h3>

                  {/* Content Preview */}
                  <p className="text-gray-600 line-clamp-3">
                    {blog.content}
                  </p>

                  <button
                    onClick={() => navigate(`/blog/${blog._id}`)}
                    className="text-blue-600 font-semibold"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;