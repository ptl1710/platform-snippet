import { verifyToken } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";

export async function getCurrentUser(req: Request) {
    const auth = req.headers.get("authorization");
    if (!auth) return null;

    const token = auth.split(" ")[1];
    if (!token) return null;

    const payload = verifyToken(token) as { id: string; email: string } | null;
    if (!payload) return null;

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    return user;
}
