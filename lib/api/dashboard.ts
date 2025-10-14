import api from "./auth";

// Types
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
  citizenGems: number;
  restrictedCitizens: number;
  pendingAppeals: number;
  systemUptime: number;
}

export interface ViolationDataPoint {
  time: string;
  violations: number;
  incidents: number;
  complaints: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  fines: number;
}

export interface RoadCongestionData {
  road: string;
  congestion: number;
  status: "Low" | "Medium" | "High";
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
}

export interface UserRoleData {
  role: string;
  count: number;
  percentage: number;
}

export interface ViolationTypeData {
  type: string;
  count: number;
  percentage: number;
}

export interface CaseSourceData {
  source: string;
  cases: number;
  percentage: number;
}

export interface ComplaintStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface FineStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface EmergencyResponseData {
  type: string;
  count: number;
  avgResponseTime: number;
}

export interface TopCitizenData {
  name: string;
  reports: number;
  score: number;
  rank: number;
}

// API functions
export const dashboardApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<{
    success: boolean;
    data: DashboardStats;
  }> => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  // Get violation data over time
  getViolationData: async (): Promise<{
    success: boolean;
    data: ViolationDataPoint[];
  }> => {
    const response = await api.get("/dashboard/violations");
    return response.data;
  },

  // Get revenue data over time
  getRevenueData: async (): Promise<{
    success: boolean;
    data: RevenueDataPoint[];
  }> => {
    const response = await api.get("/dashboard/revenue");
    return response.data;
  },

  // Get road congestion data
  getRoadCongestionData: async (): Promise<{
    success: boolean;
    data: RoadCongestionData[];
  }> => {
    const response = await api.get("/dashboard/road-congestion");
    return response.data;
  },

  // Get police station data
  getPoliceStationData: async (): Promise<{
    success: boolean;
    data: PoliceStationData[];
  }> => {
    const response = await api.get("/dashboard/police-stations");
    return response.data;
  },

  // Get user submission data
  getUserSubmissionData: async (): Promise<{
    success: boolean;
    data: UserSubmissionData[];
  }> => {
    const response = await api.get("/dashboard/user-submissions");
    return response.data;
  },

  // Get user role distribution data
  getUserRoleData: async (): Promise<{
    success: boolean;
    data: UserRoleData[];
  }> => {
    const response = await api.get("/dashboard/user-roles");
    return response.data;
  },

  // Get violation type data
  getViolationTypeData: async (): Promise<{
    success: boolean;
    data: ViolationTypeData[];
  }> => {
    const response = await api.get("/dashboard/violation-types");
    return response.data;
  },

  // Get case source data
  getCaseSourceData: async (): Promise<{
    success: boolean;
    data: CaseSourceData[];
  }> => {
    const response = await api.get("/dashboard/case-sources");
    return response.data;
  },

  // Get complaint status data
  getComplaintStatusData: async (): Promise<{
    success: boolean;
    data: ComplaintStatusData[];
  }> => {
    const response = await api.get("/dashboard/complaint-status");
    return response.data;
  },

  // Get fine status data
  getFineStatusData: async (): Promise<{
    success: boolean;
    data: FineStatusData[];
  }> => {
    const response = await api.get("/dashboard/fine-status");
    return response.data;
  },

  // Get emergency response data
  getEmergencyResponseData: async (): Promise<{
    success: boolean;
    data: EmergencyResponseData[];
  }> => {
    const response = await api.get("/dashboard/emergencies");
    return response.data;
  },

  // Get top citizens data
  getTopCitizensData: async (): Promise<{
    success: boolean;
    data: TopCitizenData[];
  }> => {
    const response = await api.get("/dashboard/top-citizens");
    return response.data;
  },

  // Get road congestion data
  getRoadCongestionData: async (): Promise<{
    success: boolean;
    data: RoadCongestionData[];
  }> => {
    const response = await api.get("/dashboard/road-congestion");
    return response.data;
  },

  // Get police station data
  getPoliceStationData: async (): Promise<{
    success: boolean;
    data: PoliceStationData[];
  }> => {
    const response = await api.get("/dashboard/police-stations");
    return response.data;
  },

  // Get user submission data
  getUserSubmissionData: async (): Promise<{
    success: boolean;
    data: UserSubmissionData[];
  }> => {
    const response = await api.get("/dashboard/user-submissions");
    return response.data;
  },

  // Get user role data
  getUserRoleData: async (): Promise<{
    success: boolean;
    data: UserRoleData[];
  }> => {
    const response = await api.get("/dashboard/user-roles");
    return response.data;
  },

  // Get violation type data
  getViolationTypeData: async (): Promise<{
    success: boolean;
    data: ViolationTypeData[];
  }> => {
    const response = await api.get("/dashboard/violation-types");
    return response.data;
  },

  // Get case source data
  getCaseSourceData: async (): Promise<{
    success: boolean;
    data: CaseSourceData[];
  }> => {
    const response = await api.get("/dashboard/case-sources");
    return response.data;
  },

  // Get complaint status data
  getComplaintStatusData: async (): Promise<{
    success: boolean;
    data: ComplaintStatusData[];
  }> => {
    const response = await api.get("/dashboard/complaint-status");
    return response.data;
  },

  // Get fine status data
  getFineStatusData: async (): Promise<{
    success: boolean;
    data: FineStatusData[];
  }> => {
    const response = await api.get("/dashboard/fine-status");
    return response.data;
  },
};
