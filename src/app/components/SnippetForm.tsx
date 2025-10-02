"use client";

import { useState } from "react";

type SnippetFormProps = {
    onSubmit: (data: {
        title: string;
        description?: string;
        language: string;
        code: string;
        topics: string[];
    }) => void;
    initialData?: {
        title: string;
        description?: string;
        language: string;
        code: string;
        topics: string[];
    };
};

export default function SnippetForm({ onSubmit, initialData }: SnippetFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [language, setLanguage] = useState(initialData?.language || "javascript");
    const [code, setCode] = useState(initialData?.code || "");
    const [topics, setTopics] = useState(initialData?.topics || []);
    const [topicInput, setTopicInput] = useState("");

    const handleAddTopic = () => {
        if (topicInput.trim() && !topics.includes(topicInput.trim())) {
            setTopics([...topics, topicInput.trim()]);
            setTopicInput("");
        }
    };

    const handleRemoveTopic = (topic: string) => {
        setTopics(topics.filter((t) => t !== topic));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, language, code, topics });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 border rounded-lg p-6 bg-white shadow-sm"
        >
            <div>
                <label className="block font-medium mb-1">Title</label>
                <input
                    className="w-full border rounded px-3 py-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                    className="w-full border rounded px-3 py-2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div>
                <label className="block font-medium mb-1">Language</label>
                <select
                    className="w-full border rounded px-3 py-2"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                </select>
            </div>

            <div>
                <label className="block font-medium mb-1">Code</label>
                <textarea
                    className="w-full border rounded px-3 py-2 font-mono text-sm"
                    rows={8}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="block font-medium mb-1">Topics</label>
                <div className="flex gap-2 mb-2">
                    <input
                        className="flex-1 border rounded px-3 py-2"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={handleAddTopic}
                        className="px-3 py-2 bg-blue-600 text-white rounded"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                        <span
                            key={topic}
                            className="bg-gray-200 text-sm px-2 py-1 rounded flex items-center gap-1"
                        >
                            {topic}
                            <button
                                type="button"
                                onClick={() => handleRemoveTopic(topic)}
                                className="text-red-500 font-bold"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
                {initialData ? "Update Snippet" : "Create Snippet"}
            </button>
        </form>
    );
}
