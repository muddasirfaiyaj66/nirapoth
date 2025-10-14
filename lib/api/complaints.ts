import { api } from "./apiClient";

// Types
export interface Complaint {
  id: string;
  type: "TRAFFIC" | "INFRASTRUCTURE";
  title: string;
  description?: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  locationId?: string;
  complainerId?: string;
  handlingStationId?: string;
  resolvedAt?: string;
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
  complainer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  location?: {
    id: string;
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    district?: string;
    division?: string;
  };
  handlingStation?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface CreateComplaintData {
  type: "TRAFFIC" | "INFRASTRUCTURE";
  title: string;
  description: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  locationData: {
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    district?: string;
    division?: string;
  };
}

export interface UpdateComplaintStatusData {
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  notes?: string;
}

export interface AssignComplaintData {
  complaintId: string;
  stationId: string;
  assignedOfficerId?: string;
}

export interface ComplaintSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  priority?: string;
}

export interface ComplaintStats {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  closedComplaints: number;
  trafficComplaints: number;
  infrastructureComplaints: number;
}

// API functions
export const complaintApi = {
  // Get all complaints with pagination and filtering
  getAllComplaints: async (params?: ComplaintSearchParams) => {
    return await api.get<{
      complaints: Complaint[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>("/complaints", { params });
  },

  // Get user's complaints
  getMyComplaints: async () => {
    return await api.get<Complaint[]>("/complaints/my-complaints");
  },

  // Get complaint by ID
  getComplaintById: async (complaintId: string) => {
    return await api.get<Complaint>(`/complaints/${complaintId}`);
  },

  // Create new complaint
  createComplaint: async (data: CreateComplaintData) => {
    return await api.post<Complaint>("/complaints", data);
  },

  // Update complaint status
  updateComplaintStatus: async (
    complaintId: string,
    data: UpdateComplaintStatusData
  ) => {
    return await api.put<Complaint>(`/complaints/${complaintId}/status`, data);
  },

  // Assign complaint to police station
  assignComplaint: async (data: AssignComplaintData) => {
    return await api.post<Complaint>("/complaints/assign", data);
  },

  // Get complaint statistics
  getComplaintStats: async () => {
    return await api.get<ComplaintStats>("/complaints/stats");
  },
};
