"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { AdminDashboard } from "./role-based/AdminDashboard";
import { PoliceDashboard } from "./role-based/PoliceDashboard";
import { CitizenDashboard } from "./role-based/CitizenDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function RoleBasedDashboard() {
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

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return <AdminDashboard user={user} />;

    case "POLICE":
      return <PoliceDashboard user={user} />;

    case "CITIZEN":
    case "DRIVER":
    case "FIRE_SERVICE":
      return <CitizenDashboard user={user} />;

    default:
      return (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Unknown Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your role "{user.role}" is not recognized. Please contact support.
            </p>
          </CardContent>
        </Card>
      );
  }
}
