import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/", "/snippets", "/profile"];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value || null;
    const { pathname } = req.nextUrl;

    if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token && pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/snippets", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/snippets/:path*", "/profile/:path*", "/auth/:path*"],
};
