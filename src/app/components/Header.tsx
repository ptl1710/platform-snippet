"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {

    const t = useTranslations("Header");
    return (
        <header className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    {t("title")}
                </Link>
                <nav className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                    <Link href="/snippets" className="hover:underline">
                        {t("snippets")}
                    </Link>
                    <Link href="/tags" className="hover:underline">
                        Tags
                    </Link>
                    <Link href="/profile" className="hover:underline">
                        {t("profile")}
                    </Link>
                    <LanguageSwitcher />
                </nav>
            </div>
        </header>
    );
}