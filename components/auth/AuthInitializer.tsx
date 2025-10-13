"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const { getCurrentUser, isLoading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state on app startup
    const initializeAuth = async () => {
      try {
        await getCurrentUser();
      } catch (error) {
        // If getCurrentUser fails, user is not authenticated
        // This is expected behavior, so we don't need to handle the error
        console.log("User not authenticated");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [getCurrentUser]);

  // Show loading only during initial auth check, not during subsequent loading states
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
