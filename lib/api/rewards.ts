import { api } from "./apiClient";

// Types
export interface RewardTransaction {
  id: string;
  userId: string;
  amount: number;
  type: "REWARD" | "PENALTY" | "BONUS" | "DEDUCTION" | "DEBT_PAYMENT"; // ⭐ Added DEBT_PAYMENT
  source:
    | "CITIZEN_REPORT"
    | "VIOLATION"
    | "FINE_PAYMENT"
    | "DEBT_PAYMENT"
    | "SYSTEM"; // ⭐ Added DEBT_PAYMENT
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
  totalFinePayments: number; // ⭐ NEW: Fine payments (traffic violations)
  totalOutstandingDebt: number; // ⭐ Outstanding debt (unpaid)
  totalDebtPayments: number; // ⭐ Debt payments made
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
    const response = await api.get<RewardBalance>("/rewards/balance");
    return response.data as RewardBalance;
  },

  // Get reward transactions
  getMyTransactions: async (params?: RewardSearchParams) => {
    const response = await api.get<{
      transactions: RewardTransaction[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/rewards/transactions", { params });
    // The api wrapper returns { success, data }, so response.data is already the unwrapped data
    return response.data as {
      transactions: RewardTransaction[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  },

  // Get reward statistics
  getMyStats: async () => {
    const response = await api.get<RewardStats>("/rewards/stats");
    return response.data as RewardStats;
  },

  // Request withdrawal
  requestWithdrawal: async (data: CreateWithdrawalData) => {
    const response = await api.post<WithdrawalRequest>(
      "/rewards/withdraw",
      data
    );
    return response.data as WithdrawalRequest;
  },

  // Get withdrawal requests
  getMyWithdrawals: async () => {
    const response = await api.get<WithdrawalRequest[]>("/rewards/withdrawals");
    return response.data as WithdrawalRequest[];
  },

  // Cancel withdrawal request
  cancelWithdrawal: async (withdrawalId: string) => {
    const response = await api.delete(`/rewards/withdrawals/${withdrawalId}`);
    return response.data;
  },

  // ADMIN: Get all transactions
  getAllTransactions: async (params?: RewardSearchParams) => {
    const response = await api.get<{
      transactions: RewardTransaction[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/admin/rewards/transactions", { params });
    // The api wrapper returns { success, data }, so response.data is already the unwrapped data
    return response.data as {
      transactions: RewardTransaction[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  },

  // ADMIN: Get all withdrawal requests
  getAllWithdrawals: async (status?: string) => {
    const response = await api.get<WithdrawalRequest[]>(
      "/admin/rewards/withdrawals",
      {
        params: { status },
      }
    );
    return response.data as WithdrawalRequest[];
  },

  // ADMIN: Process withdrawal
  processWithdrawal: async (
    withdrawalId: string,
    data: {
      status: "APPROVED" | "REJECTED" | "COMPLETED";
      notes?: string;
    }
  ) => {
    const response = await api.put<WithdrawalRequest>(
      `/admin/rewards/withdrawals/${withdrawalId}`,
      data
    );
    return response.data as WithdrawalRequest;
  },

  // ADMIN: Get reward statistics
  getAdminStats: async () => {
    const response = await api.get<{
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
    return response.data;
  },

  // ADMIN: Manual reward/penalty
  createManualTransaction: async (data: {
    userId: string;
    amount: number;
    type: "REWARD" | "PENALTY" | "BONUS" | "DEDUCTION";
    description: string;
  }) => {
    const response = await api.post<RewardTransaction>(
      "/admin/rewards/manual",
      data
    );
    return response.data as RewardTransaction;
  },
};
