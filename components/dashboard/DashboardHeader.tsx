"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

export function DashboardHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.includes("/violations")) return "Violations";
    if (pathname.includes("/users")) return "Users";
    if (pathname.includes("/rewards")) return "Rewards";
    if (pathname.includes("/fines")) return "Fines";
    if (pathname.includes("/debt")) return "Debt Management";
    if (pathname.includes("/reports")) return "My Reports";
    if (pathname.includes("/vehicles")) return "Vehicles";
    if (pathname.includes("/analytics")) return "Analytics";
    if (pathname.includes("/settings")) return "Settings";
    if (pathname.includes("/notifications")) return "Notifications";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex flex-1 items-center gap-4">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {user && <NotificationDropdown />}
      </div>
    </header>
  );
}
