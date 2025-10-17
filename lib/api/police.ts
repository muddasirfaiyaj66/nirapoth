import { api } from "./apiClient";

export interface PoliceViolation {
  id: string;
  plateNo: string;
  vehicleInfo: string;
  violation: string;
  penalty: number;
  status: string;
  date: Date;
}

export interface PoliceStats {
  assignedViolations: number;
  pendingViolations: number;
  resolvedViolations: number;
  totalFinesIssued: number;
  unpaidFines: number;
  paidFines: number;
  pendingReports: number;
  approvedReports: number;
  recentViolations: PoliceViolation[];
}

export interface PoliceAnalytics {
  violationsByMonth: Array<{ month: string; count: number }>;
  finesByStatus: Array<{
    status: string;
    count: number;
    totalAmount: number;
  }>;
  violationsByType: Array<{ type: string; count: number }>;
  reportsByStatus: Array<{ status: string; count: number }>;
}

export const policeApi = {
  getStats: async () => {
    return await api.get<PoliceStats>("/police/stats");
  },
  getAnalytics: async () => {
    return await api.get<PoliceAnalytics>("/police/analytics");
  },
};
