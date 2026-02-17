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
        password: "",
        confirmPassword: ""
    })
    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedForm = {
            ...formData,
            [name]: value
        };

        setFormData(updatedForm);
        setErrors(validate(updatedForm));
    };


    const validate = (data) => {
        const newErrors = {};

        // name validation
        if (!data.name.trim()) {
            newErrors.name = "Name is required";
        } else if (data.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }

        // email validation
        if (!data.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.com$/.test(data.email)
        ) {
            newErrors.email = "Invalid email format";
        }


        // password validation
        if (!data.password.trim()) {
            newErrors.password = "Password is required";
        } else if (data.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!data.confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm password is required";
        } else if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    const handleRegister = async () => {

        const validationErrors = validate(formData);
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
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                if (response.ok) {

                    console.log("data", data);

                    if (data?.data?.token) {
                        login(data.data.token);
                        alert("Login successful!");
                        navigate("/");
                    } else {
                        alert(data.message || "Operation completed");
                    }
                }

            } else {
                console.log('data:--- ', data);
                if (data.errors) {
                    const formattedErrors = {}
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
        <div className='min-h-screen flex justify-center items-center px-4'>
            <div className='w-full max-w-md text-black shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5'>


                <p className='text-4xl '>Register</p>
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

                <div className="w-[80%] flex flex-col space-y-1">
                    <label className="text-sm font-medium text-left">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.confirmPassword
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                    {errors.confirmPassword && (
                        <span className="text-red-500 text-xs">
                            {errors.confirmPassword}
                        </span>
                    )}
                </div>


                <button
                    disabled={Object.keys(errors).length > 0}
                    onClick={handleRegister}
                    className={`mt-[8%] rounded p-1 w-[40%] ${Object.keys(errors).length > 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-black text-white cursor-pointer"
                        }`}
                >
                    Register
                </button>


                <div className="w-[80%] text-center  text-sm">
                    <span className="text-gray-600 ">
                        Already have an account?{" "}
                    </span>
                    <Link
                        to="/login"
                        className="text-blue-600 cursor-pointer  font-medium"
                    >
                        Login
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Signup
