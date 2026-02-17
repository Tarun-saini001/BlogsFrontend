import React, { useContext, useState } from 'react'
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom';
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

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };

    const handleRegister = async () => {

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
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
                   const formattedErrors ={}
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
            <div className='w-[35%] h-auto text-black shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5'>

                <p className='text-4xl p-5'>Register</p>
                <div className="w-[80%] flex flex-col space-y-1">
                    <label className="text-sm font-medium text-left">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder='Enter Name'
                        value={formData.name}
                        onChange={handleChange}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.name
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                    {errors.name && (
                        <span className="text-red-500 text-xs">{errors.name}</span>
                    )}
                </div>


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



                <button onClick={() => handleRegister(formData)} className='bg-black text-white mt-[8%] rounded p-1 w-[40%]'>Register</button>

                <div className="w-[80%] text-center  text-sm">
                    <span className="text-gray-600 ">
                        Already have an account?{" "}
                    </span>
                    <Link
                        to="/login"
                        className="text-blue-600  font-medium hover:underline"
                    >
                        Login
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Signup
