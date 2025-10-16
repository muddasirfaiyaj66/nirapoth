import { apiClient } from "./apiClient";

export interface AccidentLocation {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  district?: string;
}

export interface Accident {
  id: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "ACTIVE" | "RESPONDING" | "RESOLVED";
  description: string;
  detectedAt: string;
  location: AccidentLocation;
  cameraId: string;
  snapshotUrl?: string;
  hasFire: boolean;
  ambulanceDispatched?: boolean;
  fireServiceDispatched?: boolean;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccidentStats {
  totalAccidents: number;
  activeAccidents: number;
  respondingAccidents: number;
  resolvedToday: number;
  criticalAccidents: number;
  averageResponseTime: number; // in minutes
}

export interface DispatchEmergencyData {
  serviceType: "AMBULANCE" | "FIRE_SERVICE";
  accidentId: string;
  estimatedArrival?: number; // in minutes
}

export interface AccidentSearchParams {
  status?: "ACTIVE" | "RESPONDING" | "RESOLVED";
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  hasFire?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const accidentsApi = {
  // Get all accidents with pagination and filters
  getAll: async (params?: AccidentSearchParams) => {
    const response = await apiClient.get<{
      accidents: Accident[];
      total: number;
      page: number;
      totalPages: number;
    }>("/api/accidents", { params });
    return response.data;
  },

  // Get accident by ID
  getById: async (id: string) => {
    const response = await apiClient.get<Accident>(`/api/accidents/${id}`);
    return response.data;
  },

  // Get accident statistics
  getStats: async () => {
    const response = await apiClient.get<AccidentStats>("/api/accidents/stats");
    return response.data;
  },

  // Dispatch emergency service
  dispatchEmergency: async (data: DispatchEmergencyData) => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      estimatedArrival: number;
    }>("/api/accidents/dispatch", data);
    return response.data;
  },

  // Mark accident as resolved
  markResolved: async (accidentId: string, notes?: string) => {
    const response = await apiClient.patch<Accident>(
      `/api/accidents/${accidentId}/resolve`,
      { notes }
    );
    return response.data;
  },

  // Get real-time active accidents (for live updates)
  getActiveAccidents: async () => {
    const response = await apiClient.get<Accident[]>("/api/accidents/active");
    return response.data;
  },
};
