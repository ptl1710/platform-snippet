import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snippets = await prisma.snippet.findMany({
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        topics: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(snippets);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, code, language, authorId, tags } = await req.json();

    if (!title || !code || !language || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const snippet = await prisma.snippet.create({
      data: {
        title,
        description,
        code,
        language,
        authorId,
        topics: {
          connectOrCreate: tags?.map((tag: string) => ({
            where: { slug: tag.toLowerCase() },
            create: { name: tag, slug: tag.toLowerCase() },
          })),
        },
      },
      include: { topics: true, author: true },
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
