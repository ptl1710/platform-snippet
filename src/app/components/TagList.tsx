import Link from "next/link";

type TagListProps = {
    tags: {
        id: string;
        name: string;
        slug: string;
    }[];
};

export default function TagList({ tags }: TagListProps) {
    if (!tags || tags.length === 0) {
        return <p className="text-gray-500">No tags available.</p>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition"
                >
                    {tag.name}
                </Link>
            ))}
        </div>
    );
}
