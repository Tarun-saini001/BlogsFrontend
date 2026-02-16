import React, { useContext, useState } from 'react'
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';


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
    const handleLogin = async () => {
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

            console.log('data.token: ', data.data.token);
            if (response.ok && data.data.token) {
                login(data.token);
                setErrors({});
                setFormData({
                    email: "",
                    password: ""
                });

                console.log("Before navigate");
                navigate("/");
                console.log("After navigate");

            } else {
                if (data.errors) {
                    const formattedErrors = {};
                    data.errors.forEach(err => {
                        formattedErrors[err.field] = err.message;
                    });
                    setErrors(formattedErrors);
                } else {
                    // alert(data.message || "login failed");
                    console.log("errorrrrr")

                }
            }
        } catch (error) {
            console.log(error);
            setErrors({ general: "Something went wrong" });
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='bg-gray-200 w-[40%] h-auto pb-6 text-black rounded-3xl flex flex-col space-y-5 items-center'>
                <p className='text-4xl p-5'>Login</p>

                <div className='flex space-x-2 w-[80%] justify-between'>
                    <p className='bg-white w-[25%] text-black rounded p-1 text-center'>Email</p>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        placeholder='Enter Email'
                        onChange={handleChange}
                        className='bg-white text-gray-400 w-[60%] rounded'
                    />
                </div>
                {errors.email && (
                    <span className="text-red-500 text-sm ml-auto w-[60%]">
                        {errors.email}
                    </span>
                )}

                <div className='flex w-[80%] justify-between'>
                    <p className='bg-white w-[25%] text-center text-black rounded p-1'>Password</p>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder='Enter Password'
                        onChange={handleChange}
                        className='bg-white text-gray-400 w-[60%] rounded'
                    />
                </div>
                {errors.password && (
                    <span className="text-red-500 text-sm ml-auto w-[60%]">
                        {errors.password}
                    </span>
                )}

                {errors.general && (
                    <span className="text-red-600 text-sm">
                        {errors.general}
                    </span>
                )}

                <button
                    onClick={handleLogin}
                    className='bg-black text-white mt-[8%] rounded p-1 w-[40%]'
                >
                    Login
                </button>
            </div>
        </div>
    )
}

export default Login;
