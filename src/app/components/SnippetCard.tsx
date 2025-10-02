import Link from "next/link";
import ComplexityBadge from "./ComplexityBadge";

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
};

export default function SnippetCard({
    id,
    title,
    description,
    language,
    code,
    author,
    createdAt,
}: SnippetCardProps) {
    return (
        <div className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                    <Link href={`/snippets/${id}`} className="hover:underline">
                        {title}
                    </Link>
                </h2>
                <ComplexityBadge code={code} />
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
        </div>
    );
}
