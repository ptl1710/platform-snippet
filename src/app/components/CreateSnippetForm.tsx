"use client";

import { useState } from "react";

export default function CreateSnippetForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [topics, setTopics] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You must be logged in");
                setLoading(false);
                return;
            }

            const res = await fetch("/api/snippets/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    code,
                    language,
                    topics: topics.split(",").map((t) => t.trim()),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create snippet");
            }

            setSuccess("Snippet created successfully!");
            setTitle("");
            setDescription("");
            setCode("");
            setTopics("");
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border p-2 rounded"
                    rows={3}
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Code</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full font-mono border p-2 rounded"
                    rows={6}
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Language</label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
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
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
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
