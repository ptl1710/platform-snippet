"use client";

import { useEffect, useState } from "react";

export default function EditSnippetForm({ id }: { id: string }) {

    const [data, setData] = useState({
        title: "",
        description: "",
        code: "",
        language: "javascript",
        topics: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchSnippet = async () => {
            try {
                const res = await fetch(`/api/snippets/${id}`, {
                    method: "GET",
                    headers: {
                    }
                }); if (!res.ok) {
                    throw new Error("Failed to fetch snippet");
                } const data = await res.json();
                setData({
                    title: data.title,
                    description: data.description,
                    code: data.code,
                    language: data.language,
                    topics: data.topics.map((t: any) => t.name).join(", ")
                })
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchSnippet();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`/api/snippets/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    ...data,
                    topics: data.topics.split(",").map((t) => t.trim()),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to edit snippet");
            }

            setSuccess("Edit created successfully!");
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
            <h2 className="text-2xl font-bold">Edit Snippet</h2>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    className="w-full border p-2 rounded"
                    rows={3}
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Code</label>
                <textarea
                    value={data.code}
                    onChange={(e) => setData({ ...data, code: e.target.value })}
                    className="w-full font-mono border p-2 rounded"
                    rows={6}
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Language</label>
                <select
                    value={data.language}
                    onChange={(e) => setData({ ...data, language: e.target.value })}
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
                    value={data.topics}
                    onChange={(e) => setData({ ...data, topics: e.target.value })}
                    placeholder="e.g. array, sorting, react"
                    className="w-full border p-2 rounded"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {loading ? "Edit..." : "Edit Snippet"}
            </button>
        </form>
    );
}
