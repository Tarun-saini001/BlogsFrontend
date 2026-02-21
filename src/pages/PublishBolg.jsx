import React, { useState, useContext } from "react";
import {useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const PublishBlog = () => {
    const API = import.meta.env.VITE_API_URL;
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handlePublish = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            console.log("TOKEN FROM STORAGE:", token);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);

            if (image) {
                formData.append("img", image);
            }
            console.log('API: ', API);

            const response = await fetch(
                `${API}/blogs/user/addBlog`, // adjust if needed
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();
            console.log("API response:", data);

            if (response.ok) {
                // alert("Blog Published Successfully ");
                toast.success('Blog Published Successfully ');

                // Clear form
                setTitle("");
                setContent("");
                setImage(null);

                // Redirect to My Blogs
                navigate("/");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            console.log("catchhhhh");
            // alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
            <form
                onSubmit={handlePublish}
                className="bg-white w-full max-w-4xl p-8 rounded-xl shadow-md space-y-6"
            >
                <h1 className="text-3xl font-bold text-center">Publish Blog</h1>

                {/* Image Upload */}
                <div className="space-y-3">
                    <label className="font-semibold text-lg">Choose Cover Image</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="border p-2 rounded-md w-full"
                    />

                    {image && (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="preview"
                            className="w-40 h-40 object-cover rounded-md"
                        />
                    )}
                </div>

                {/* title */}
                <div className="space-y-2">
                    <label className="font-semibold text-lg">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border rounded-md"
                        required
                    />
                </div>

                {/* content */}
                <div className="space-y-2">
                    <label className="font-semibold text-lg">Content</label>
                    <textarea
                        rows="10"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-3 border rounded-md"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-md"
                >
                    {loading ? "Publishing..." : "Publish"}
                </button>
            </form>
        </div>
    );
};

export default PublishBlog;
