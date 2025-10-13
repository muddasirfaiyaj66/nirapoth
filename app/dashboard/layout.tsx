import type React from "react";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthInitializer>{children}</AuthInitializer>
        <Toaster />
      </QueryProvider>
    </ReduxProvider>
  );
}
