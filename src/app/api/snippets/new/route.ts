import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/currentUser";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.log("Authenticated user:", user);

        const { title, description, code, language, tags } = await req.json();

        const snippet = await prisma.snippet.create({
            data: {
                title,
                description,
                code,
                language,
                authorId: user.id,
                topics: {
                    connectOrCreate: tags?.map((tag: string) => ({
                        where: { slug: tag.toLowerCase() },
                        create: { name: tag, slug: tag.toLowerCase() },
                    })),
                },
            },
        });

        return NextResponse.json(snippet);
    } catch (error) {
        console.error("Create snippet error:", error);
        return NextResponse.json({ error: "Failed to create snippet" }, { status: 500 });
    }
}
