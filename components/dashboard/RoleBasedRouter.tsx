"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/loading-skeleton";

interface RoleBasedRouterProps {
  children: React.ReactNode;
}

export function RoleBasedRouter({ children }: RoleBasedRouterProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const currentPath = window.location.pathname;
      const userRole = user.role;

      // Define role-based dashboard paths
      const rolePaths = {
        ADMIN: "/dashboard/admin",
        SUPER_ADMIN: "/dashboard/admin",
        POLICE: "/dashboard/police",
        CITIZEN: "/dashboard",
        CITY_CORPORATION: "/dashboard/city-corporation",
        FIRE_SERVICE: "/dashboard/police", // Fire service uses police dashboard for now
      };

      const expectedPath = rolePaths[userRole as keyof typeof rolePaths];

      // If user is on a role-specific dashboard that doesn't match their role, redirect
      if (
        expectedPath &&
        currentPath.startsWith("/dashboard/") &&
        !currentPath.startsWith(expectedPath)
      ) {
        router.replace(expectedPath);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            Please log in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
