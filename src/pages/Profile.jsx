import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import WriteBlog from "../components/WriteBlog";
import { toast } from "react-toastify";

const Profile = () => {
    const { logout, updateProfilePic } = useContext(AuthContext);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const [userBlogs, setUserBlogs] = useState([]);
    const [profileImage, setProfileImage] = useState(null);

    const [userName, setUserName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);

    useEffect(() => {
        fetchMyBlogs();
        fetchProfile();
    }, []);

    const handleUpdateName = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API}/onBoarding/user/updateProfile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: userName }),
            });

            const data = await response.json();
            console.log('data: (upadte name) ', data);

            if (response.ok) {
                toast.success("Name updated successfully");
                setIsEditingName(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log('token: ', token);

            const response = await fetch(`${API}/onBoarding/user/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            console.log('data:(profile) ', data);
            if (response.ok) {
                setProfileImage(data.data.profilePic);
                setUserName(data.data.name);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMyBlogs = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API}/blogs/user/myBlogs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log('data:(myblogs) ', data);

            if (response.ok) {
                setUserBlogs(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // check file type
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed!");
            return;
        }
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            const response = await fetch(`${API}/onBoarding/user/uploadProfile`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();
            console.log('data: (profile pic) ', data);

            if (response.ok) {
                setProfileImage(data.data.profilePic);
                updateProfilePic(data.data.profilePic)
                toast.success("Profile pic updated successfully!")
            } else {
                toast.error(data.message || "Failed to upload image");
            }
        } catch (error) {
            console.error(err);
            toast.error("Something went wrong while uploading the image");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-6">

                {/* profile */}
                {/* profile */}
                <div className="flex flex-col items-center space-y-4">

                    <img
                        src={
                            profileImage
                                ? `${API}${profileImage}`
                                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="profile"
                        className="w-28 h-28 rounded-full object-cover"
                    />

                    {/* USER NAME */}
                    {isEditingName ? (
                        <div className="flex space-x-2">
                            <input
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="border px-2 py-1 rounded-md"
                            />
                            <button
                                onClick={handleUpdateName}
                                className="bg-black text-white px-3 rounded-md"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <h2
                            onClick={() => setIsEditingName(true)}
                            className="text-xl font-semibold cursor-pointer hover:text-blue-600"
                        >
                            {userName}
                        </h2>
                    )}

                    <label className="text-blue-600 cursor-pointer text-sm">
                        Change Profile Picture
                        <input
                            type="file"
                            hidden
                            onChange={handleImageUpload}
                        />
                    </label>

                    <button
                        onClick={() => {
                            const confirmLogout = window.confirm("Are you sure you want to logout?");
                            if (confirmLogout) {
                                logout();
                                navigate("/");
                            }
                        }}
                        className="text-red-500"
                    >
                        Logout
                    </button>
                </div>

                {/* blogs list */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Your Blogs</h2>

                    {userBlogs.length === 0 ? (
                        <p>No blogs yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-6">
                            {userBlogs.map((blog) => (
                                <div
                                    key={blog._id}
                                    className="border rounded-md p-4"
                                >
                                    {blog.img && (
                                        <img
                                            src={`${API}${blog.img}`}
                                            alt={blog.title}
                                            className="w-full h-48 object-cover rounded-md mb-3"
                                        />
                                    )}
                                    <h3 className="font-semibold">{blog.title}</h3>
                                    <p className="text-gray-600 line-clamp-2">
                                        {blog.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <div className="flex justify-center">
                    <WriteBlog />
                </div>

            </div>
        </div>
    );
};

export default Profile;
