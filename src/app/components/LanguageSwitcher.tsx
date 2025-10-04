"use client";
import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const currentLocale = usePathname().split("/")[1];

    const changeLocale = async (locale: string) => {
        await fetch("/api/set-locale", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locale }),
        });

        const segments = pathname.split("/").filter(Boolean);
        segments[0] = locale;
        const newPath = "/" + segments.join("/");

        startTransition(() => {
            router.push(newPath);
        });
    };

    return (
        <select
            value={currentLocale}
            onChange={(e) => changeLocale(e.target.value)}
            disabled={isPending}
            className="border px-2 py-1 rounded bg-gray-800 text-white "
        >
            <option value="vi">🇻🇳</option>
            <option value="en">🇺🇸</option>
        </select>
    );
}
