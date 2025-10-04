"use client";
import ComplexityBadge from "@/app/components/ComplexityBadge";
import { estimateTimeComplexity } from "@/app/lib/complexity";
import Link from "next/link";
import Image from "next/image";
import { SnippetPageProps, Topic } from "@/app/interface";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";


interface SnippetWithAuthorAndTopics extends SnippetPageProps {
    title: string;
    description: string | null;
    code: string;
    language: string;
    author: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
    topics: Topic[];
}
export default function SnippetPage() {
    const [snippets, setSnippets] = useState<SnippetWithAuthorAndTopics>();
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const t = useTranslations("Snippets");
    const id = pathname.split("/").pop();

    useEffect(() => {
        fetch(`/api/snippets/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setSnippets(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (!snippets) {
        return (
            <main className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold">Snippet not found</h1>
                <Link href="/" className="text-blue-600 underline mt-3 inline-block">
                    ← {t("back_to_list")}
                </Link>
            </main>
        );
    }

    const complexity = estimateTimeComplexity(snippets.code);

    return (
        <main className="max-w-3xl mx-auto p-6">
            <Link href="/" className="text-blue-600 underline">
                ← {t("back_to_list")}
            </Link>

            {loading ? "" : <>
                <h1 className="text-3xl font-bold mt-4">{snippets.title}</h1>
                <p className="text-gray-600">{snippets.description}</p>

                <div className="flex items-center gap-2 mt-3">
                    <ComplexityBadge complexity={complexity} />
                    <span className="text-sm text-gray-500">
                        {t("form_language")}: {snippets.language}
                    </span>
                </div>

                <pre className="bg-gray-100 text-sm rounded-lg p-4 mt-4 overflow-x-auto">
                    {snippets.code}
                </pre>

                <div className="flex items-center gap-3 mt-4">
                    {snippets.author.avatarUrl && (
                        <Image
                            src={snippets.author.avatarUrl}
                            alt={snippets.author.username}
                            className="w-8 h-8 rounded-full"
                        />
                    )}
                    <span className="text-gray-700">{snippets.author.username}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {snippets.topics.map((tag: Topic) => (
                        <Link
                            key={tag.id}
                            href={`/tags/${tag.slug}`}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                        >
                            #{tag.name}
                        </Link>
                    ))}
                </div>
            </>}
        </main>
    );
}
