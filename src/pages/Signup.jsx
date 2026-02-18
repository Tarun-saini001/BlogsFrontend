import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const API = import.meta.env.VITE_API_URL;

    const [errors, setErrors] = useState({});
    const [showOtpField, setShowOtpField] = useState(false);
    const [otp, setOtp] = useState("");
    const [tempEmail, setTempEmail] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });


    const validate = (data) => {
        const newErrors = {};

        if (!data.name.trim()) {
            newErrors.name = "Name is required";
        } else if (!/^[A-Za-z\s]+$/.test(data.name.trim())) {
            newErrors.name = "Name must contain only letters";
        } else if (data.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }

        if (!data.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            newErrors.email = "Invalid email format";
        }

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


    const validateOtp = (value) => {
        const newErrors = {};

        if (!value.trim()) {
            newErrors.otp = "OTP is required";
        } else if (!/^\d{4}$/.test(value)) {
            newErrors.otp = "OTP must be 4 digits";
        }

        return newErrors;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedForm = {
            ...formData,
            [name]: value
        };

        setFormData(updatedForm);
        setErrors(validate(updatedForm));
    };


    const handleRegister = async () => {
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch(`${API}/onBoarding/user/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
                credentials: "include"
            });

            const data = await response.json();
            console.log("signup response:", data);

            if (response.ok && data.statusCode === 200) {
                setTempEmail(formData.email);
                setShowOtpField(true);
                console.log("showOtpField",showOtpField);
            } else if (data.status === "validation" && data.message?.includes("already verified")) {
                alert("This email is already registered ");
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("Something went wrong. Please try again later.");
        }
    };



    const handleOtpChange = (e) => {
        const value = e.target.value;
        setOtp(value);

        const otpErrors = validateOtp(value);

        setErrors((prev) => ({
            ...prev,
            ...otpErrors
        }));
    };



    const handleVerifyOtp = async () => {
        const otpErrors = validateOtp(otp);

        if (Object.keys(otpErrors).length > 0) {
            setErrors((prev) => ({
                ...prev,
                ...otpErrors
            }));
            return;
        }

        try {
            console.log('tempEmail: ', tempEmail);
            console.log('otp: ', otp);
            console.log('formData.name: ', formData.name);
            const response = await fetch(`${API}/onBoarding/user/verifyOtp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: tempEmail,
                    otp: Number(otp),
                    otpType: 1,
                    name: formData.name,
                    password: formData.password,
                }),
                credentials: "include"
            });

            const data = await response.json();
            console.log('data: ', data);

            if (response.ok) {
                if (data?.data?.token) {
                    login(data.data.token);
                    navigate("/");
                }
            } else {
                setErrors((prev) => ({
                    ...prev,
                    otp: data.message || "Invalid OTP"
                }));
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    };



    const handleResendOtp = async () => {
        try {
            const response = await fetch(`${API}/onBoarding/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                alert("OTP resent successfully!");
            } else {
                alert(data.message || "Failed to resend OTP");
            }
        } catch (error) {
            alert("Something went wrong");
        }
    };



    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md text-black shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">

                <p className="text-4xl">Register</p>

                {/* name */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"

                        value={formData.name}
                        onChange={handleChange}
                        disabled={showOtpField}
                        className="border px-3 py-2 rounded"
                    />
                    {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                </div>

                {/* email */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={showOtpField}
                        className="border px-3 py-2 rounded"
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>

                {/* password */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"

                        value={formData.password}
                        onChange={handleChange}
                        disabled={showOtpField}
                        className="border px-3 py-2 rounded"
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                </div>

                {/* confirm password */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"

                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={showOtpField}
                        className="border px-3 py-2 rounded"
                    />
                    {errors.confirmPassword && (
                        <span className="text-red-500 text-xs">{errors.confirmPassword}</span>
                    )}
                </div>


                {!showOtpField && (
                    <button
                        onClick={handleRegister}
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        Register
                    </button>
                )}


                {showOtpField && (
                    <div className="w-[80%] flex flex-col space-y-2">
                        <label>Enter OTP</label>
                        <input
                            type="text"
                            maxLength={4}
                            value={otp}
                            onChange={handleOtpChange}
                            className="border px-3 py-2 rounded"
                        />
                        {errors.otp && (
                            <span className="text-red-500 text-xs">{errors.otp}</span>
                        )}

                        <div className="flex justify-between">
                            <button
                                onClick={handleVerifyOtp}
                                className="bg-black text-white px-3 py-1 rounded"
                            >
                                Verify OTP
                            </button>

                            <button
                                onClick={handleResendOtp}
                                className="text-blue-600 text-sm"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </div>
                )}

                <div className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600">
                        Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Signup;
