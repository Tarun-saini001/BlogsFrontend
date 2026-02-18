import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import WriteBlog from "../components/WriteBlog";

const Profile = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const [userBlogs, setUserBlogs] = useState([]);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        fetchMyBlogs();
        fetchProfile();
    }, []);


    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API}/onBoarding/user/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (response.ok) {
                setProfileImage(data.data.profilePic);
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
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-6">

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

                    <label className="text-blue-600 cursor-pointer text-sm">
                        Change Profile Picture
                        <input
                            type="file"
                            hidden
                            onChange={handleImageUpload}
                        />
                    </label>

                    <button
                        onClick={() => navigate("/change-password")}
                        className="bg-black text-white px-4 py-2 rounded-md"
                    >
                        Change Password
                    </button>

                    <button
                        onClick={() => {
                            logout();
                            navigate("/");
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
                        <div className="grid md:grid-cols-2 gap-6">
                            {userBlogs.map((blog) => (
                                <div
                                    key={blog._id}
                                    className="border rounded-md p-4"
                                >
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
