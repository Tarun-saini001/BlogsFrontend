import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        let userData = null;

        try {
            if (userString && userString !== "undefined") {
                userData = JSON.parse(userString);
            }
        } catch (error) {
            console.error("Invalid user in localStorage:", error);
            localStorage.removeItem("user");
        }

        if (token && userData) {
            setIsLoggedIn(true);
            setUser(userData);
        }
    }, []);


    const login = (token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
    };

    const updateProfilePic = (newPic) => {
        setUser(prev => {
            const updatedUser = { ...prev, profilePic: newPic };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                login,
                logout,
                user,
                setUser,
                updateProfilePic
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
