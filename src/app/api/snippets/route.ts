import jwt from 'jsonwebtoken';
import { prisma } from "@/app/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };


    const snippets = await prisma.snippet.findMany({
      where: { authorId: decoded.userId },
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true }
        },
        topics: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(snippets);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
