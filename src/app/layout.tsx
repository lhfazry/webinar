import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Rumah Coding | Technical Webinar Series",
    description:
        "Join our expert-led sessions on the latest technologies, architectures, and best practices in software engineering.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased min-h-screen bg-gray-50">
                {children}
            </body>
        </html>
    );
}
