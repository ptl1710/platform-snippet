"use client";
import { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";

export default function Page() {
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        const getInfoUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found");
                const res = await fetch("/api/auth/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch user info");
                const data = await res.json();
                setUserInfo(data);
                console.log("User Info:", data);
            } catch (error) {
                console.error(error);
            }
        };
        getInfoUser();
    }, [])
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold">Profile</h1>
            <UserProfile user={userInfo as any} />
        </div>
    );
}