import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const validateField = (name, value, updatedForm = formData) => {
        let error = "";

        switch (name) {
            case "currentPassword":
                if (!value.trim()) {
                    error = "Current password is required";
                }
                break;

            case "newPassword":
                if (!value.trim()) {
                    error = "Password is required";
                } else if (value.length < 6) {
                    error = "Password must be at least 6 characters"
                } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/.test(value)) {
                    error = "Password must contain at least one uppercase letter,one lowercase letter, one number, and one special character";
                }
                break;

            case "confirmPassword":
                if (!value.trim()) {
                    error = "Confirm password is required";
                }
                else if (!updatedForm.newPassword) {
                    error = "Please enter new password first";
                }
                else if (value !== updatedForm.newPassword) {
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

        const updatedForm = {
            ...formData,
            [name]: cleanedValue
        };

        setFormData(updatedForm);

        // Revalidate current field
        const fieldError = validateField(name, cleanedValue, updatedForm);

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
            confirmPassword:
                name === "newPassword"
                    ? validateField("confirmPassword", updatedForm.confirmPassword, updatedForm)
                    : prev.confirmPassword
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
            } if (!response.ok) {
                if (data?.message?.toLowerCase().includes("old password")) {
                    setErrors((prev) => ({
                        ...prev,
                        currentPassword: "Current password is incorrect"
                    }));
                } else {
                    toast.error(data?.message || "Failed to change password");
                }
                return;
            }

        } catch (error) {
            toast.error("Server error. Please try again.");
        }
        finally {
            setLoading(false);
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
                {/* Password */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label> New Password <span className="text-red-500">*</span></label>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`bg-white px-3 py-2 pr-10 border rounded w-full focus:outline-none focus:ring-2 ${errors.password
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-500 focus:ring-blue-500"
                                }`}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    {errors.password && (
                        <span className="text-red-500 text-xs">{errors.password}</span>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Confirm Password <span className="text-red-500">*</span></label>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`bg-white px-3 py-2 pr-10 border rounded w-full focus:outline-none focus:ring-2 ${errors.confirmPassword
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-500 focus:ring-blue-500"
                                }`}
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                        >
                            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    {errors.confirmPassword && (
                        <span className="text-red-500 text-xs">{errors.confirmPassword}</span>
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
                <p
                    onClick={() => navigate("/forgot-password")}
                    className="text-blue-600 font-medium cursor-pointer text-sm"
                >
                    Forgot Password?
                </p>
            </div>
        </div>
    );

};

export default ChangePass;
