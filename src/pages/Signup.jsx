import React, { useContext, useState } from 'react'
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const API = import.meta.env.VITE_API_URL;
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const handleChange = async (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleRegister = async () => {
        try {
            const response = await fetch(`${API}/onBoarding/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                 credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                alert("User registered successfully!")
                console.log("data", data);
                login(data.data.token);
                setErrors({});
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                });
                window.location.href = "/";

            } else {
                console.log('data:--- ', data);
                if (data.errors) {
                    const formattedErrors = {};
                    data.errors.forEach(err => {
                        formattedErrors[err.field] = err.message;
                    });
                    setErrors(formattedErrors);
                    console.log('formattedErrors: ', formattedErrors);
                } else {
                    alert(data.message || "Registration failed");
                }

            }
        } catch (error) {
            console.log(error);
            alert("something went wrong")
        }
    };
    return (
        <div className=' h-screen flex justify-center items-center'>
            <div className='bg-gray-200  w-[40%] h-auto text-black  rounded-3xl pb-6 flex flex-col space-y-5 items-center'>
                <p className='text-4xl p-5'>Signup</p>
                <div className='flex space-x-2   w-[80%] justify-between '>
                    <p className='bg-white  w-[25%] text-black rounded p-1 text-center'>Name</p>
                    <input
                        type="text"
                        name="name"
                        placeholder="userName"
                        onChange={handleChange}
                        className='bg-white text-gray-500 w-[60%]   rounded' />

                </div>
                {errors.name && (
                    <span className="text-red-500 text-sm  ml-auto w-[60%]">
                        {errors.name}
                    </span>
                )}

                <div className='flex space-x-2   w-[80%] justify-between '>
                    <p className='bg-white  w-[25%] text-black rounded p-1 text-center'>Email</p>
                    <input type="text"
                        name="email"
                        placeholder='Enter Email'
                        onChange={handleChange}
                        className='bg-white text-gray-400 w-[60%] rounded' />
                </div>
                {errors.email && (
                    <span className="text-red-500 text-sm  ml-auto w-[60%]">
                        {errors.email}
                    </span>
                )}

                <div className='flex space-x-  w-[80%] justify-between'>
                    <p className='bg-white w-[25%] text-center text-black rounded p-1'>Password</p>
                    <input type="text"
                        name="password"
                        placeholder='Enter Password'
                        onChange={handleChange}
                        className='bg-white text-gray-400 w-[60%] rounded' />
                </div>
                {errors.password && (
                    <span className="text-red-500 text-sm  ml-auto w-[60%]">
                        {errors.password}
                    </span>
                )}

                <button onClick={() => handleRegister(formData)} className='bg-black text-white mt-[8%] rounded p-1 w-[40%]'>Register</button>
            </div>
        </div>
    )
}

export default Signup
