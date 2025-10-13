import { useQuery } from "@tanstack/react-query";
import api from "../api/auth";

// Dashboard data types
export interface DashboardStats {
  totalUsers: number;
  totalVehicles: number;
  totalViolations: number;
  totalIncidents: number;
  totalComplaints: number;
  totalFines: number;
  totalRevenue: number;
  activeCameras: number;
  pendingReports: number;
  resolvedReports: number;
  driverGems: number;
  blacklistedDrivers: number;
  pendingAppeals: number;
  systemUptime: number;
}

export interface ViolationData {
  time: string;
  violations: number;
  incidents: number;
  complaints: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  fines: number;
}

export interface RoadCongestionData {
  road: string;
  congestion: number;
  status: "High" | "Medium" | "Low";
  vehicles: number;
}

export interface PoliceStationData {
  station: string;
  cases: number;
  resolved: number;
}

export interface UserSubmissionData {
  day: string;
  traffic: number;
  infrastructure: number;
  total: number;
}

export interface UserRoleData {
  role: string;
  count: number;
  color: string;
}

export interface ViolationTypeData {
  type: string;
  count: number;
  color: string;
}

export interface CaseSourceData {
  source: string;
  count: number;
  percentage: number;
}

export interface ComplaintStatusData {
  status: string;
  count: number;
  color: string;
}

export interface FineStatusData {
  month: string;
  paid: number;
  unpaid: number;
  overdue: number;
}

export interface EmergencyResponseData {
  id: number;
  type: string;
  location: string;
  status: string;
  time: string;
  severity: string;
}

export interface TopCitizensData {
  name: string;
  reports: number;
  rewards: number;
  accuracy: number;
}

// API functions
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/dashboard/stats");
  return response.data.data;
};

const fetchViolationData = async (): Promise<ViolationData[]> => {
  const response = await api.get("/dashboard/violations");
  return response.data.data;
};

const fetchRevenueData = async (): Promise<RevenueData[]> => {
  const response = await api.get("/dashboard/revenue");
  return response.data.data;
};

const fetchRoadCongestionData = async (): Promise<RoadCongestionData[]> => {
  const response = await api.get("/dashboard/road-congestion");
  return response.data.data;
};

const fetchPoliceStationData = async (): Promise<PoliceStationData[]> => {
  const response = await api.get("/dashboard/police-stations");
  return response.data.data;
};

const fetchUserSubmissionData = async (): Promise<UserSubmissionData[]> => {
  const response = await api.get("/dashboard/user-submissions");
  return response.data.data;
};

const fetchUserRoleData = async (): Promise<UserRoleData[]> => {
  const response = await api.get("/dashboard/user-roles");
  return response.data.data;
};

const fetchViolationTypeData = async (): Promise<ViolationTypeData[]> => {
  const response = await api.get("/dashboard/violation-types");
  return response.data.data;
};

const fetchCaseSourceData = async (): Promise<CaseSourceData[]> => {
  const response = await api.get("/dashboard/case-sources");
  return response.data.data;
};

const fetchComplaintStatusData = async (): Promise<ComplaintStatusData[]> => {
  const response = await api.get("/dashboard/complaint-status");
  return response.data.data;
};

const fetchFineStatusData = async (): Promise<FineStatusData[]> => {
  const response = await api.get("/dashboard/fine-status");
  return response.data.data;
};

const fetchEmergencyResponseData = async (): Promise<
  EmergencyResponseData[]
> => {
  const response = await api.get("/dashboard/emergencies");
  return response.data.data;
};

const fetchTopCitizensData = async (): Promise<TopCitizensData[]> => {
  const response = await api.get("/dashboard/top-citizens");
  return response.data.data;
};

// Custom hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

export const useViolationData = () => {
  return useQuery({
    queryKey: ["dashboard", "violations"],
    queryFn: fetchViolationData,
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useRevenueData = () => {
  return useQuery({
    queryKey: ["dashboard", "revenue"],
    queryFn: fetchRevenueData,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

export const useRoadCongestionData = () => {
  return useQuery({
    queryKey: ["dashboard", "road-congestion"],
    queryFn: fetchRoadCongestionData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const usePoliceStationData = () => {
  return useQuery({
    queryKey: ["dashboard", "police-stations"],
    queryFn: fetchPoliceStationData,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

export const useUserSubmissionData = () => {
  return useQuery({
    queryKey: ["dashboard", "user-submissions"],
    queryFn: fetchUserSubmissionData,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

export const useUserRoleData = () => {
  return useQuery({
    queryKey: ["dashboard", "user-roles"],
    queryFn: fetchUserRoleData,
    refetchInterval: 600000, // Refetch every 10 minutes
  });
};

export const useViolationTypeData = () => {
  return useQuery({
    queryKey: ["dashboard", "violation-types"],
    queryFn: fetchViolationTypeData,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

export const useCaseSourceData = () => {
  return useQuery({
    queryKey: ["dashboard", "case-sources"],
    queryFn: fetchCaseSourceData,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

export const useComplaintStatusData = () => {
  return useQuery({
    queryKey: ["dashboard", "complaint-status"],
    queryFn: fetchComplaintStatusData,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

export const useFineStatusData = () => {
  return useQuery({
    queryKey: ["dashboard", "fine-status"],
    queryFn: fetchFineStatusData,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

export const useEmergencyResponseData = () => {
  return useQuery({
    queryKey: ["dashboard", "emergencies"],
    queryFn: fetchEmergencyResponseData,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });
};

export const useTopCitizensData = () => {
  return useQuery({
    queryKey: ["dashboard", "top-citizens"],
    queryFn: fetchTopCitizensData,
    refetchInterval: 600000, // Refetch every 10 minutes
  });
};
