"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const locale = useLocale();
    const t = useTranslations("LoginPage");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/auth/login?locale=${locale}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Language": locale
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Login failed");
            }
            else {
                window.location.href = "/";
            }
        } catch {
            setError(t("something_went_wrong"));
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
            <Link href="/register" className="text-blue-600 hover:underline mt-4 block text-center">
                {t("no_account")} {t("register")}
            </Link>
        </main>
    );
}
