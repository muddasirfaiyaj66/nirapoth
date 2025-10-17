import { api } from "./apiClient";

// Types
export interface OutstandingDebt {
  id: string;
  userId: string;
  originalAmount: number;
  currentAmount: number;
  lateFees: number;
  dueDate: string;
  lastPenaltyDate?: string;
  weeksPastDue: number;
  status: "OUTSTANDING" | "PAID" | "WAIVED" | "PARTIAL";
  paidAmount: number;
  paidAt?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DebtPaymentData {
  debtId: string;
  amount: number;
  paymentMethod: "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY" | "ONLINE";
  paymentReference?: string;
}

export interface DebtSummary {
  debts: OutstandingDebt[];
  totalDebt: number;
  totalLateFees: number;
  debtCount: number;
  oldestDueDate: string | null;
}

// API Methods
export const debtApi = {
  // Get user's outstanding debts
  getMyDebts: async () => {
    const response = await api.get<DebtSummary>("/rewards/debts");
    return response;
  },

  // Get total debt amount
  getTotalDebt: async () => {
    const response = await api.get<{ totalDebt: number }>(
      "/rewards/debts/total"
    );
    return response;
  },

  // Pay a debt
  payDebt: async (data: DebtPaymentData) => {
    const response = await api.post<OutstandingDebt>("/rewards/pay-debt", data);
    return response;
  },

  // Get debt details
  getDebtDetails: async (debtId: string) => {
    const response = await api.get<OutstandingDebt>(`/rewards/debts/${debtId}`);
    return response;
  },
};
