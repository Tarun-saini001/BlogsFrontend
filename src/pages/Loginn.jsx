import React, { useContext, useState } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";

const Login = () => {
    const { login } = useContext(AuthContext);
    const API = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    // Single-field validation for onBlur
    const validateField = (name, value) => {
        let error = "";

        if (!value.trim()) {
            error = name === "email" ? "Email is required" : "Password is required";
        } else if (
            name === "email" &&
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/.test(value)
        ) {
            error = "Email must be like example@domain.com (letters only in domain)";
        }

        return error;
    };


    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const fieldError = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
    };

    const handleLogin = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch(`${API}/onBoarding/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();

            if (data.errors) {
                const formattedErrors = {};
                data.errors.forEach(err => {
                    formattedErrors[err.field] = err.message;
                });
                setErrors(formattedErrors);

            } else if (data.data?.token) {
                login(data.data.token, data.data);
                setErrors({});
                setFormData({ email: "", password: "" });
                navigate("/");

            } else {
                toast.error(data.message || "Invalid email or password");
            }

        } catch (error) {
            console.error(error);
            setErrors({ general: "Something went wrong" });
        }
    };

    return (
        <div className='min-h-screen flex justify-center items-center px-4'>
            <div className='w-full max-w-md text-black shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5'>

                <p className='text-4xl'>Login</p>

                <div className="w-[80%] flex flex-col space-y-1">
                    <label className="text-sm font-medium text-left">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder='Enter Email'
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-500 focus:ring-blue-500"
                            }`}
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>

                <div className="w-[80%] flex flex-col space-y-1">
                    <label className="text-sm font-medium text-left">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder='Enter Password'
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-500 focus:ring-blue-500"
                            }`}
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                </div>

                {errors.general && <span className="text-red-600 text-sm text-center">{errors.general}</span>}

                <button
                    onClick={handleLogin}
                    className="mt-4 rounded p-2 w-[40%] bg-black text-white cursor-pointer"
                >
                    Login
                </button>

                <div className="w-[80%] text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to="/signup" className="text-blue-600 cursor-pointer font-medium">
                        Register
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Login;
