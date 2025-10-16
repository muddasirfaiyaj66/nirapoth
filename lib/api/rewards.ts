import { api } from "./apiClient";

// Types
export interface RewardTransaction {
  id: string;
  userId: string;
  amount: number;
  type: "REWARD" | "PENALTY" | "BONUS" | "DEDUCTION";
  source: "CITIZEN_REPORT" | "VIOLATION" | "FINE_PAYMENT" | "SYSTEM";
  relatedReportId?: string;
  relatedViolationId?: string;
  description: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  processedAt?: string;
}

export interface RewardBalance {
  userId: string;
  totalEarned: number;
  totalPenalties: number;
  currentBalance: number;
  pendingRewards: number;
  withdrawableAmount: number;
  lastUpdated: string;
}

export interface RewardStats {
  totalTransactions: number;
  totalEarned: number;
  totalPenalties: number;
  netBalance: number;
  approvedReports: number;
  rejectedReports: number;
  averageReward: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  transactionsByType: {
    type: string;
    count: number;
    total: number;
  }[];
  earningsTrend: {
    month: string;
    earnings: number;
    penalties: number;
    net: number;
  }[];
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  method: "BANK_TRANSFER" | "MOBILE_BANKING" | "CASH";
  accountDetails: any;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
}

export interface CreateWithdrawalData {
  amount: number;
  method: "BANK_TRANSFER" | "MOBILE_BANKING" | "CASH";
  accountDetails: {
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    mobileNumber?: string;
  };
}

export interface RewardSearchParams {
  page?: number;
  limit?: number;
  type?: string;
  source?: string;
  dateFrom?: string;
  dateTo?: string;
}

// API functions
export const rewardApi = {
  // Get reward balance
  getMyBalance: async () => {
    return await api.get<RewardBalance>("/rewards/balance");
  },

  // Get reward transactions
  getMyTransactions: async (params?: RewardSearchParams) => {
    return await api.get<{
      transactions: RewardTransaction[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/rewards/transactions", { params });
  },

  // Get reward statistics
  getMyStats: async () => {
    return await api.get<RewardStats>("/rewards/stats");
  },

  // Request withdrawal
  requestWithdrawal: async (data: CreateWithdrawalData) => {
    return await api.post<WithdrawalRequest>("/rewards/withdraw", data);
  },

  // Get withdrawal requests
  getMyWithdrawals: async () => {
    return await api.get<WithdrawalRequest[]>("/rewards/withdrawals");
  },

  // Cancel withdrawal request
  cancelWithdrawal: async (withdrawalId: string) => {
    return await api.delete(`/rewards/withdrawals/${withdrawalId}`);
  },

  // ADMIN: Get all transactions
  getAllTransactions: async (params?: RewardSearchParams) => {
    return await api.get<{
      transactions: RewardTransaction[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/admin/rewards/transactions", { params });
  },

  // ADMIN: Get all withdrawal requests
  getAllWithdrawals: async (status?: string) => {
    return await api.get<WithdrawalRequest[]>("/admin/rewards/withdrawals", {
      params: { status },
    });
  },

  // ADMIN: Process withdrawal
  processWithdrawal: async (
    withdrawalId: string,
    data: {
      status: "APPROVED" | "REJECTED" | "COMPLETED";
      notes?: string;
    }
  ) => {
    return await api.put<WithdrawalRequest>(
      `/admin/rewards/withdrawals/${withdrawalId}`,
      data
    );
  },

  // ADMIN: Get reward statistics
  getAdminStats: async () => {
    return await api.get<{
      totalRewardsDistributed: number;
      totalPenaltiesCollected: number;
      pendingWithdrawals: number;
      pendingWithdrawalAmount: number;
      totalUsers: number;
      activeUsers: number;
      avgRewardPerReport: number;
      distributionByType: { type: string; amount: number; count: number }[];
      monthlyTrend: { month: string; rewards: number; penalties: number }[];
    }>("/admin/rewards/stats");
  },

  // ADMIN: Manual reward/penalty
  createManualTransaction: async (data: {
    userId: string;
    amount: number;
    type: "REWARD" | "PENALTY" | "BONUS" | "DEDUCTION";
    description: string;
  }) => {
    return await api.post<RewardTransaction>("/admin/rewards/manual", data);
  },
};
