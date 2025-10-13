"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BangladeshiBackground } from "@/components/bangladeshi-background";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Routes that should not have header and footer
  const dashboardRoutes = ["/dashboard"];
  const isDashboardRoute = dashboardRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isDashboardRoute) {
    // For dashboard routes, only render children without header/footer
    return <>{children}</>;
  }

  // For all other routes, render with header and footer
  return (
    <>
      <BangladeshiBackground />
      <Header />
      {children}
      <Footer />
    </>
  );
}
