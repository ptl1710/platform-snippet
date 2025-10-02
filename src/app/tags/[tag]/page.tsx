import { prisma } from "@/app/lib/db";
import Link from "next/link";

interface TagPageProps {
    params: { slug: string };
}

export default async function TagPage({ params }: TagPageProps) {
    const tag = await prisma.tag.findUnique({
        where: { slug: params.slug },
        include: {
            snippets: {
                include: {
                    author: { select: { id: true, username: true, avatarUrl: true } },
                    topics: true,
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!tag) {
        return (
            <main className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold">Tag not found ❌</h1>
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

            <h1 className="text-3xl font-bold mt-4">
                🏷️ Tag: <span className="text-blue-600">#{tag.name}</span>
            </h1>

            {tag.snippets.length === 0 && (
                <p className="mt-4 text-gray-600">No snippets for this tag yet.</p>
            )}

            <div className="space-y-6 mt-6">
                {tag.snippets.map((snippet) => (
                    <div
                        key={snippet.id}
                        className="p-4 rounded-lg border shadow-sm bg-white"
                    >
                        <h2 className="text-xl font-semibold">
                            <Link
                                href={`/snippets/${snippet.id}`}
                                className="hover:underline"
                            >
                                {snippet.title}
                            </Link>
                        </h2>
                        <p className="text-gray-600">{snippet.description}</p>

                        <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                            {snippet.author.avatarUrl && (
                                <img
                                    src={snippet.author.avatarUrl}
                                    alt={snippet.author.username}
                                    className="w-6 h-6 rounded-full"
                                />
                            )}
                            <span>{snippet.author.username}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {snippet.topics.map((t) => (
                                <Link
                                    key={t.id}
                                    href={`/tags/${t.slug}`}
                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                                >
                                    #{t.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
