import React, { useState } from 'react'

const Signup = () => {
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
    // const handleRegister = async(formData)={
    //     if(!formData.email && !formData.password){
    //         return,
    //     }
    // }
    return (
        <div className=' h-screen flex justify-center items-center'>
            <div className='bg-gray-200 hover:w-[42%] hover:h-[62%] hover:shadow-gray-500  w-[40%] h-[60%] text-black  rounded-3xl flex flex-col space-y-5 items-center'>
                <p className='text-4xl p-5'>Signup</p>
                <div className='flex space-x-2   w-[80%] justify-between '>
                    <p className='bg-white  w-[25%] text-black rounded p-1 text-center'>Name</p>
                    <input
                        type="text"
                        placeholder="userName"
                        onChange={handleChange}
                        className='bg-white text-gray-500 w-[60%]   rounded' />
                </div>
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
                <button onClick={()=>handleRegister(formData)} className='bg-black text-white mt-[8%] rounded p-1 w-[40%]'>Register</button>
            </div>
        </div>
    )
}

export default Signup
