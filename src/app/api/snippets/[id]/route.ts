import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    params: { id: string };
};

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const snippet = await prisma.snippet.findUnique({
            where: { id: params.id },
            include: { author: true, topics: true },
        });

        if (!snippet) {
            return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
        }

        return NextResponse.json(snippet);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: Params) {
    try {
        const { title, description, code, language, visibility, tags } = await req.json();

        const updated = await prisma.snippet.update({
            where: { id: params.id },
            data: {
                title,
                description,
                code,
                language,
                visibility,
                topics: tags
                    ? {
                        set: [],
                        connectOrCreate: tags.map((tag: string) => ({
                            where: { slug: tag.toLowerCase() },
                            create: { name: tag, slug: tag.toLowerCase() },
                        })),
                    }
                    : undefined,
            },
            include: { topics: true, author: true },
        });

        return NextResponse.json(updated);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        await prisma.snippet.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "Snippet deleted" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}
