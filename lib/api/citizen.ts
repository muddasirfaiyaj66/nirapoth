import api from "./auth";

// Types
export interface Vehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  type: string;
  color: string;
  status: string;
  registrationDate: string;
  ownerId: string;
}

export interface Violation {
  id: string;
  type: string;
  description: string;
  vehicleId: string;
  vehicle: {
    licensePlate: string;
  };
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  fineAmount: number;
  status: string;
  violationDate: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  type: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  description: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Citizen API functions
export const citizenApi = {
  // Vehicle Management
  getMyVehicles: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    vehicles: Vehicle[];
    pagination: PaginationData;
  }> => {
    const response = await api.get("/citizen/vehicles", { params });
    return response.data;
  },

  registerVehicle: async (vehicleData: {
    licensePlate: string;
    make: string;
    model: string;
    year: number;
    type: string;
    color: string;
  }): Promise<Vehicle> => {
    const response = await api.post("/citizen/vehicles", vehicleData);
    return response.data;
  },

  updateVehicle: async (
    vehicleId: string,
    vehicleData: Partial<Vehicle>
  ): Promise<Vehicle> => {
    const response = await api.put(
      `/citizen/vehicles/${vehicleId}`,
      vehicleData
    );
    return response.data;
  },

  deleteVehicle: async (vehicleId: string): Promise<void> => {
    await api.delete(`/citizen/vehicles/${vehicleId}`);
  },

  // Violations
  getMyViolations: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<{
    violations: Violation[];
    pagination: PaginationData;
  }> => {
    const response = await api.get("/citizen/violations", { params });
    return response.data;
  },

  getViolationById: async (violationId: string): Promise<Violation> => {
    const response = await api.get(`/citizen/violations/${violationId}`);
    return response.data;
  },

  appealViolation: async (
    violationId: string,
    reason: string
  ): Promise<any> => {
    const response = await api.post(
      `/citizen/violations/${violationId}/appeal`,
      {
        reason,
      }
    );
    return response.data;
  },

  // Complaints
  getMyComplaints: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }): Promise<{
    complaints: Complaint[];
    pagination: PaginationData;
  }> => {
    const response = await api.get("/citizen/complaints", { params });
    return response.data;
  },

  createComplaint: async (complaintData: {
    type: string;
    title: string;
    description: string;
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    priority?: string;
  }): Promise<Complaint> => {
    const response = await api.post("/citizen/complaints", complaintData);
    return response.data;
  },

  updateComplaint: async (
    complaintId: string,
    complaintData: Partial<Complaint>
  ): Promise<Complaint> => {
    const response = await api.put(
      `/citizen/complaints/${complaintId}`,
      complaintData
    );
    return response.data;
  },

  // Payments
  getMyPayments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    payments: Payment[];
    pagination: PaginationData;
  }> => {
    const response = await api.get("/citizen/payments", { params });
    return response.data;
  },

  createPayment: async (paymentData: {
    amount: number;
    method: string;
    description: string;
    violationId?: string;
  }): Promise<Payment> => {
    const response = await api.post("/citizen/payments", paymentData);
    return response.data;
  },

  // Profile
  getMyProfile: async (): Promise<any> => {
    const response = await api.get("/citizen/profile");
    return response.data;
  },

  updateMyProfile: async (profileData: any): Promise<any> => {
    const response = await api.put("/citizen/profile", profileData);
    return response.data;
  },

  // Gems/Rewards
  getMyGems: async (): Promise<{
    totalGems: number;
    recentActivities: any[];
  }> => {
    const response = await api.get("/citizen/gems");
    return response.data;
  },

  // Emergency Contacts
  getEmergencyContacts: async (): Promise<any[]> => {
    const response = await api.get("/citizen/emergency-contacts");
    return response.data;
  },
};
