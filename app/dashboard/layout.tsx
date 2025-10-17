"use client";

import type React from "react";
import { useState } from "react";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { NotificationContainer } from "@/components/notifications/NotificationContainer";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-background dashboard-container overflow-hidden">
      <DashboardSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        <DashboardHeader onMobileMenuToggle={toggleMobileMenu} />
        <main className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="container mx-auto p-3 sm:p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthInitializer>
          <DashboardLayoutContent>{children}</DashboardLayoutContent>
          <NotificationContainer />
          <Toaster richColors position="top-right" />
        </AuthInitializer>
      </QueryProvider>
    </ReduxProvider>
  );
}
