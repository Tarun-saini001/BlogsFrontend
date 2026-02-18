import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const API = import.meta.env.VITE_API_URL;

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "name":
                if (!value.trim()) {
                    error = "Name is required";
                } else if (value.trim().length < 3) {
                    error = "Name must be at least 3 characters";
                }
                break;

            case "email":
                if (!value.trim()) {
                    error = "Email is required";
                } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(value)) {
                    error = "Invalid email format";
                }
                break;

            case "password":
                if (!value.trim()) {
                    error = "Password is required";
                } else if (value.length < 6) {
                    error = "Password must be at least 6 characters";
                }
                break;

            case "confirmPassword":
                if (!value.trim()) {
                    error = "Confirm password is required";
                } else if (value !== formData.password) {
                    error = "Passwords do not match";
                }
                break;

            default:
                break;
        }

        return error;
    };

    const validate = (data) => {
        const newErrors = {};

        Object.keys(data).forEach((key) => {
            const error = validateField(key, data[key]);
            if (error) {
                newErrors[key] = error;
            }
        });

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedForm = {
            ...formData,
            [name]: value
        };

        setFormData(updatedForm);

        const fieldError = validateField(name, value);

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError
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

    const handleRegister = async () => {
        const validationErrors = validate(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch(`${API}/onBoarding/user/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok && data.statusCode === 200) {
                navigate("/verify-otp", {
                    state: {
                        email: formData.email,
                        name: formData.name,
                        password: formData.password,
                        expiresAt: Date.now() + 1000 * 60 * 5
                    }
                });
            } else if (data.status === "validation" && data.message?.includes("already verified")) {
                alert("This email is already registered");
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md text-black shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">

                <p className="text-4xl">Register</p>

                {/* name */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        onBlur={handleBlur}
                        value={formData.name}
                        onChange={handleChange}
                        className="border px-3 py-2 rounded"
                    />
                    {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                </div>

                {/* email */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        onBlur={handleBlur}
                        value={formData.email}
                        onChange={handleChange}
                        className="border px-3 py-2 rounded"
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>

                {/* password */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Password <span className="text-red-500">*</span></label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        onBlur={handleBlur}
                        value={formData.password}
                        onChange={handleChange}
                        className="border px-3 py-2 rounded"
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                </div>

                {/* confirm password */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Confirm Password <span className="text-red-500">*</span></label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        onBlur={handleBlur}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="border px-3 py-2 rounded"
                    />
                    {errors.confirmPassword && (
                        <span className="text-red-500 text-xs">{errors.confirmPassword}</span>
                    )}
                </div>

                <button
                    onClick={handleRegister}
                    className="bg-black text-white px-4 w-[40%] py-2 rounded"
                >
                    Register
                </button>

                <div className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600">
                        Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Signup;
