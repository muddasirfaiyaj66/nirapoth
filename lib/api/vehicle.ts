import apiClient from "./apiClient";

export interface Vehicle {
  id: string;
  type: string;
  plateNo: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  engineNo: string;
  chassisNo: string;
  registrationNo?: string;
  registrationDate?: string;
  ownerId: string;
  driverId?: string;
  registeredAt: string;
  expiresAt?: string;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
  driver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
  violations?: any[];
  assignments?: any[];
}

export interface CreateVehicleDTO {
  type: string;
  plateNo: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  engineNo: string;
  chassisNo: string;
  registrationNo?: string;
  registrationDate?: string;
  expiresAt?: string;
}

export interface UpdateVehicleDTO {
  type?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  expiresAt?: string;
  isActive?: boolean;
}

export const vehicleApi = {
  // Create a new vehicle
  async createVehicle(data: CreateVehicleDTO): Promise<{
    success: boolean;
    message: string;
    data: Vehicle;
  }> {
    const response = await apiClient.post("/vehicles", data);
    return response.data;
  },

  // Get current user's vehicles
  async getMyVehicles(): Promise<{
    success: boolean;
    data: Vehicle[];
  }> {
    const response = await apiClient.get("/vehicles/my-vehicles");
    return response.data;
  },

  // Get vehicle by ID
  async getVehicleById(vehicleId: string): Promise<{
    success: boolean;
    data: Vehicle;
  }> {
    const response = await apiClient.get(`/vehicles/${vehicleId}`);
    return response.data;
  },

  // Get vehicle by plate number (Admin/Police)
  async getVehicleByPlateNo(plateNo: string): Promise<{
    success: boolean;
    data: Vehicle;
  }> {
    const response = await apiClient.get(`/vehicles/by-plate/${plateNo}`);
    return response.data;
  },

  // Update vehicle
  async updateVehicle(
    vehicleId: string,
    data: UpdateVehicleDTO
  ): Promise<{
    success: boolean;
    message: string;
    data: Vehicle;
  }> {
    const response = await apiClient.patch(`/vehicles/${vehicleId}`, data);
    return response.data;
  },

  // Delete vehicle (soft delete)
  async deleteVehicle(vehicleId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.delete(`/vehicles/${vehicleId}`);
    return response.data;
  },

  // Get vehicle statistics
  async getVehicleStats(vehicleId: string): Promise<{
    success: boolean;
    data: {
      vehicleId: string;
      plateNo: string;
      totalViolations: number;
      pendingViolations: number;
      confirmedViolations: number;
      totalFines: number;
      unpaidFines: number;
      paidFines: number;
    };
  }> {
    const response = await apiClient.get(`/vehicles/${vehicleId}/stats`);
    return response.data;
  },

  // Search vehicles (Admin/Police)
  async searchVehicles(
    query: string,
    limit?: number
  ): Promise<{
    success: boolean;
    data: Vehicle[];
  }> {
    const response = await apiClient.get("/vehicles/search", {
      params: { q: query, limit },
    });
    return response.data;
  },
};
