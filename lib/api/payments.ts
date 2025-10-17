import { api } from "./apiClient";

// Types
export interface Payment {
  id: string;
  userId: string;
  fineId: string;
  amount: number;
  transactionId?: string;
  paymentMethod: "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY" | "ONLINE";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  method?: string;
  status?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  fine?: {
    id: string;
    amount: number;
    status: "UNPAID" | "PAID" | "CANCELLED" | "DISPUTED";
    dueDate?: string;
    issuedAt: string;
    paidAt?: string;
    violation?: {
      id: string;
      rule?: {
        id: string;
        title: string;
        description: string;
      };
      vehicle?: {
        plateNo: string;
        brand: string;
        model: string;
      };
    };
  };
}

export interface UnpaidFine {
  id: string;
  violationId: string;
  amount: number;
  status: "UNPAID";
  dueDate?: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
  violation?: {
    id: string;
    rule?: {
      id: string;
      title: string;
      description: string;
    };
    vehicle?: {
      plateNo: string;
      brand: string;
      model: string;
    };
  };
}

export interface CreatePaymentData {
  fineId: string;
  amount: number;
  paymentMethod: "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY" | "ONLINE";
  transactionId?: string;
}

export interface UpdatePaymentStatusData {
  paymentId: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  notes?: string;
}

export interface PaymentSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  method?: string;
}

export interface PaymentStats {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  totalRevenue: number;
  paymentMethodStats: Array<{
    paymentMethod: string;
    _count: { id: number };
    _sum: { amount: number };
  }>;
}

// API functions
export const paymentApi = {
  // Get all payments with pagination and filtering
  getAllPayments: async (params?: PaymentSearchParams) => {
    return await api.get<{
      payments: Payment[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>("/payments", { params });
  },

  // Get user's payments
  getMyPayments: async () => {
    return await api.get<Payment[]>("/payments/my-payments");
  },

  // Get user's unpaid fines
  getUnpaidFines: async () => {
    return await api.get<UnpaidFine[]>("/payments/unpaid-fines");
  },

  // Get payment by ID
  getPaymentById: async (paymentId: string) => {
    return await api.get<Payment>(`/payments/${paymentId}`);
  },

  // Create new payment
  createPayment: async (data: CreatePaymentData) => {
    return await api.post<Payment>("/payments", data);
  },

  // Update payment status
  updatePaymentStatus: async (data: UpdatePaymentStatusData) => {
    return await api.put<Payment>("/payments/status", data);
  },

  // Get payment statistics
  getPaymentStats: async () => {
    return await api.get<PaymentStats>("/payments/stats");
  },

  // Initialize online payment with SSLCommerz
  initOnlinePayment: async (data: {
    fineId?: string;
    fineIds?: string[];
    amount: number;
  }) => {
    return await api.post<{
      gatewayPageURL: string;
      sessionKey: string;
      transactionId: string;
    }>("/payments/init-online", data);
  },

  // Query transaction status
  queryTransaction: async (transactionId: string) => {
    return await api.get(`/payments/transaction/${transactionId}`);
  },

  // Verify transaction against database (authoritative)
  verifyTransaction: async (transactionId: string) => {
    return await api.get<{
      verified: boolean;
      paymentStatus?: string;
      fineStatus?: string;
      reason?: string;
    }>(`/payments/verify/${transactionId}`);
  },
};
