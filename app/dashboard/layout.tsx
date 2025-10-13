import type React from "react";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthInitializer>
          <div className="flex h-screen bg-background dashboard-container">
            <DashboardSidebar />
            <main className="flex-1 overflow-y-auto hide-scrollbar">
              <div className="container mx-auto p-6">{children}</div>
            </main>
          </div>
          <Toaster richColors position="top-right" />
        </AuthInitializer>
      </QueryProvider>
    </ReduxProvider>
  );
}
