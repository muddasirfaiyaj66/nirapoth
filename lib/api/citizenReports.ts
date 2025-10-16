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
  // Appeal fields
  appealSubmitted?: boolean;
  appealReason?: string;
  appealStatus?: "PENDING" | "APPROVED" | "REJECTED";
  appealReviewedBy?: string;
  appealReviewedAt?: string;
  appealNotes?: string;
  additionalPenaltyApplied?: boolean;
  additionalPenaltyAmount?: number;
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
  appealReviewer?: {
    id: string;
    firstName: string;
    lastName: string;
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
  action: "APPROVED" | "REJECTED";
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
    const response = await api.post<CitizenReport>(
      "/citizen-reports/create",
      data
    );
    return response.data as CitizenReport;
  },

  // Get my submitted reports
  getMyReports: async (params?: CitizenReportSearchParams) => {
    const response = await api.get<{
      reports: CitizenReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/citizen-reports/my-reports", { params });
    return response.data as {
      reports: CitizenReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  },

  // Get report by ID
  getReportById: async (reportId: string) => {
    const response = await api.get<CitizenReport>(
      `/citizen-reports/${reportId}`
    );
    return response.data as CitizenReport;
  },

  // Get my report statistics
  getMyStats: async () => {
    const response = await api.get<CitizenReportStats>(
      "/citizen-reports/my-stats"
    );
    return response.data as CitizenReportStats;
  },

  // Delete my report (only if pending)
  deleteReport: async (reportId: string) => {
    return await api.delete(`/citizen-reports/${reportId}`);
  },

  // Submit appeal for rejected report
  submitAppeal: async (
    reportId: string,
    data: { appealReason: string; evidenceUrls: string[] }
  ) => {
    const response = await api.post<CitizenReport>(
      `/citizen-reports/${reportId}/appeal`,
      data
    );
    return response.data as CitizenReport;
  },

  // POLICE: Get reports pending review (within jurisdiction)
  getPendingReports: async (params?: CitizenReportSearchParams) => {
    const response = await api.get<{
      reports: CitizenReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/police/pending-reports", { params });
    return response.data as {
      reports: CitizenReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  },

  // POLICE: Review and approve/reject report
  reviewReport: async (reportId: string, data: ReviewReportData) => {
    const response = await api.post<CitizenReport>(
      `/police/review/${reportId}`,
      data
    );
    return response.data as CitizenReport;
  },

  // POLICE: Get report review statistics
  getReviewStats: async () => {
    const response = await api.get<{
      pendingCount: number;
      reviewedToday: number;
      approvalRate: number;
      avgReviewTime: number;
    }>("/police/review-stats");
    return response.data as {
      pendingCount: number;
      reviewedToday: number;
      approvalRate: number;
      avgReviewTime: number;
    };
  },

  // POLICE: Get pending appeals
  getPendingAppeals: async (params?: CitizenReportSearchParams) => {
    const response = await api.get<{
      reports: CitizenReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/police/pending-appeals", { params });
    return response.data as {
      reports: CitizenReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  },

  // POLICE: Review appeal
  reviewAppeal: async (
    reportId: string,
    data: { action: "APPROVED" | "REJECTED"; reviewNotes: string }
  ) => {
    const response = await api.post<CitizenReport>(
      `/police/review-appeal/${reportId}`,
      data
    );
    return response.data as CitizenReport;
  },

  // ADMIN: Get all reports with full filtering
  getAllReports: async (params?: CitizenReportSearchParams) => {
    const response = await api.get<{
      reports: CitizenReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/admin/citizen-reports", { params });
    return response.data as {
      reports: CitizenReport[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  },

  // ADMIN: Get comprehensive statistics
  getAdminStats: async () => {
    const response = await api.get<{
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
    return response.data as {
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
    };
  },
};
