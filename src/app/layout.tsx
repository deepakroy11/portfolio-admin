import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import SidebarWrapper from "@/components/SidebarWrapper";
import SessionWrapper from "@/components/SessionWrapper";
import TopBar from "@/components/TopBar";
import { ThemeProvider } from "@/context/themeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio | Admin",
  description: "Manage the content of Portfolio site from this app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SessionWrapper>
            <div className="min-h-screen flex bg-background">
              <SidebarWrapper />
              <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
              </div>
            </div>
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
