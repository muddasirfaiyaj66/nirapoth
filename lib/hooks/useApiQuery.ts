import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { api } from "../api/apiClient";

// Generic hook for API queries with consistent error handling
export function useApiQuery<T = any>(
  queryKey: (string | number)[],
  queryFn: () => Promise<{ success: boolean; data?: T; error?: any }>,
  options?: Omit<
    UseQueryOptions<{ success: boolean; data?: T; error?: any }>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<{ success: boolean; data?: T; error?: any }> {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403 errors
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
}

// Specific hooks for common API patterns
export function useVehicles() {
  return useApiQuery(["vehicles"], () => api.get("/vehicles/my-vehicles"), {
    select: (data) => ({
      ...data,
      data: data.data || [],
    }),
  });
}

export function useViolations() {
  return useApiQuery(["violations"], () => api.get("/violations"), {
    select: (data) => ({
      ...data,
      data: data.data || [],
    }),
  });
}

export function useComplaints() {
  return useApiQuery(
    ["complaints"],
    () => api.get("/complaints/my-complaints"),
    {
      select: (data) => ({
        ...data,
        data: data.data || [],
      }),
    }
  );
}

export function usePayments() {
  return useApiQuery(["payments"], () => api.get("/payments/my-payments"), {
    select: (data) => ({
      ...data,
      data: data.data || [],
    }),
  });
}

export function useAdminUsers(params?: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}) {
  return useApiQuery(
    ["admin", "users", params],
    () => api.get("/admin/users", { params }),
    {
      select: (data) => ({
        ...data,
        data: data.data || {
          users: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 },
        },
      }),
    }
  );
}

export function useAdminViolations(params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}) {
  return useApiQuery(
    ["admin", "violations", params],
    () => api.get("/admin/violations", { params }),
    {
      select: (data) => ({
        ...data,
        data: data.data || {
          violations: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 },
        },
      }),
    }
  );
}

export function useAdminStats() {
  return useApiQuery(["admin", "stats"], () => api.get("/admin/overview"), {
    select: (data) => ({
      ...data,
      data: data.data || {},
    }),
  });
}

export function useUserStats() {
  return useApiQuery(
    ["admin", "user-stats"],
    () => api.get("/admin/users/stats"),
    {
      select: (data) => ({
        ...data,
        data: data.data || {},
      }),
    }
  );
}

// Hook for AI integration data
export function useAIData() {
  return useApiQuery(["ai", "data"], () => api.get("/ai/accidents"), {
    select: (data) => ({
      ...data,
      data: data.data || [],
    }),
  });
}

export function useAIStats() {
  return useApiQuery(["ai", "stats"], () => api.get("/ai/stats"), {
    select: (data) => ({
      ...data,
      data: data.data || {},
    }),
  });
}

export function useAIHealth() {
  return useApiQuery(["ai", "health"], () => api.get("/ai/health"), {
    select: (data) => ({
      ...data,
      data: data.data || { success: false, message: "Unknown" },
    }),
  });
}
