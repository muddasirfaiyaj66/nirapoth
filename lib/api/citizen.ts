import { api } from "./apiClient";

export interface CitizenViolation {
  id: string;
  plateNo: string;
  violation: string;
  fineAmount: number;
  date: string;
  status: string;
  fineId: string;
}

export interface CitizenVehicle {
  id: string;
  plateNo: string;
  brand: string;
  model: string;
  year: number;
  isActive: boolean;
}

export interface CitizenStats {
  totalVehicles: number;
  activeVehicles: number;
  totalViolations: number;
  pendingViolations: number;
  totalFines: number;
  paidFines: number;
  unpaidFines: number;
  submittedComplaints: number;
  resolvedComplaints: number;
  totalRewards: number;
  recentViolations: CitizenViolation[];
  myVehicles: CitizenVehicle[];
}

export interface CitizenAnalytics {
  currentBalance: number;
  totalRewards: number;
  totalPenalties: number;
  totalReports: number;
  approvedReports: number;
  violationsOverview: Array<{ month: string; count: number }>;
  finesAnalytics: Array<{
    month: string;
    total: number;
    paid: number;
    unpaid: number;
  }>;
  rewardsOverTime: Array<{
    month: string;
    rewards: number;
    penalties: number;
    net: number;
  }>;
  violationsByType: Array<{ type: string; count: number }>;
  recentActivity: Array<{
    id: string;
    type: "fine" | "reward";
    description: string;
    amount: number;
    status: string;
    date: Date;
    vehicle?: string;
  }>;
}

export const citizenApi = {
  // Get citizen dashboard statistics
  getStats: async () => {
    return await api.get<CitizenStats>("/citizen/stats");
  },

  // Get citizen analytics with graph data
  getAnalytics: async () => {
    return await api.get<CitizenAnalytics>("/citizen/analytics");
  },
};
