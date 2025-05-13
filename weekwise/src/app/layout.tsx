import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import UserPreferences from "./userpreferences/page";
import { UserProvider } from "@/contexts/UserContext";
// Add this at the bottom of your JSX (e.g., in <UserPreferences /> or layout)
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "WeekWise",
    description: "Weekly todos",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <UserProvider>{children}</UserProvider>
                <Toaster position="bottom-right" />;
            </body>
        </html>
    );
}
