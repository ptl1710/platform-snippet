import Link from "next/link";
import ComplexityBadge from "./ComplexityBadge";
import { estimateTimeComplexity } from "../lib/complexity";

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
        } catch (err: any) {
            alert(err.message);
        }
    };


    return (
        <div className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                    <Link href={`/snippets/${id}`} className="hover:underline">
                        {title}
                    </Link>
                </h2>
                <ComplexityBadge complexity={complexity} />
            </div>

            <p className="text-sm text-gray-600 mb-2">
                {description || "No description"}
            </p>

            <div className="text-xs text-gray-500 mb-3">
                <span className="font-medium">{language}</span> • by{" "}
                <Link
                    href={`/profile/${author.username}`}
                    className="hover:underline text-blue-600"
                >
                    {author.username}
                </Link>{" "}
                • {new Date(createdAt).toLocaleDateString()}
            </div>

            <pre className="bg-gray-900 text-green-200 text-sm rounded-md p-3 overflow-x-auto max-h-40">
                <code>{code.slice(0, 200)}...</code>
            </pre>

            <div className="flex gap-3 mt-3">
                <Link
                    href={`/snippets/${id}/edit`}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Edit
                </Link>
                <button
                    onClick={handleDelete}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
