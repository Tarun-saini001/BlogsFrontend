import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/.test(value))
      return "Invalid email address";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API}/onBoarding/user/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      console.log('data:(forgot pass) ', data);

      if (response.ok) {
        toast.success("OTP sent to your email");


        navigate("/verify-otp", {
          state: {
            email,
            otpType: 3, 
            expiresAt: Date.now() + 5 * 60 * 1000
          }
        });
      } else {
        toast.error(data.message || "Something went wrong");
      }

    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">

        <p className="text-4xl">Forgot Password</p>

        <div className="w-[80%] flex flex-col space-y-1">
          <label>Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className={`px-3 py-2 border rounded ${error ? "border-red-500" : "border-gray-500"
              }`}
            placeholder="Enter your email"
          />
          {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-4 w-[40%] py-2 rounded"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

      </div>
    </div>
  );
};

export default ForgotPassword;