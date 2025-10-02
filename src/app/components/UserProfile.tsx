import SnippetCard from "./SnippetCard";

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
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                {user.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold">{user.name || user.username}</h1>
                    <p className="text-gray-500">@{user.username}</p>
                    <p className="text-sm text-gray-400">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* User Snippets */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Snippets</h2>
                {user.snippets.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {user.snippets.map((snippet) => (
                            <SnippetCard
                                key={snippet.id}
                                id={snippet.id}
                                title={snippet.title}
                                description={snippet.description}
                                language={snippet.language}
                                code={snippet.code}
                                author={{ username: user.username }}
                                createdAt={snippet.createdAt}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">This user hasn’t shared any snippets yet.</p>
                )}
            </div>
        </div>
    );
}
