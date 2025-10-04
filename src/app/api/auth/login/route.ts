import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const url = new URL(req.url);
        const locale =
            req.headers.get("Content-Language") ||
            url.searchParams.get("locale") ||
            "vi";

        const messages = (await import(`../../../../../messages/${locale}.json`)).default;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json(
                { error: messages.Auth.invalid_credentials || "Invalid credentials" },
                { status: 401 }
            );
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return NextResponse.json(
                { error: messages.Auth.wrong_password || "Wrong password" },
                { status: 401 }
            );
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        const res = NextResponse.json({
            message: messages.Auth.login_success || "Login successful",
            token,
        });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return res;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
