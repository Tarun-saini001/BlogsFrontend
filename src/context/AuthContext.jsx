import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user"));
        if (token && userData) {
            setIsLoggedIn(true);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", user);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
    };

    const updateProfilePic = (newPic) => {
        setUser(prev => ({ ...prev, profilePic: newPic }));
        localStorage.setItem("user", JSON.stringify({ ...user, profilePic: newPic }));
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, updateProfilePic  }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
