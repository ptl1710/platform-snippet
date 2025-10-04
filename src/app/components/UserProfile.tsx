import { useState } from "react";
import SnippetCard from "./SnippetCard";
import Image from "next/image";

type UserProfileProps = {
    user: {
        id: string;
        username: string;
        name?: string;
        avatarUrl?: string;
        createdAt: string;
        snippets: {
            id: string;
            title: string;
            description?: string;
            language: string;
            code: string;
            createdAt: string;
        }[];
    };
};

export default function UserProfile({ user }: UserProfileProps) {
    const [snippets, setSnippets] = useState(user.snippets);

    const handleDelete = (id: string) => {
        setSnippets((prev) => prev.filter((s) => s.id !== id));
    };

    async function logoutApi() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-4">
                {user?.avatarUrl ? (
                    <Image
                        src={user?.avatarUrl}
                        alt={user?.username}
                        width={64}
                        height={64}
                        className="w-20 h-20 rounded-full object-cover mx-auto md:mx-0"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold mx-auto md:mx-0">
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="text-center md:text-left">
                    <h1 className="text-xl md:text-2xl font-bold">
                        {user?.name || user?.username}
                    </h1>
                    <p className="text-gray-500">@{user?.username}</p>
                    <p className="text-sm text-gray-400">
                        Joined {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:ml-auto">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer w-full sm:w-auto"
                        onClick={() => (window.location.href = "/snippets/create")}
                    >
                        Create Snippet
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer w-full sm:w-auto"
                        onClick={async () => {
                            await logoutApi();
                            window.location.href = "/";
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div>
                <h2 className="text-lg md:text-xl font-semibold mb-3">Snippets</h2>
                {snippets.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {snippets?.map((snippet) => (
                            <SnippetCard
                                key={snippet.id}
                                id={snippet.id}
                                title={snippet.title}
                                description={snippet.description}
                                language={snippet.language}
                                code={snippet.code}
                                author={{ username: user?.username }}
                                createdAt={snippet.createdAt}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center sm:text-left">
                        This user hasn’t shared any snippets yet.
                    </p>
                )}
            </div>
        </div>
    );
}
