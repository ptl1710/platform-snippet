import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { slug } = await params;
        const tag = await prisma.tag.findUnique({
            where: { slug },
            include: {
                snippets: {
                    include: {
                        author: { select: { id: true, username: true, avatarUrl: true } },
                        topics: true,
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!tag) {
            return NextResponse.json({ error: "Tags not found" }, { status: 404 });
        }

        return NextResponse.json(tag);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}