"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2, Shield } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminProtectedRoute({
  children,
  fallback,
}: AdminProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, getCurrentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading) {
        if (!isAuthenticated) {
          // Try to get current user first
          const result = await getCurrentUser();
          if (!result.success) {
            router.push("/login");
            return;
          }
        }

        // Check if user has admin role
        if (user && !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
          router.push("/dashboard"); // Redirect to regular dashboard
          return;
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, user, getCurrentUser, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="h-16 w-16 mx-auto text-red-500" />
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-muted-foreground">
            Current role: {user?.role || "Unknown"}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
