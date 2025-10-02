// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/app/lib/db";

export async function GET(req: Request) {
    try {
        const auth = req.headers.get("authorization");
        if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });
        console.log("Auth Header:", auth);
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        console.log("Decoded Token:", decoded);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { snippets: true },
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json(user);
    } catch (err) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
