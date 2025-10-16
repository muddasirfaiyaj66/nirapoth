import { apiClient } from "./apiClient";

export interface DashboardStats {
  totalUsers: number;
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
  activeEmergencies: number;
}

export interface CaseResolutionData {
  stage: string;
  value: number;
  percentage: number;
}

export interface SystemEfficiency {
  aiDetection: number;
  responseTime: number;
  caseResolution: number;
  paymentRate: number;
}

export interface PoliceStationPerformance {
  stationId: string;
  name: string;
  cases: number;
  resolved: number;
  pending: number;
  efficiency: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  fines: number;
  payments: number;
}

export interface ViolationData {
  time: string;
  violations: number;
  incidents: number;
}

export interface RoadCongestion {
  road: string;
  congestion: number; // percentage
  vehicles: number;
  status: "Low" | "Medium" | "High";
}

export interface UserRoleDistribution {
  role: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ViolationTypeDistribution {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface UserSubmissionTrend {
  day: string;
  traffic: number;
  infrastructure: number;
}

export interface EmergencyResponse {
  id: string;
  type: string;
  severity: string;
  location: string;
  status: string;
  time: string;
}

export interface AnalyticsData {
  caseResolution: CaseResolutionData[];
  systemEfficiency: SystemEfficiency;
  policeStations: PoliceStationPerformance[];
  revenue: RevenueData[];
  violations: ViolationData[];
  roadCongestion: RoadCongestion[];
  userRoles: UserRoleDistribution[];
  violationTypes: ViolationTypeDistribution[];
  userSubmissions: UserSubmissionTrend[];
  emergencyResponses: EmergencyResponse[];
}

export const analyticsApi = {
  // Get main dashboard stats
  getDashboardStats: async () => {
    const response = await apiClient.get<DashboardStats>(
      "/api/analytics/dashboard-stats"
    );
    return response.data;
  },

  // Get case resolution funnel data
  getCaseResolution: async () => {
    const response = await apiClient.get<CaseResolutionData[]>(
      "/api/analytics/case-resolution"
    );
    return response.data;
  },

  // Get system efficiency metrics
  getSystemEfficiency: async () => {
    const response = await apiClient.get<SystemEfficiency>(
      "/api/analytics/system-efficiency"
    );
    return response.data;
  },

  // Get police station performance
  getPoliceStationPerformance: async () => {
    const response = await apiClient.get<PoliceStationPerformance[]>(
      "/api/analytics/police-stations"
    );
    return response.data;
  },

  // Get revenue data
  getRevenue: async (months: number = 6) => {
    const response = await apiClient.get<RevenueData[]>(
      "/api/analytics/revenue",
      { params: { months } }
    );
    return response.data;
  },

  // Get violation trends
  getViolations: async (hours: number = 24) => {
    const response = await apiClient.get<ViolationData[]>(
      "/api/analytics/violations",
      { params: { hours } }
    );
    return response.data;
  },

  // Get road congestion data
  getRoadCongestion: async () => {
    const response = await apiClient.get<RoadCongestion[]>(
      "/api/analytics/road-congestion"
    );
    return response.data;
  },

  // Get user role distribution
  getUserRoles: async () => {
    const response = await apiClient.get<UserRoleDistribution[]>(
      "/api/analytics/user-roles"
    );
    return response.data;
  },

  // Get violation type distribution
  getViolationTypes: async () => {
    const response = await apiClient.get<ViolationTypeDistribution[]>(
      "/api/analytics/violation-types"
    );
    return response.data;
  },

  // Get user submission trends
  getUserSubmissions: async (days: number = 7) => {
    const response = await apiClient.get<UserSubmissionTrend[]>(
      "/api/analytics/user-submissions",
      { params: { days } }
    );
    return response.data;
  },

  // Get emergency responses
  getEmergencyResponses: async () => {
    const response = await apiClient.get<EmergencyResponse[]>(
      "/api/analytics/emergency-responses"
    );
    return response.data;
  },

  // Get all analytics data at once
  getAll: async () => {
    const response = await apiClient.get<AnalyticsData>("/api/analytics/all");
    return response.data;
  },
};
