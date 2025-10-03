import { prisma } from "@/app/lib/db";
import ComplexityBadge from "@/app/components/ComplexityBadge";
import { estimateTimeComplexity } from "@/app/lib/complexity";
import Link from "next/link";

interface SnippetPageProps {
    params: Promise<{ id: string }>;
}

export default async function SnippetPage({ params }: SnippetPageProps) {
    const { id } = await params;
    const snippet = await prisma.snippet.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, username: true, avatarUrl: true } },
            topics: true,
        },
    });

    if (!snippet) {
        return (
            <main className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold">Snippet not found</h1>
                <Link href="/" className="text-blue-600 underline mt-3 inline-block">
                    ← Back to Home
                </Link>
            </main>
        );
    }

    const complexity = estimateTimeComplexity(snippet.code);

    return (
        <main className="max-w-3xl mx-auto p-6">
            <Link href="/" className="text-blue-600 underline">
                ← Back
            </Link>

            <h1 className="text-3xl font-bold mt-4">{snippet.title}</h1>
            <p className="text-gray-600">{snippet.description}</p>

            <div className="flex items-center gap-2 mt-3">
                <ComplexityBadge complexity={complexity} />
                <span className="text-sm text-gray-500">
                    Language: {snippet.language}
                </span>
            </div>

            <pre className="bg-gray-100 text-sm rounded-lg p-4 mt-4 overflow-x-auto">
                {snippet.code}
            </pre>

            <div className="flex items-center gap-3 mt-4">
                {snippet.author.avatarUrl && (
                    <img
                        src={snippet.author.avatarUrl}
                        alt={snippet.author.username}
                        className="w-8 h-8 rounded-full"
                    />
                )}
                <span className="text-gray-700">{snippet.author.username}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                {snippet.topics.map((tag: any) => (
                    <Link
                        key={tag.id}
                        href={`/tags/${tag.slug}`}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                    >
                        #{tag.name}
                    </Link>
                ))}
            </div>
        </main>
    );
}
