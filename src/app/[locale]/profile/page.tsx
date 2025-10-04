"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import UserProfile from "../../components/UserProfile";
import { User } from "../../interface";


export default function Page() {
    const t = useTranslations("Profile");
    const [userInfo, setUserInfo] = useState<User | null>(null);
    useEffect(() => {
        const getInfoUser = async () => {
            try {
                const res = await fetch("/api/auth/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch user info");
                const data = await res.json();
                setUserInfo(data);
            } catch (error) {
                console.error(error);
            }
        };
        getInfoUser();
    }, [])
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold">Profile</h1>
            {userInfo ? (
                <UserProfile user={userInfo} />
            ) : (
                <p>{t("user_loading")}</p>
            )}
        </div>
    );
}