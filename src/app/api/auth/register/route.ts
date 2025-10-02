import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { hashPassword, generateToken } from "@/app/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, username, name } = await req.json();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        username,
        name,
      },
    });

    const token = generateToken({ id: user.id, email: user.email });

    return NextResponse.json({ token, user });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
