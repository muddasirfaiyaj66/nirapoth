import { api } from "./apiClient";

export interface FireServiceEmergency {
  id: string;
  location: string;
  severity: string;
  status: string;
  date: Date;
  description: string;
}

export interface FireServiceStats {
  totalEmergencies: number;
  activeEmergencies: number;
  resolvedEmergencies: number;
  recentEmergencies: FireServiceEmergency[];
}

export interface FireServiceAnalytics {
  emergenciesByMonth: Array<{ month: string; count: number }>;
  emergenciesBySeverity: Array<{ severity: string; count: number }>;
  emergenciesByStatus: Array<{ status: string; count: number }>;
}

export const fireServiceApi = {
  getStats: async () => {
    return await api.get<FireServiceStats>("/fire-service/stats");
  },
  getAnalytics: async () => {
    return await api.get<FireServiceAnalytics>("/fire-service/analytics");
  },
};
