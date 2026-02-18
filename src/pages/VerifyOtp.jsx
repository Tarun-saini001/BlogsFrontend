import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const VerifyOtp = () => {
    const { login } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);

    const { email, name, password, expiresAt } = location.state || {};

    // Redirect if accessed directly
    useEffect(() => {
        if (!email) {
            navigate("/signup");
        }
    }, []);

    // Timer logic
    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleVerifyOtp = async () => {
        if (!/^\d{4}$/.test(otp)) {
            setError("OTP must be 4 digits");
            return;
        }

        if (timeLeft <= 0) {
            setError("OTP expired. Please register again.");
            return;
        }

        try {
            const response = await fetch(`${API}/onBoarding/user/verifyOtp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    otp: Number(otp),
                    otpType: 1,
                    name,
                    password
                })
            });

            const data = await response.json();

            if (response.ok && data?.data?.token) {
                login(data.data.token);
                navigate("/");
            } else {
                setError(data.message || "Invalid OTP");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="shadow-xl rounded-2xl p-8 w-[350px] flex flex-col gap-4">

                <h2 className="text-2xl text-center">Verify OTP</h2>

                <p className="text-sm text-gray-600 text-center">
                    OTP sent to {email}
                </p>

                <input
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    className="border px-3 py-2 rounded"
                />

                {error && (
                    <span className="text-red-500 text-xs">{error}</span>
                )}

                <p className="text-sm text-center text-gray-500">
                    Expires in: {formatTime(timeLeft)}
                </p>

                <button
                    onClick={handleVerifyOtp}
                    disabled={timeLeft <= 0}
                    className="bg-black text-white py-2 rounded disabled:bg-gray-400"
                >
                    Verify OTP
                </button>

                {timeLeft <= 0 && (
                    <button
                        onClick={() => navigate("/signup")}
                        className="text-blue-600 text-sm"
                    >
                        OTP expired. Register again
                    </button>
                )}

            </div>
        </div>
    );
};

export default VerifyOtp;
