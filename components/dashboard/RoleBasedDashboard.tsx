"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { AdminDashboard } from "./role-based/AdminDashboard";
import { PoliceDashboard } from "./role-based/PoliceDashboard";
import { CitizenDashboard } from "./role-based/CitizenDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function RoleBasedDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please log in to access the dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Render children for authenticated users
  return <>{children}</>;
}
