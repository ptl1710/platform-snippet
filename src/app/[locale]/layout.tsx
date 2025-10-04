import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import "../globals.css";
import Header from "../components/Header";

export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    let messages;
    try {
        messages = (await import(`../../../messages/${locale}.json`)).default;
    } catch {
        notFound();
    }

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <html>
                <body className="bg-gray-50 min-h-screen">
                    <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-1 container mx-auto px-4 py-6">
                            {children}
                        </main>

                        <footer className="bg-gray-100 text-center py-4 border-t">
                            <p className="text-sm text-gray-500">
                                © {new Date().getFullYear()} CodeShare. All rights reserved.
                            </p>
                        </footer>
                    </div>
                </body>
            </html>
        </NextIntlClientProvider>
    );
}
