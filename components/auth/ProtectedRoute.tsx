"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, getCurrentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading && !isAuthenticated) {
        // Try to get current user to check if we have a valid session
        const result = await getCurrentUser();
        if (!result.success) {
          router.push("/login");
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, getCurrentUser, router]);

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

  return <>{children}</>;
}
