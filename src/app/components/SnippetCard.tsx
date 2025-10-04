"use client";
import { useState } from "react";
import Link from "next/link";
import ComplexityBadge from "./ComplexityBadge";
import { estimateTimeComplexity } from "../lib/complexity";
import { useTranslations } from "next-intl";

type SnippetCardProps = {
    id: string;
    title: string;
    description?: string;
    language: string;
    code: string;
    author: {
        username: string;
    };
    createdAt: string;
    onDelete?: (id: string) => void;
};

export default function SnippetCard({
    id,
    title,
    description,
    language,
    code,
    author,
    createdAt,
    onDelete,
}: SnippetCardProps) {
    const complexity = estimateTimeComplexity(code);
    const [expanded, setExpanded] = useState(false);
    const t = useTranslations("");
    const handleDelete = async () => {
        if (!confirm("Bạn có chắc muốn xóa snippet này?")) return;
        try {
            const res = await fetch(`/api/snippets/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Xoá snippet thất bại");
            }

            if (onDelete) onDelete(id);
            alert("Xoá thành công !");
        } catch (err: unknown) {
            if (err instanceof Error) alert(err.message);
        }
    };

    return (
        <div className="w-full max-w-full border rounded-lg shadow-sm p-3 sm:p-4 bg-white hover:shadow-md transition">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                <h2 className="text-sm sm:text-lg font-semibold break-words">
                    <Link href={`/snippets/${id}`} className="hover:underline">
                        {title}
                    </Link>
                </h2>
                <ComplexityBadge complexity={complexity} />
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                {description || "No description"}
            </p>

            <div className="text-xs sm:text-sm text-gray-500 mb-3 flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="font-medium">{language}</span> •{" "}
                <span className="font-medium">{author.username}</span> •{" "}
                {new Date(createdAt).toLocaleDateString()}
            </div>

            <div className="relative">
                <pre
                    className={`bg-gray-900 text-green-200 text-xs sm:text-sm rounded-md p-2 sm:p-3 overflow-x-auto break-words whitespace-pre-wrap transition-all ${expanded ? "max-h-96" : "max-h-20 sm:max-h-40"
                        }`}
                >
                    <code>{code}</code>
                </pre>
                <button
                    onClick={() => setExpanded((prev) => !prev)}
                    className="mt-2 text-blue-600 text-xs sm:text-sm hover:underline"
                >
                    {expanded ? t("Snippets.view_less") : t("Snippets.view_more")}
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3">
                <Link
                    href={`/snippets/${id}/edit`}
                    className="px-3 py-1 text-xs sm:text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 text-center"
                >
                    {t("Snippets.edit_button")}
                </Link>
                <button
                    onClick={handleDelete}
                    className="px-3 py-1 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                    {t("Snippets.delete_button")}
                </button>
            </div>
        </div>
    );
}
