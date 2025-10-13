"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleBasedDashboard } from "@/components/dashboard/RoleBasedDashboard";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <RoleBasedDashboard />
    </ProtectedRoute>
  );
}
