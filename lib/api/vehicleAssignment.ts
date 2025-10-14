import api from "./auth";

// Types
export interface VehicleAssignment {
  id: string;
  vehicleId: string;
  citizenId: string;
  assignedBy: string;
  drivingLicenseId?: string;
  assignedAt: string;
  validFrom: string;
  validUntil?: string;
  isActive: boolean;
  notes?: string;
  requiresApproval: boolean;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: {
    id: string;
    plateNo: string;
    brand: string;
    model: string;
    type: string;
  };
  citizen?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  drivingLicense?: {
    id: string;
    licenseNo: string;
    category: string;
  };
  assignor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateAssignmentData {
  vehicleId: string;
  citizenId: string;
  drivingLicenseId?: string;
  validUntil?: string;
  notes?: string;
  requiresApproval?: boolean;
}

export interface UpdateAssignmentData {
  validUntil?: string;
  notes?: string;
  isActive?: boolean;
}

export interface ApproveAssignmentData {
  assignmentId: string;
  approved: boolean;
  notes?: string;
}

export interface AssignmentSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  vehicleId?: string;
  citizenId?: string;
}

// API functions
export const vehicleAssignmentApi = {
  // Get all assignments with pagination and filtering
  getAllAssignments: async (params?: AssignmentSearchParams) => {
    const response = await api.get("/vehicle-assignment", { params });
    return response.data;
  },

  // Get user's assignments
  getMyAssignments: async () => {
    const response = await api.get("/vehicle-assignment/my-assignments");
    return response.data;
  },

  // Get assignments for a specific vehicle
  getVehicleAssignments: async (vehicleId: string) => {
    const response = await api.get(`/vehicle-assignment/vehicle/${vehicleId}`);
    return response.data;
  },

  // Get assignments for a specific citizen
  getCitizenAssignments: async (citizenId: string) => {
    const response = await api.get(`/vehicle-assignment/citizen/${citizenId}`);
    return response.data;
  },

  // Get assignment by ID
  getAssignmentById: async (assignmentId: string) => {
    const response = await api.get(`/vehicle-assignment/${assignmentId}`);
    return response.data;
  },

  // Create new assignment
  createAssignment: async (data: CreateAssignmentData) => {
    const response = await api.post("/vehicle-assignment", data);
    return response.data;
  },

  // Update assignment
  updateAssignment: async (
    assignmentId: string,
    data: UpdateAssignmentData
  ) => {
    const response = await api.put(`/vehicle-assignment/${assignmentId}`, data);
    return response.data;
  },

  // Approve or reject assignment
  approveAssignment: async (data: ApproveAssignmentData) => {
    const response = await api.put("/vehicle-assignment/approve", data);
    return response.data;
  },

  // End assignment
  endAssignment: async (assignmentId: string) => {
    const response = await api.put(`/vehicle-assignment/${assignmentId}/end`);
    return response.data;
  },

  // Delete assignment
  deleteAssignment: async (assignmentId: string) => {
    const response = await api.delete(`/vehicle-assignment/${assignmentId}`);
    return response.data;
  },

  // Get assignment statistics
  getAssignmentStats: async () => {
    const response = await api.get("/vehicle-assignment/stats");
    return response.data;
  },
};
