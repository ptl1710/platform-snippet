"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { isLoggedIn } = useAuth();

    return (
        <header className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    CodeShare
                </Link>
                <nav className="space-x-4">
                    <Link href="/snippets" className="hover:underline">
                        Snippets
                    </Link>
                    <Link href="/tags" className="hover:underline">
                        Tags
                    </Link>
                    {isLoggedIn ? (
                        <Link href="/profile" className="hover:underline">
                            Profile
                        </Link>
                    ) : (
                        <Link href="/login" className="hover:underline">
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}