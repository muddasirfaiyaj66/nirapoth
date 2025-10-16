import { api } from "./apiClient";

// Types
export interface UserVerification {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  nidNo?: string;
  birthCertificateNo?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleManagement {
  role: string;
  count: number;
  description: string;
  permissions: string[];
}

export interface BlockedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isBlocked: boolean;
  blockedAt: string;
  blockedBy?: string;
  blockReason?: string;
  createdAt: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
  errors?: string[];
}

// Admin API functions
export const adminApi = {
  // User Verification
  getPendingVerifications: async (params?: {
    page?: number;
    limit?: number;
    status?: "PENDING" | "VERIFIED" | "REJECTED";
  }) => {
    const response = await api.get<{
      users: UserVerification[];
      pagination: PaginationData;
    }>("/admin/users/verification", { params });
    return response;
  },

  verifyUser: async (userId: string, verified: boolean) => {
    const response = await api.post<UserVerification>("/admin/users/verify", {
      userId,
      verified,
    });
    return response;
  },

  // Role Management
  getRoleManagement: async () => {
    const response = await api.get<RoleManagement[]>("/admin/users/roles");
    return response;
  },

  // Blocked Users
  getBlockedUsers: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<{
      users: BlockedUser[];
      pagination: PaginationData;
    }>("/admin/users/blocked", { params });
    return response;
  },

  unblockUser: async (userId: string) => {
    const response = await api.post<BlockedUser>("/admin/users/unblock", {
      userId,
    });
    return response;
  },

  // User Management
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) => {
    const response = await api.get<{
      users: any[];
      pagination: PaginationData;
    }>("/admin/users", { params });
    return response;
  },

  createUser: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    password: string;
    nidNo?: string;
    birthCertificateNo?: string;
  }) => {
    const response = await api.post("/admin/users/create", userData);
    return response;
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await api.post("/admin/users/update-role", {
      userId,
      role,
    });
    return response;
  },

  blockUser: async (userId: string, reason?: string) => {
    const response = await api.post("/admin/users/block", { userId, reason });
    return response;
  },

  deleteUser: async (userId: string, reason?: string) => {
    const response = await api.post("/admin/users/delete", { userId, reason });
    return response;
  },

  // Analytics
  getAdminOverview: async () => {
    const response = await api.get("/admin/overview");
    return response;
  },

  getUserStats: async () => {
    const response = await api.get("/admin/users/stats");
    return response;
  },

  // Violations
  getAllViolations: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }) => {
    const response = await api.get<{
      violations: any[];
      pagination: PaginationData;
    }>("/admin/violations", { params });
    return response;
  },

  createViolation: async (violationData: {
    vehiclePlate: string;
    violationType: string;
    description: string;
    location: {
      latitude: number;
      longitude: number;
      address?: string;
      city?: string;
      district?: string;
    };
    evidenceUrl: string[];
    fineAmount: number;
  }) => {
    const response = await api.post("/admin/violations", violationData);
    return response;
  },

  updateViolationStatus: async (violationId: string, status: string) => {
    const response = await api.post("/admin/violations/update-status", {
      violationId,
      status,
    });
    return response;
  },
};
