import React, { useContext, useState } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";

const Login = () => {
    const { login } = useContext(AuthContext);
    const API = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let cleanedValue = value;
        if (name === "email") {
            cleanedValue = value.trimStart();
        }

        if (name === "password") {
            cleanedValue = value.trimStart();
        }
        const updatedForm = {
            ...formData,
            [name]: cleanedValue
        };

        setFormData(updatedForm);
        setErrors(validate(updatedForm));
    };


    const validate = (data) => {
        const newErrors = {};

        // Email validation
        if (!data.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/.test(data.email)
        ) {
            newErrors.email =
                "Email must be like example@domain.com (domain only letters)";
        }

        // Password validation
        if (!data.password.trim()) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };


    const handleLogin = async () => {
        const validationErrors = validate(formData);
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
            console.log("Login response:", data);

            if (data.errors) {
                const formattedErrors = {};
                data.errors.forEach(err => {
                    formattedErrors[err.field] = err.message;
                });
                setErrors(formattedErrors);

            } else if (data.data?.token) {
                login(data.data.token , data.data);
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
                    <label className="text-sm font-medium text-left">Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        name="email"
                        placeholder='Enter Email'
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.email
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-500 focus:ring-blue-500"
                            }`}
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>


                <div className="w-[80%] flex flex-col space-y-1">
                    <label className="text-sm font-medium text-left">Password <span className="text-red-500">*</span></label>
                    <input
                        type="password"
                        name="password"
                        placeholder='Enter Password'
                        value={formData.password}
                        onChange={handleChange}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.password
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-500 focus:ring-blue-500"
                            }`}
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                </div>


                {errors.general && (
                    <span className="text-red-600 text-sm text-center">{errors.general}</span>
                )}


                <button
                    onClick={handleLogin}
                    className={`mt-4 rounded p-2 w-[40%] bg-black cursor-pointer text-white ho`}
                >
                    Login
                </button>


                <div className="w-[80%] text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link
                        to="/signup"
                        className="text-blue-600 cursor-pointer font-medium"
                    >
                        Register
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Login;
