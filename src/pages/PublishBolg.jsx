import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const PublishBlog = () => {
    const API = import.meta.env.VITE_API_URL;
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const MAX_TITLE_LENGTH = 150;
    const MIN_TITLE_LENGTH = 5;
    const MAX_CONTENT_LENGTH = 5000;
    const MIN_CONTENT_LENGTH = 20;

    // Image validation handler
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setImage(null);
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, or WEBP images are allowed!");
            e.target.value = ""; // reset input
            setImage(null);
            return;
        }

        setImage(file);
    };

    const handlePublish = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        // Validate title & content length
        if (title.trim().length < MIN_TITLE_LENGTH) {
            toast.error(`Title must be at least ${MIN_TITLE_LENGTH} characters`);
            return;
        }

        if (title.trim().length > MAX_TITLE_LENGTH) {
            toast.error(`Title cannot exceed ${MAX_TITLE_LENGTH} characters`);
            return;
        }

        if (content.trim().length < MIN_CONTENT_LENGTH) {
            toast.error(`Content must be at least ${MIN_CONTENT_LENGTH} characters`);
            return;
        }

        if (content.trim().length > MAX_CONTENT_LENGTH) {
            toast.error(`Content cannot exceed ${MAX_CONTENT_LENGTH} characters`);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("content", content.trim());

            if (image) formData.append("img", image);

            const response = await fetch(`${API}/blogs/user/addBlog`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Blog Published Successfully");

                // Clear form
                setTitle("");
                setContent("");
                setImage(null);

                navigate("/");
            } else {
                toast.error(data.message || "Failed to publish blog");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error. Please try again later.");
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
                        onChange={handleImageChange}
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

                {/* Title */}
                <div className="space-y-2">
                    <label className="font-semibold text-lg">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border rounded-md"
                        placeholder="Enter blog title"
                        required
                    />
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <label className="font-semibold text-lg">Content</label>
                    <textarea
                        rows="10"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-3 border rounded-md"
                        placeholder="Write your blog content here..."
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