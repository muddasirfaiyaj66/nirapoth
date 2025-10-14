import { api } from "./apiClient";

// Types
export interface Violation {
  id: string;
  ruleId: string;
  vehicleId: string;
  locationId?: string;
  description?: string;
  status: "PENDING" | "CONFIRMED" | "DISPUTED" | "RESOLVED";
  evidenceUrl?: string;
  createdAt: string;
  updatedAt: string;
  rule?: {
    id: string;
    code: string;
    title: string;
    description: string;
    penalty?: number;
    isActive: boolean;
  };
  vehicle?: {
    id: string;
    plateNo: string;
    brand: string;
    model: string;
    owner?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    driver?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  location?: {
    id: string;
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    district?: string;
    division?: string;
  };
  fine?: {
    id: string;
    amount: number;
    status: "UNPAID" | "PAID" | "CANCELLED" | "DISPUTED";
    dueDate?: string;
    issuedAt: string;
    paidAt?: string;
  };
}

export interface Rule {
  id: string;
  code: string;
  title: string;
  description: string;
  penalty?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
}

export interface CreateViolationData {
  ruleId: string;
  vehicleId: string;
  locationId?: string;
  description?: string;
  evidenceUrl?: string;
}

export interface UpdateViolationStatusData {
  status: "PENDING" | "CONFIRMED" | "DISPUTED" | "RESOLVED";
  notes?: string;
}

export interface CreateFineData {
  violationId: string;
  amount: number;
  dueDate?: string;
}

export interface CreateRuleData {
  code: string;
  title: string;
  description: string;
  penalty?: number;
}

export interface ViolationSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  vehiclePlate?: string;
}

export interface ViolationStats {
  totalViolations: number;
  pendingViolations: number;
  confirmedViolations: number;
  disputedViolations: number;
  resolvedViolations: number;
  totalFines: number;
  paidFines: number;
  unpaidFines: number;
  totalRevenue: number;
}

// API functions
export const violationApi = {
  // Get all violations with pagination and filtering
  getAllViolations: async (params?: ViolationSearchParams) => {
    return await api.get("/violations", { params });
  },

  // Get violation by ID
  getViolationById: async (violationId: string) => {
    return await api.get(`/violations/${violationId}`);
  },

  // Create new violation
  createViolation: async (data: CreateViolationData) => {
    return await api.post("/violations", data);
  },

  // Update violation status
  updateViolationStatus: async (
    violationId: string,
    data: UpdateViolationStatusData
  ) => {
    return await api.put(`/violations/${violationId}/status`, data);
  },

  // Create fine for violation
  createFine: async (violationId: string, data: CreateFineData) => {
    return await api.post(`/violations/${violationId}/fine`, data);
  },

  // Get all rules
  getAllRules: async () => {
    return await api.get("/violations/rules");
  },

  // Create new rule
  createRule: async (data: CreateRuleData) => {
    return await api.post("/violations/rules", data);
  },

  // Update rule (including toggle active status)
  updateRule: async (
    ruleId: string,
    data: Partial<CreateRuleData> & { isActive?: boolean }
  ) => {
    return await api.put(`/violations/rules/${ruleId}`, data);
  },

  // Delete rule
  deleteRule: async (ruleId: string) => {
    return await api.delete(`/violations/rules/${ruleId}`);
  },

  // Get violation statistics
  getViolationStats: async () => {
    return await api.get<ViolationStats>("/violations/stats");
  },
};
