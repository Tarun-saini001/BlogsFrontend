import React, { useContext, useState } from 'react'
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };


    const handleLogin = async () => {

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            const response = await fetch(`${API}/onBoarding/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();
            console.log("Login response:", data);

            console.log('data.token: ', data.data?.token);

            if (data.errors) {
                const formattedErrors = {};
                data.errors.forEach(err => {
                    formattedErrors[err.field] = err.message;
                });
                setErrors(formattedErrors);

            } else if (data.data?.token) {

                login(data.data.token);
                setErrors({});
                setFormData({ email: "", password: "" });
                navigate("/");

            } else {
                toast.error(data.message || "Invalid email or password");
            }

        } catch (error) {
            console.log(error);
            setErrors({ general: "Something went wrong" });
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='w-[35%] h-auto text-black shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5'>

                <p className='text-4xl p-5'>Login</p>

                {/* email field */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label className="text-sm font-medium text-left">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder='Enter Email'
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.email
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                    {errors.email && (
                        <span className="text-red-500 text-xs">{errors.email}</span>
                    )}
                </div>

                {/* password field */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label className="text-sm font-medium text-left">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder='Enter Password'
                        value={formData.password}
                        onChange={handleChange}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.password
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                    {errors.password && (
                        <span className="text-red-500 text-xs">{errors.password}</span>
                    )}
                </div>

                {errors.general && (
                    <span className="text-red-600 text-sm text-center">
                        {errors.general}
                    </span>
                )}

                <button
                    onClick={handleLogin}
                    className='bg-black text-white rounded p-2 w-[80%]'
                >
                    Login
                </button>

                <div className="w-[80%] text-center text-sm">
                    <span className="text-gray-600">
                        Don't have an account?{" "}
                    </span>
                    <Link
                        to="/signup"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Register
                    </Link>
                </div>

            </div>
        </div>
    );

}

export default Login;
