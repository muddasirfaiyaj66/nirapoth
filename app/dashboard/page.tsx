"use client";

import { RoleBasedRouter } from "@/components/dashboard/RoleBasedRouter";
import { AdvancedDashboard } from "@/components/dashboard/AdvancedDashboard";

export default function DashboardPage() {
  return (
    <RoleBasedRouter>
      <AdvancedDashboard />
    </RoleBasedRouter>
  );
}
