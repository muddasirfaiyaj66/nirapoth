import { api } from "./apiClient";

// Types
export interface Fine {
  id: string;
  violationId: string;
  amount: number;
  status: "UNPAID" | "PAID" | "CANCELLED" | "DISPUTED";
  dueDate?: string;
  issuedAt: string;
  paidAt?: string;
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
      owner?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      };
      driver?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      };
    };
    location?: {
      id: string;
      address: string;
      city: string;
      district: string;
    };
  };
  payments?: Array<{
    id: string;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
    paidAt: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
}

export interface FineStats {
  totalFines: number;
  unpaidFines: number;
  paidFines: number;
  cancelledFines: number;
  disputedFines: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  monthlyStats: Array<{
    issuedAt: string;
    _count: { id: number };
    _sum: { amount: number };
  }>;
  statusDistribution: Array<{
    status: string;
    _count: { id: number };
    _sum: { amount: number };
  }>;
}

export interface CreateFineData {
  violationId: string;
  amount: number;
  dueDate?: string;
}

export interface UpdateFineData {
  amount?: number;
  status?: "UNPAID" | "PAID" | "CANCELLED" | "DISPUTED";
  dueDate?: string;
}

export interface FineSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  vehiclePlate?: string;
  dateFrom?: string;
  dateTo?: string;
}

// API functions
export const fineApi = {
  // Get all fines with pagination and filtering
  getAllFines: async (params?: FineSearchParams) => {
    return await api.get<{
      fines: Fine[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/fines", { params });
  },

  // Get fine by ID
  getFineById: async (fineId: string) => {
    return await api.get<Fine>(`/fines/${fineId}`);
  },

  // Get fine statistics
  getFineStats: async () => {
    return await api.get<FineStats>("/fines/stats");
  },

  // Get overdue fines
  getOverdueFines: async () => {
    return await api.get<Fine[]>("/fines/overdue");
  },

  // Get user's fines
  getMyFines: async () => {
    return await api.get<Fine[]>("/fines/my-fines");
  },

  // Create new fine
  createFine: async (data: CreateFineData) => {
    return await api.post<Fine>("/fines", data);
  },

  // Update fine
  updateFine: async (fineId: string, data: UpdateFineData) => {
    return await api.put<Fine>(`/fines/${fineId}`, data);
  },

  // Delete fine
  deleteFine: async (fineId: string) => {
    return await api.delete(`/fines/${fineId}`);
  },
};

