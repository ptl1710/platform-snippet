import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { locale } = await req.json();

        if (!["vi", "en"].includes(locale)) {
            return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
        }

        const res = NextResponse.json({ success: true });

        res.cookies.set("NEXT_LOCALE", locale, {
            path: "/",
            maxAge: 365 * 24 * 60 * 60, // 1 năm
        });

        return res;
    } catch (err) {
        return NextResponse.json({ error: "Failed to set locale" }, { status: 500 });
    }
}
