import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { useAuth } from "./useAuth";

// Dashboard Stats Hook
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardApi.getDashboardStats,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}

// Violation Data Hook
export function useViolationData() {
  return useQuery({
    queryKey: ["violation-data"],
    queryFn: dashboardApi.getViolationData,
    staleTime: 60000, // 1 minute
  });
}

// Revenue Data Hook
export function useRevenueData() {
  return useQuery({
    queryKey: ["revenue-data"],
    queryFn: dashboardApi.getRevenueData,
    staleTime: 300000, // 5 minutes
  });
}

// Road Congestion Data Hook
export function useRoadCongestionData() {
  return useQuery({
    queryKey: ["road-congestion"],
    queryFn: dashboardApi.getRoadCongestionData,
    staleTime: 60000, // 1 minute
  });
}

// Police Station Data Hook
export function usePoliceStationData() {
  return useQuery({
    queryKey: ["police-station-data"],
    queryFn: dashboardApi.getPoliceStationData,
    staleTime: 300000, // 5 minutes
  });
}

// User Submission Data Hook
export function useUserSubmissionData() {
  return useQuery({
    queryKey: ["user-submission-data"],
    queryFn: dashboardApi.getUserSubmissionData,
    staleTime: 300000, // 5 minutes
  });
}

// User Role Data Hook
export function useUserRoleData() {
  return useQuery({
    queryKey: ["user-role-data"],
    queryFn: dashboardApi.getUserRoleData,
    staleTime: 600000, // 10 minutes
  });
}

// Violation Type Data Hook
export function useViolationTypeData() {
  return useQuery({
    queryKey: ["violation-type-data"],
    queryFn: dashboardApi.getViolationTypeData,
    staleTime: 600000, // 10 minutes
  });
}

// Case Source Data Hook
export function useCaseSourceData() {
  return useQuery({
    queryKey: ["case-source-data"],
    queryFn: dashboardApi.getCaseSourceData,
    staleTime: 600000, // 10 minutes
  });
}

// Complaint Status Data Hook
export function useComplaintStatusData() {
  return useQuery({
    queryKey: ["complaint-status-data"],
    queryFn: dashboardApi.getComplaintStatusData,
    staleTime: 300000, // 5 minutes
  });
}

// Fine Status Data Hook
export function useFineStatusData() {
  return useQuery({
    queryKey: ["fine-status-data"],
    queryFn: dashboardApi.getFineStatusData,
    staleTime: 300000, // 5 minutes
  });
}

// Emergency Response Data Hook
export function useEmergencyResponseData() {
  return useQuery({
    queryKey: ["emergency-response-data"],
    queryFn: dashboardApi.getEmergencyResponseData,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute for emergency data
  });
}

// Top Citizens Data Hook
export function useTopCitizensData() {
  return useQuery({
    queryKey: ["top-citizens-data"],
    queryFn: dashboardApi.getTopCitizensData,
    staleTime: 600000, // 10 minutes
  });
}
