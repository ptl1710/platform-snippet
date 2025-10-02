// context/AuthContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
