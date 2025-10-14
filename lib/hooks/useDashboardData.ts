import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { api } from "../api/apiClient";
import { ApiErrorHandler } from "../utils/errorHandler";

// Dashboard data types
export interface DashboardStats {
  totalVehicles: number;
  totalViolations: number;
  totalComplaints: number;
  totalPayments: number;
  totalFines: number;
  recentActivity: number;
}

export interface DashboardData {
  vehicles: any[];
  violations: any[];
  complaints: any[];
  payments: any[];
  stats: DashboardStats;
}

// Individual data fetching functions
const fetchVehicles = async () => {
  const response = await api.get("/vehicles/my-vehicles");
  if (!response.success) {
    throw new Error(response.error?.message || "Failed to fetch vehicles");
  }
  return response.data || [];
};

const fetchViolations = async () => {
  const response = await api.get("/violations");
  if (!response.success) {
    throw new Error(response.error?.message || "Failed to fetch violations");
  }
  return response.data || [];
};

const fetchComplaints = async () => {
  const response = await api.get("/complaints");
  if (!response.success) {
    throw new Error(response.error?.message || "Failed to fetch complaints");
  }
  return response.data || [];
};

const fetchPayments = async () => {
  const response = await api.get("/payments");
  if (!response.success) {
    throw new Error(response.error?.message || "Failed to fetch payments");
  }
  return response.data || [];
};

// Main dashboard data hook
export function useDashboardData() {
  const queries = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "vehicles"],
        queryFn: fetchVehicles,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            return false;
          }
          return failureCount < 2;
        },
      },
      {
        queryKey: ["dashboard", "violations"],
        queryFn: fetchViolations,
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            return false;
          }
          return failureCount < 2;
        },
      },
      {
        queryKey: ["dashboard", "complaints"],
        queryFn: fetchComplaints,
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            return false;
          }
          return failureCount < 2;
        },
      },
      {
        queryKey: ["dashboard", "payments"],
        queryFn: fetchPayments,
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            return false;
          }
          return failureCount < 2;
        },
      },
    ],
  });

  const [vehiclesQuery, violationsQuery, complaintsQuery, paymentsQuery] =
    queries;

  // Calculate derived data
  const vehicles = vehiclesQuery.data || [];
  const violations = violationsQuery.data || [];
  const complaints = complaintsQuery.data || [];
  const payments = paymentsQuery.data || [];

  const stats: DashboardStats = {
    totalVehicles: vehicles.length,
    totalViolations: violations.length,
    totalComplaints: complaints.length,
    totalPayments: payments.length,
    totalFines: violations.reduce((sum, v) => sum + (v.fineAmount || 0), 0),
    recentActivity: 0, // This would come from a separate API call
  };

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const errors = queries.map((query) => query.error).filter(Boolean);

  const refetch = () => {
    queries.forEach((query) => query.refetch());
  };

  return {
    data: {
      vehicles,
      violations,
      complaints,
      payments,
      stats,
    },
    isLoading,
    isError,
    errors,
    refetch,
    // Individual query states
    vehiclesQuery,
    violationsQuery,
    complaintsQuery,
    paymentsQuery,
  };
}

// Optimized individual data hooks
export function useVehiclesData() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useViolationsData() {
  return useQuery({
    queryKey: ["violations"],
    queryFn: fetchViolations,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useComplaintsData() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: fetchComplaints,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function usePaymentsData() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Mutation hooks for data updates
export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicleData: any) => {
      const response = await api.post("/vehicles", vehicleData);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to create vehicle");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch vehicles data
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCreateViolation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (violationData: any) => {
      const response = await api.post("/violations", violationData);
      if (!response.success) {
        throw new Error(
          response.error?.message || "Failed to create violation"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (complaintData: any) => {
      const response = await api.post("/complaints", complaintData);
      if (!response.success) {
        throw new Error(
          response.error?.message || "Failed to create complaint"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await api.post("/payments", paymentData);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to create payment");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// Error handling hook
export function useErrorHandler() {
  const handleError = useCallback((error: any) => {
    const apiError = ApiErrorHandler.handle(error);
    ApiErrorHandler.showError(apiError);
  }, []);

  return { handleError };
}
