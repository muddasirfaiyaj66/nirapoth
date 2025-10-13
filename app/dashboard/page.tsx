"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RoleBasedDashboard } from "@/components/dashboard/RoleBasedDashboard";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <RoleBasedDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
