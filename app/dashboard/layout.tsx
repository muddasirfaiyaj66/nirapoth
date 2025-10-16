import type React from "react";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { NotificationContainer } from "@/components/notifications/NotificationContainer";

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
            <div className="flex-1 flex flex-col overflow-hidden">
              <DashboardHeader />
              <main className="flex-1 overflow-y-auto hide-scrollbar">
                <div className="container mx-auto p-6">{children}</div>
              </main>
            </div>
          </div>
          <NotificationContainer />
          <Toaster richColors position="top-right" />
        </AuthInitializer>
      </QueryProvider>
    </ReduxProvider>
  );
}
