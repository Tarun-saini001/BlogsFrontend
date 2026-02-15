import React, { useState } from 'react'

const Login = () => {
    const API = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const handleChange = async (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleLogin = async () => {
        try {
            console.log("API:", API);
            console.log("Sending:", formData);

            const response = await fetch(`${API}/onBoarding/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");
                console.log(data);
                localStorage.setItem("token", data.token);
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    };
    return (
        <div className=' h-screen flex justify-center items-center'>
            <div className='bg-gray-200 w-[40%] h-[50%] text-black  rounded-3xl flex flex-col space-y-5 items-center'>
                <p className='text-4xl p-5'>Login</p>

                <div className='flex space-x-2   w-[80%] justify-between '>
                    <p className='bg-white  w-[25%] text-black rounded p-1 text-center'>Email</p>
                    <input type="text"
                        name="email"
                        value={formData.email}
                        placeholder='Enter Email'
                        onChange={handleChange}
                        className='bg-white text-gray-400 w-[60%] rounded' />
                </div>
                <div className='flex space-x-  w-[80%] justify-between'>
                    <p className='bg-white w-[25%] text-center text-black rounded p-1'>Password</p>
                    <input type="text"
                        name="password"
                        value={formData.password}
                        placeholder='Enter Password'
                        onChange={handleChange}
                        className='bg-white text-gray-400 w-[60%] rounded' />
                </div>
                <button onClick={handleLogin} className='bg-black text-white mt-[8%] rounded p-1 w-[40%]'>Login</button>
            </div>
        </div>
    )
}

export default Login
