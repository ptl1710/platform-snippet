"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        username: "",
        name: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const t = useTranslations("RegisterPage");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Register failed");
            } else {
                window.location.href = "/profile";
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
            {error && <p className="text-red-600 mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="email"
                    type="email"
                    placeholder={t("email")}
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                />
                <input
                    name="username"
                    type="text"
                    placeholder={t("username")}
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                />
                <input
                    name="name"
                    type="text"
                    placeholder={t("name")}
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
                <input
                    name="password"
                    type="password"
                    placeholder={t("password")}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? t("button_loading") : t("button")}
                </button>
            </form>
            <Link href="/login" className="text-blue-600 hover:underline mt-4 block text-center">
                {t("already_have_account")} {t("login")}
            </Link>
        </main>
    );
}
