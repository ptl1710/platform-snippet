import { prisma } from "@/app/lib/db";
import Link from "next/link";

export default async function TagsPage() {
    const tags = await prisma.tag.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: { select: { snippets: true } },
        },
    });

    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">All Tags</h1>

            {tags.length === 0 && (
                <p className="text-gray-600">Chưa có tag nào.</p>
            )}

            <div className="flex flex-wrap gap-3">
                {tags.map((tag : any) => (
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
        </main>
    );
}
