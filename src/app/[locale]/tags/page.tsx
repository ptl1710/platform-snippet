"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TagList {
    id: string;
    name: string;
    slug: string;
    _count: { snippets: number };
}

export default function TagsPage() {
    const [tags, setTags] = useState<TagList[]>([]);
    const [loading, setLoading] = useState(true);
    const t = useTranslations("Tags");
    useEffect(() => {
        fetch("/api/tags", {
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
    }, []);


    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
            {
                loading ? t("loading_tags") :
                    <>
                        {tags.length === 0 && (
                            <p className="text-gray-600">{t("no_tags")}</p>
                        )}

                        <div className="flex flex-wrap gap-3">
                            {tags.map((tag: TagList) => (
                                <Link
                                    key={tag.id}
                                    href={`/tags/${tag.slug}`}
                                    className="px-3 py-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition text-sm"
                                >
                                    #{tag.name}{" "}
                                    <span className="text-gray-500 text-xs">
                                        ({tag._count.snippets})
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </>
            }

        </main>
    );
}
