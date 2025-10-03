"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateSnippetForm() {
    const [dataSnippet, setDataSnippet] = useState({
        title: "",
        description: "",
        code: "",
        language: "javascript",
        topics: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/snippets/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: dataSnippet.title,
                    description: dataSnippet.description,
                    code: dataSnippet.code,
                    language: dataSnippet.language,
                    topics: dataSnippet.topics.split(",").map((t) => t.trim()),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create snippet");
            }

            setSuccess("Snippet created successfully!");
            setDataSnippet({
                title: "",
                description: "",
                code: "",
                language: "javascript",
                topics: "",
            })
            router.back();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4"
        >
            <h2 className="text-2xl font-bold">Create New Snippet</h2>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                    type="text"
                    value={dataSnippet.title}
                    onChange={(e) => setDataSnippet({ ...dataSnippet, title: e.target.value })}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                    value={dataSnippet.description}
                    onChange={(e) => setDataSnippet({ ...dataSnippet, description: e.target.value })}
                    className="w-full border p-2 rounded"
                    rows={3}
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Code</label>
                <textarea
                    value={dataSnippet.code}
                    onChange={(e) => setDataSnippet({ ...dataSnippet, code: e.target.value })}
                    className="w-full font-mono border p-2 rounded"
                    rows={6}
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Language</label>
                <select
                    value={dataSnippet.language}
                    onChange={(e) => setDataSnippet({ ...dataSnippet, language: e.target.value })}
                    className="w-full border p-2 rounded"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                </select>
            </div>

            <div>
                <label className="block mb-1 font-medium">Tags (comma separated)</label>
                <input
                    type="text"
                    value={dataSnippet.topics}
                    onChange={(e) => setDataSnippet({ ...dataSnippet, topics: e.target.value })}
                    placeholder="e.g. array, sorting, react"
                    className="w-full border p-2 rounded"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {loading ? "Creating..." : "Create Snippet"}
            </button>
        </form>
    );
}
