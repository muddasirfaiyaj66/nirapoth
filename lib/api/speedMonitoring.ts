import { apiClient } from "./apiClient";

export interface SpeedViolationLocation {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  district?: string;
}

export interface SpeedViolation {
  id: string;
  vehiclePlate: string;
  speed: number; // actual speed in km/h
  speedLimit: number; // speed limit for the zone in km/h
  excess: number; // speed - speedLimit
  zone: "HIGHWAY" | "ARTERIAL" | "URBAN" | "RESIDENTIAL" | "SCHOOL_ZONE";
  location: SpeedViolationLocation;
  detectedAt: string;
  cameraId: string;
  snapshotUrl?: string;
  caseFiled: boolean;
  fineAmount: number;
  caseId?: string;
  detectedToday?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpeedMonitoringStats {
  totalViolations: number;
  todayViolations: number;
  totalFines: number;
  avgSpeedExcess: number;
  casesFiled: number;
  pendingCases: number;
}

export interface SpeedZoneLimits {
  HIGHWAY: number;
  ARTERIAL: number;
  URBAN: number;
  RESIDENTIAL: number;
  SCHOOL_ZONE: number;
}

export interface SpeedViolationSearchParams {
  vehiclePlate?: string;
  zone?: string;
  caseFiled?: boolean;
  startDate?: string;
  endDate?: string;
  minSpeed?: number;
  maxSpeed?: number;
  page?: number;
  limit?: number;
}

export interface FileCaseData {
  violationId: string;
  notes?: string;
}

export const speedMonitoringApi = {
  // Get all speed violations with pagination and filters
  getAll: async (params?: SpeedViolationSearchParams) => {
    const response = await apiClient.get<{
      violations: SpeedViolation[];
      total: number;
      page: number;
      totalPages: number;
    }>("/api/speed-violations", { params });
    return response.data;
  },

  // Get violation by ID
  getById: async (id: string) => {
    const response = await apiClient.get<SpeedViolation>(
      `/api/speed-violations/${id}`
    );
    return response.data;
  },

  // Get speed monitoring statistics
  getStats: async () => {
    const response = await apiClient.get<SpeedMonitoringStats>(
      "/api/speed-violations/stats"
    );
    return response.data;
  },

  // File a case for speed violation
  fileCase: async (data: FileCaseData) => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      caseId: string;
      fineAmount: number;
    }>("/api/speed-violations/file-case", data);
    return response.data;
  },

  // Get recent violations (for real-time monitoring)
  getRecent: async (limit: number = 20) => {
    const response = await apiClient.get<SpeedViolation[]>(
      "/api/speed-violations/recent",
      { params: { limit } }
    );
    return response.data;
  },

  // Get speed zone limits
  getZoneLimits: async () => {
    const response = await apiClient.get<SpeedZoneLimits>(
      "/api/speed-violations/zone-limits"
    );
    return response.data;
  },

  // Calculate fine amount based on speed excess
  calculateFine: (speed: number, speedLimit: number): number => {
    const excess = speed - speedLimit;
    if (excess < 10) return 1000;
    if (excess < 20) return 2000;
    if (excess < 30) return 5000;
    return 10000;
  },
};
