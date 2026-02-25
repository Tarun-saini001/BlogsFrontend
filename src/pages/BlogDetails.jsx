import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const BlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const API = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API}/blogs/user/getBlog/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) setBlog(data.data[0]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {


        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API}/blogs/user/deleteBlog/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Blog deleted successfully");
                navigate("/myBlogs");
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error. Please try again.");
        } finally {
            setShowModal(false);
        }
    };

    if (!blog) return <p className="text-center mt-10">Loading...</p>;

    const isAuthor = user?._id === blog.author?._id;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 relative">

            {/* cover image */}
            {blog.img && (
                <img
                    src={`${API}${blog.img}`}
                    alt={blog.title}
                    className="w-full h-96 object-cover rounded-xl mb-6"
                />
            )}

            {/* author info */}
            <div className="flex items-center space-x-3 mb-6">
                <img
                    src={blog.author?.profilePic ? `${API}${blog.author.profilePic}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="author"
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex justify-between items-center w-full">
                    <p className="font-semibold text-lg">{blog.author?.name || "Unknown User"}</p>
                    <p className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* title */}
            <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

            {/* Content */}
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{blog.content}</p>

            {/* edit and dlete buttons */}
            {isAuthor && (
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={() => navigate(`/edit-blog/${blog._id}`)}
                        className="bg-green-500 text-white px-4 cursor-pointer py-2 rounded-md hover:bg-green-600 transition"
                    >
                        Edit
                    </button>
                    <button
                        onClick={ () => setShowModal(true)}
                        className="bg-red-500 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                        Delete
                    </button>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Delete Blog?
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this blog? This action cannot be undone.
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-md border border-gray-300 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogDetails;