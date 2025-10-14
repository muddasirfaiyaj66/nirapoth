import { api } from "./apiClient";

export interface AccidentAlert {
  type: "accident" | "fire" | "traffic_violation";
  severity: "low" | "medium" | "high" | "critical";
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  description: string;
  confidence: number;
  imageUrl?: string;
  videoUrl?: string;
  vehiclesInvolved?: string[];
}

export interface AccidentData {
  id: string;
  timestamp: string;
  imageUrl?: string;
  videoUrl?: string;
  confidence: number;
  vehicles_involved: string[];
  location: number[];
  status: string;
  type?: string;
  severity?: string;
  description?: string;
}

export interface DetectionResult {
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export interface AIStats {
  aiServiceStatus: "healthy" | "unhealthy";
  totalAccidents: number;
  lastSync: string;
  serviceUrl: string;
}

export const aiIntegrationApi = {
  /**
   * Send accident alert to AI service
   */
  sendAccidentAlert: async (alertData: AccidentAlert) => {
    return await api.post("/ai/alerts", alertData);
  },

  /**
   * Get accident data from AI service
   */
  getAccidentData: async () => {
    return await api.get<AccidentData[]>("/ai/accidents");
  },

  /**
   * Get specific accident by ID from AI service
   */
  getAccidentById: async (accidentId: string) => {
    return await api.get<AccidentData>(`/ai/accidents/${accidentId}`);
  },

  /**
   * Process media for detection
   */
  processMediaForDetection: async (mediaData: {
    mediaUrl: string;
    mediaType: "image" | "video";
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
  }) => {
    return await api.post<DetectionResult[]>("/ai/detect", mediaData);
  },

  /**
   * Report accident to AI service
   */
  reportAccident: async (accidentData: {
    location: number[];
    confidence: number;
    vehicles_involved: string[];
    imageUrl?: string;
    videoUrl?: string;
  }) => {
    return await api.post<AccidentData>("/ai/accidents", accidentData);
  },

  /**
   * Sync accident data with database
   */
  syncAccidentData: async () => {
    return await api.post("/ai/sync");
  },

  /**
   * Check AI service health
   */
  checkHealth: async () => {
    return await api.get<{ success: boolean; message: string }>("/ai/health");
  },

  /**
   * Get AI service statistics
   */
  getAIStats: async () => {
    return await api.get<AIStats>("/ai/stats");
  },
};
