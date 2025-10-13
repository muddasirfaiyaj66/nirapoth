import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BangladeshiBackground } from "@/components/bangladeshi-background";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NiraPoth - AI-Powered Road Safety Platform",
  description:
    "Improving road safety through AI monitoring, citizen participation, and transparent enforcement",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased dark`}>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ReduxProvider>
          <QueryProvider>
            <AuthInitializer>
              <ConditionalLayout>{children}</ConditionalLayout>
            </AuthInitializer>
            <Toaster />
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
