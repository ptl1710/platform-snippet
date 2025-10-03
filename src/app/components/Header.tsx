"use client";
import Link from "next/link";

export default function Header() {

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
                    <Link href="/profile" className="hover:underline">
                        Profile
                    </Link>
                </nav>
            </div>
        </header>
    );
}