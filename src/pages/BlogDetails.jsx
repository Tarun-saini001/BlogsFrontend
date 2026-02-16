import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`${API}/blogs/getBlog/${id}`);
      const data = await response.json();
      console.log('data: -- ', data);

      if (data.statusCode === 200) {
        setBlog(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {blog.img && (
        <img
          src={`${API}${blog.img}`}
          alt={blog.title}
          className="w-full h-96 object-cover rounded-xl mb-6"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-700 whitespace-pre-line">{blog.content}</p>
    </div>
  );
};

export default BlogDetails;
