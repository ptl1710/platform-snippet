"use client";
import { Snippet, Topic } from "@/app/interface";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, useEffect, useState } from "react";

interface TagPageProps {
    params: { slug: string };
}

interface SnippetWithAuthorAndTopics extends Snippet {
    author: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
    topics: Topic[];
}

interface Tag {
    id: string;
    name: string;
    slug: string;
    snippets: SnippetWithAuthorAndTopics[];
}

export default function TagPage() {
    const slug = usePathname().split("/").pop();
    const [tags, setTags] = useState<Tag>();
    const [loading, setLoading] = useState(true);
    const t = useTranslations("Snippets");

    useEffect(() => {
        fetch(`/api/tags/${slug}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setTags(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));

    }, [])

    if (!tags) {
        return (
            <main className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold">{t("tags_not_found")}</h1>
                <Link href="/" className="text-blue-600 underline mt-3 inline-block">
                    ← {t("back_to_list")}
                </Link>
            </main>
        );
    }

    return (
        <main className="max-w-3xl mx-auto p-6">
            <Link href="/" className="text-blue-600 underline">
                ← {t("back_to_list")}
            </Link>

            <h1 className="text-3xl font-bold mt-4">
                Tag: <span className="text-blue-600">#{tags.name}</span>
            </h1>
            {
                loading ? t("tags_loading") : <>
                    {tags.snippets.length === 0 && (
                        <p className="mt-4 text-gray-600">{t("tags_no_snippets")}</p>
                    )}
                    <div className="space-y-6 mt-6">
                        {tags.snippets.map((snippet: SnippetWithAuthorAndTopics) => (
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
                                        <Image
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
                </>
            }

        </main>
    );
}
