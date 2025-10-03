import { Topic } from "@/app/interface";
import { prisma } from "@/app/lib/db";
import Image from "next/image";
import Link from "next/link";

interface UserPageProps {
    params: { username: string };
}

interface Snippet {
    id: string;
    title: string;
    description?: string | null;
    topics: Topic[];
}


export default async function UserPage({ params }: UserPageProps) {
    const user = await prisma.user.findUnique({
        where: { username: params.username },
        include: {
            snippets: {
                include: {
                    topics: true,
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!user) {
        return (
            <main className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold">User not found</h1>
                <Link href="/" className="text-blue-600 underline mt-3 inline-block">
                    ← Back to Home
                </Link>
            </main>
        );
    }

    return (
        <main className="max-w-3xl mx-auto p-6">
            <Link href="/" className="text-blue-600 underline">
                ← Back
            </Link>

            <div className="flex items-center gap-4 mt-6">
                {user.avatarUrl && (
                    <Image
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-16 h-16 rounded-full border"
                    />
                )}
                <div>
                    <h1 className="text-3xl font-bold">{user.username}</h1>
                    {user.name && <p className="text-gray-600">{user.name}</p>}
                    <p className="text-sm text-gray-500">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Shared Snippets</h2>

            {user.snippets.length === 0 && (
                <p className="text-gray-600">This user hasn’t shared any snippets yet.</p>
            )}

            <div className="space-y-6">
                {user.snippets.map((snippet: Snippet) => (
                    <div
                        key={snippet.id}
                        className="p-4 rounded-lg border shadow-sm bg-white"
                    >
                        <h3 className="text-xl font-semibold">
                            <Link
                                href={`/snippets/${snippet.id}`}
                                className="hover:underline"
                            >
                                {snippet.title}
                            </Link>
                        </h3>
                        <p className="text-gray-600">{snippet.description}</p>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {snippet.topics.map((tag: Topic) => (
                                <Link
                                    key={tag.id}
                                    href={`/tags/${tag.slug}`}
                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
