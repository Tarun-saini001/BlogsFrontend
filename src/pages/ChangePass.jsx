import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePass = () => {
    const API = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "currentPassword":
                if (!value.trim()) {
                    error = "Current password is required";
                }
                break;

            case "newPassword":
                if (!value.trim()) {
                    error = "New password is required";
                }
                else if (value.length < 6) {
                    error = "Password must be at least 6 characters long";
                }
                else if (!/[A-Za-z]/.test(value)) {
                    error = "Password must contain at least one alphabet";
                }
                else if (!/[0-9]/.test(value)) {
                    error = "Password must contain at least one number";
                }
                else if (!/[!@#$%^&*]/.test(value)) {
                    error = "Password must contain at least one special character";
                }
                else if (value === formData.currentPassword) {
                    error = "New password cannot be same as current password";
                }
                break;

            case "confirmPassword":
                if (!value.trim()) {
                    error = "Confirm password is required";
                }
                else if (value !== formData.newPassword) {
                    error = "Passwords do not match";
                }
                break;

            default:
                break;
        }

        return error;
    };

    const validate = () => {
        const newErrors = {};

        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
            }
        });

        return newErrors;
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.trimStart();

        setFormData((prev) => ({
            ...prev,
            [name]: cleanedValue
        }));
        

    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        const fieldError = validateField(name, value);

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError
        }));
    };




    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await fetch(`${API}/onBoarding/user/changePassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();
            console.log('data:(change pass) ', data);

            if (response.ok) {
                toast.success("Password changed successfully");
                navigate("/profile");
            } else {
                if (data.message.includes("Old password")) {
                    setErrors((prev) => ({
                        ...prev,
                        currentPassword: "Current password is incorrect"
                    }));
                } else {
                    toast.error(data.message || "Failed to change password");
                }
            }

        } catch (error) {
            setErrors({ general: "Something went wrong" });
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md text-black shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">

                <p className="text-4xl">Change Password</p>

                {/* Current Password */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>
                        Current Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="currentPassword"
                        onBlur={handleBlur}
                        placeholder="Enter current password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.currentPassword
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-500 focus:ring-blue-500"
                            }`}
                    />
                    {errors.currentPassword && (
                        <span className="text-red-500 text-xs">
                            {errors.currentPassword}
                        </span>
                    )}
                </div>

                {/* New Password */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>
                        New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        onBlur={handleBlur}
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.newPassword
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-500 focus:ring-blue-500"
                            }`}
                    />
                    {errors.newPassword && (
                        <span className="text-red-500 text-xs">
                            {errors.newPassword}
                        </span>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>
                        Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        onBlur={handleBlur}
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.confirmPassword
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-500 focus:ring-blue-500"
                            }`}
                    />
                    {errors.confirmPassword && (
                        <span className="text-red-500 text-xs">
                            {errors.confirmPassword}
                        </span>
                    )}
                </div>

                {errors.general && (
                    <span className="text-red-500 text-sm w-[80%] text-center">
                        {errors.general}
                    </span>
                )}

                <button
                    onClick={handleSubmit}
                    className="bg-black text-white px-4 w-[40%] py-2 rounded disabled:bg-gray-400"
                >
                    Change
                </button>

            </div>
        </div>
    );

};

export default ChangePass;
