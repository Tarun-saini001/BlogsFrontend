import React, { useState } from 'react'

const Login = () => {
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
    return (
        <div className='bg-amber-200 h-screen flex justify-center items-center'>
            <div className='bg-gray-800 w-[40%] h-[50%] text-amber-200 rounded-3xl flex flex-col space-y-5 items-center'>
                <p className='text-4xl p-5'>Login</p>

                <div className='flex space-x-2   w-[80%] justify-between '>
                    <p className='bg-amber-500 w-[25%] text-white rounded p-1 text-center'>Email</p>
                    <input
                        type="text"
                        onChange={handleChange}
                        className='bg-white w-[60%] border border-amber-200 border-4 rounded' />
                </div>
                <div className='flex space-x-2  w-[80%] justify-between'>
                    <p className='bg-amber-500 w-[25%] text-center text-white rounded p-1'>Password</p>
                    <input
                        type="text"
                        onChange={handleChange}
                        className='bg-white w-[60%] border border-amber-200 border-4 rounded' />
                </div>
                <button className='bg-amber-500 text-white mt-[8%] rounded p-1 w-[40%]'>Login</button>
            </div>
        </div>
    )
}

export default Login
