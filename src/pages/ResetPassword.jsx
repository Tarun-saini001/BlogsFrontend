import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const API = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        let error = "";

        if (!value.trim()) {
            error = `${name === "newPassword" ? "New" : "Confirm"} password is required`;
        } else if (name === "newPassword") {
            if (value.length < 6)
                error = "Password must be at least 6 characters long";
            else if (!/[A-Za-z]/.test(value))
                error = "Password must contain at least one alphabet";
            else if (!/[0-9]/.test(value))
                error = "Password must contain at least one number";
            else if (!/[!@#$%^&*]/.test(value))
                error = "Password must contain at least one special character";
        } else if (name === "confirmPassword") {
            if (value !== formData.newPassword)
                error = "Passwords do not match";
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const handleSubmit = async () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);

            const resetToken = localStorage.getItem("resetToken");

            if (!resetToken) {
                toast.error("autherizstion error");
                navigate("/forgot-password");
                return;
            }

            const response = await fetch(`${API}/onBoarding/user/changePassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${resetToken}`
                },
                body: JSON.stringify({
                    newPassword: formData.newPassword,
                    isResetPassword: "true"
                })
            });

            const data = await response.json();
            console.log('data:(reset data)', data);

            if (response.ok) {
                toast.success("Password reset successfully");

                const authToken = localStorage.getItem("token"); // normal login token

                localStorage.removeItem("resetToken");

                if (authToken) {
                    navigate("/"); // already logged in - navigate home
                } else {
                    navigate("/login"); // not logged in - navigate login
                }
            } else {
                toast.error(data.message || "Reset failed");
            }

        } catch (error) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">

                <p className="text-4xl">Reset Password</p>

                {["newPassword", "confirmPassword"].map(field => (
                    <div key={field} className="w-[80%] flex flex-col space-y-1">
                        <label>
                            {field === "newPassword" ? "New Password" : "Confirm Password"}
                        </label>
                        <input
                            type="password"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className={`px-3 py-2 border rounded ${errors[field] ? "border-red-500" : "border-gray-500"
                                }`}
                        />
                        {errors[field] && (
                            <span className="text-red-500 text-xs">
                                {errors[field]}
                            </span>
                        )}
                    </div>
                ))}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-black text-white px-4 w-[40%] py-2 rounded"
                >
                    {loading ? "Resetting..." : "Reset"}
                </button>

            </div>
        </div>
    );
};

export default ResetPassword;