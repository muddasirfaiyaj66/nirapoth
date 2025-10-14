import { api } from "./apiClient";

// Types
export interface Vehicle {
  id: string;
  plateNo: string;
  registrationNo?: string;
  engineNo: string;
  chassisNo: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  type: string;
  ownerId: string;
  driverId?: string;
  registeredAt: string;
  expiresAt?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  driver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignments?: VehicleAssignment[];
}

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
}

export interface CreateVehicleData {
  plateNo: string;
  registrationNo?: string;
  engineNo: string;
  chassisNo: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  type: string;
  expiresAt?: string;
}

export interface UpdateVehicleData {
  plateNo?: string;
  registrationNo?: string;
  engineNo?: string;
  chassisNo?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  type?: string;
  expiresAt?: string;
}

export interface VehicleSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  vehiclePlate?: string;
}

export interface VehicleHistoryParams {
  vehicleId: string;
}

export interface AssignSelfData {
  drivingLicenseId: string;
  notes?: string;
  validUntil?: string;
}

// API functions
export const vehicleApi = {
  // Get all vehicles (Admin/Police only)
  getAllVehicles: async (params?: VehicleSearchParams) => {
    return await api.get("/vehicles", { params });
  },

  // Get user's vehicles
  getMyVehicles: async () => {
    return await api.get("/vehicles/my-vehicles");
  },

  // Get vehicle by ID
  getVehicleById: async (vehicleId: string) => {
    return await api.get(`/vehicles/${vehicleId}`);
  },

  // Add new vehicle
  addVehicle: async (data: CreateVehicleData) => {
    return await api.post("/vehicles", data);
  },

  // Update vehicle
  updateVehicle: async (vehicleId: string, data: UpdateVehicleData) => {
    return await api.put(`/vehicles/${vehicleId}`, data);
  },

  // Delete vehicle
  deleteVehicle: async (vehicleId: string) => {
    return await api.delete(`/vehicles/${vehicleId}`);
  },

  // Get vehicle assignment history
  getVehicleHistory: async (vehicleId: string) => {
    return await api.get(`/vehicles/${vehicleId}/history`);
  },

  // Assign self as driver to vehicle
  assignSelfAsDriver: async (vehicleId: string, data: AssignSelfData) => {
    return await api.post(`/vehicles/${vehicleId}/assign-self`, data);
  },

  // Search vehicles
  searchVehicles: async (query: string) => {
    return await api.get("/vehicles/search", { params: { query } });
  },
};
