import { cookies } from 'next/headers';
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        const { title, description, code, language, topics } = await req.json();

        const snippet = await prisma.snippet.create({
            data: {
                title,
                description,
                code,
                language,
                authorId: decoded.userId,
                topics: {
                    connectOrCreate: topics?.map((tag: string) => ({
                        where: { slug: tag.toLowerCase() },
                        create: { name: tag, slug: tag.toLowerCase() },
                    })),
                },
            },
        });

        return NextResponse.json(snippet);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create snippet" }, { status: 500 });
    }
}
