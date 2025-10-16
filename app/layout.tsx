import type React from "react";
import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BangladeshiBackground } from "@/components/bangladeshi-background";
import { DottedWaveBackground } from "@/components/dotted-wave-background";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { ErrorBoundaryProvider } from "@/components/providers/ErrorBoundaryProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo-2",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

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
    <html
      lang="en"
      className={`${exo2.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <DottedWaveBackground />
        <ErrorBoundaryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReduxProvider>
              <QueryProvider>
                <AuthInitializer>
                  <ConditionalLayout>{children}</ConditionalLayout>
                </AuthInitializer>
                <Toaster />
              </QueryProvider>
            </ReduxProvider>
          </ThemeProvider>
        </ErrorBoundaryProvider>
        <Analytics />
      </body>
    </html>
  );
}
