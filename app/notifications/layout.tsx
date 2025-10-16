import type React from "react";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { Header } from "@/components/header";

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthInitializer>
          <Header />
          {children}
        </AuthInitializer>
      </QueryProvider>
    </ReduxProvider>
  );
}
