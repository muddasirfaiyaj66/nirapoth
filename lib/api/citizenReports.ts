import { api } from "./apiClient";

// Types
export interface CitizenReport {
  id: string;
  citizenId: string;
  vehiclePlate: string;
  violationType: string;
  description?: string;
  evidenceUrl: string[]; // Array of photo/video URLs
  locationId?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rewardAmount?: number;
  penaltyAmount?: number;
  createdAt: string;
  updatedAt: string;
  location?: {
    id: string;
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    district?: string;
    division?: string;
  };
  citizen?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reviewer?: {
    id: string;
    firstName: string;
    lastName: string;
    badgeNumber?: string;
  };
}

export interface CreateCitizenReportData {
  vehiclePlate: string;
  violationType: string;
  description?: string;
  evidenceUrls: string[]; // Cloudinary URLs
  locationData: {
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    district?: string;
    division?: string;
  };
}

export interface ReviewReportData {
  status: "APPROVED" | "REJECTED";
  reviewNotes: string;
}

export interface CitizenReportSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  violationType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CitizenReportStats {
  totalReports: number;
  pendingReports: number;
  approvedReports: number;
  rejectedReports: number;
  totalRewardsEarned: number;
  totalPenaltiesPaid: number;
  approvalRate: number;
}

// API functions
export const citizenReportApi = {
  // Submit new citizen report
  createReport: async (data: CreateCitizenReportData) => {
    return await api.post<CitizenReport>("/citizen-reports", data);
  },

  // Get my submitted reports
  getMyReports: async (params?: CitizenReportSearchParams) => {
    return await api.get<{
      reports: CitizenReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/citizen-reports/my-reports", { params });
  },

  // Get report by ID
  getReportById: async (reportId: string) => {
    return await api.get<CitizenReport>(`/citizen-reports/${reportId}`);
  },

  // Get my report statistics
  getMyStats: async () => {
    return await api.get<CitizenReportStats>("/citizen-reports/my-stats");
  },

  // Delete my report (only if pending)
  deleteReport: async (reportId: string) => {
    return await api.delete(`/citizen-reports/${reportId}`);
  },

  // POLICE: Get reports pending review (within jurisdiction)
  getPendingReports: async (params?: CitizenReportSearchParams) => {
    return await api.get<{
      reports: CitizenReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/police/pending-reports", { params });
  },

  // POLICE: Review and approve/reject report
  reviewReport: async (reportId: string, data: ReviewReportData) => {
    return await api.post<CitizenReport>(
      `/police/review-report/${reportId}`,
      data
    );
  },

  // POLICE: Get report review statistics
  getReviewStats: async () => {
    return await api.get<{
      pendingCount: number;
      reviewedToday: number;
      approvalRate: number;
      avgReviewTime: number;
    }>("/police/review-stats");
  },

  // ADMIN: Get all reports with full filtering
  getAllReports: async (params?: CitizenReportSearchParams) => {
    return await api.get<{
      reports: CitizenReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/admin/citizen-reports", { params });
  },

  // ADMIN: Get comprehensive statistics
  getAdminStats: async () => {
    return await api.get<{
      totalReports: number;
      pendingReports: number;
      approvedReports: number;
      rejectedReports: number;
      totalRewardsDistributed: number;
      totalPenaltiesCollected: number;
      approvalRate: number;
      avgReviewTime: number;
      reportsByType: { type: string; count: number }[];
      reportsByStatus: { status: string; count: number }[];
      reportsTrend: { date: string; count: number }[];
    }>("/admin/citizen-reports/stats");
  },
};
