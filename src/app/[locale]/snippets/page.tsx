"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Snippet, } from "../../interface";
import { useTranslations } from "next-intl";

export default function Page() {
    const t = useTranslations("Snippets");
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("/api/snippets", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setSnippets(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);


    return (
        <main className="max-w-3xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
            {
                loading ? (
                    <p className="text-gray-600">{t("loading_snippets")}</p>
                ) :
                    <>
                        {snippets.length === 0 && <p>{t("no_snippets")}</p>}

                        <div className="space-y-6">
                            {snippets.map((snippet) => (
                                <div
                                    key={snippet.id}
                                    className="p-4 rounded-lg border shadow-sm bg-white"
                                >
                                    <h2 className="text-xl font-semibold">
                                        <Link href={`/snippets/${snippet.id}`} className="hover:underline">
                                            {snippet.title}
                                        </Link>
                                    </h2>
                                    <p className="text-gray-600">{snippet.description}</p>

                                    <pre className="bg-gray-100 text-sm rounded-lg p-3 mt-2 overflow-x-auto">
                                        {snippet.code}
                                    </pre>

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
                                        {snippet.topics.map((tag) => (
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
                    </>
            }

        </main>
    );
}
