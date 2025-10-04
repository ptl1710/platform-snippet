import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: { select: { snippets: true } },
            },
        });

        return NextResponse.json(tags);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}