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
       <div className=' h-screen flex justify-center items-center'>
            <div className='bg-gray-200 w-[40%] h-[50%] text-black  rounded-3xl flex flex-col space-y-5 items-center'>
                <p className='text-4xl p-5'>Login</p>
               
                <div className='flex space-x-2   w-[80%] justify-between '>
                    <p className='bg-white  w-[25%] text-black rounded p-1 text-center'>Email</p>
                    <input type="text"
                        placeholder='Enter Email'
                        onChange={handleChange}
                        className='bg-white text-gray-400 w-[60%] rounded' />
                </div>
                <div className='flex space-x-  w-[80%] justify-between'>
                    <p className='bg-white w-[25%] text-center text-black rounded p-1'>Password</p>
                    <input type="text"
                        placeholder='Enter Password'
                        onChange={handleChange}
                        className='bg-white text-gray-400 w-[60%] rounded' />
                </div>
                <button onClick={()=>handleRegister(formData)} className='bg-black text-white mt-[8%] rounded p-1 w-[40%]'>Login</button>
            </div>
        </div>
    )
}

export default Login
