import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["vi", "en"];
const defaultLocale = "vi";

const protectedRoutes = ["/profile", "/snippets/create"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;
    const currentLocale = req.cookies.get("NEXT_LOCALE")?.value || defaultLocale;
    if (pathname === "/" || pathname === "") {
        if (!token) {
            return NextResponse.redirect(new URL(`/${currentLocale}/login`, req.url));
        } else {
            return NextResponse.redirect(new URL(`/${currentLocale}/snippets`, req.url));
        }
    }

    const segments = pathname.split("/").filter(Boolean);
    const locale = segments[0];

    if (!locales.includes(locale)) {
        return NextResponse.redirect(new URL(`/${currentLocale}${pathname}`, req.url));
    }

    const routeWithoutLocale = "/" + segments.slice(1).join("/");

    if (!token && protectedRoutes.some((r) => routeWithoutLocale === r)) {
        return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }

    if (token && ["/login", "/register"].includes(routeWithoutLocale)) {
        return NextResponse.redirect(new URL(`/${locale}/snippets`, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
