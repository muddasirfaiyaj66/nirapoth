import api from "./auth";

// Types
export interface DrivingLicense {
  id: string;
  licenseNo: string;
  citizenId: string;
  category:
    | "LIGHT_VEHICLE"
    | "MOTORCYCLE"
    | "LIGHT_VEHICLE_MOTORCYCLE"
    | "HEAVY_VEHICLE"
    | "PSV"
    | "GOODS_VEHICLE";
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  isActive: boolean;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  restrictions?: string[];
  endorsements?: string[];
  violationCount: number;
  lastViolationAt?: string;
  isSuspended: boolean;
  suspendedUntil?: string;
  suspensionReason?: string;
  createdAt: string;
  updatedAt: string;
  citizen?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateLicenseData {
  licenseNo: string;
  category:
    | "LIGHT_VEHICLE"
    | "MOTORCYCLE"
    | "LIGHT_VEHICLE_MOTORCYCLE"
    | "HEAVY_VEHICLE"
    | "PSV"
    | "GOODS_VEHICLE";
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  restrictions?: string[];
  endorsements?: string[];
}

export interface SuspendLicenseData {
  suspendedUntil: string;
  reason: string;
}

export interface LicenseSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

// API functions
export const drivingLicenseApi = {
  // Get user's licenses
  getUserLicenses: async () => {
    const response = await api.get("/driving-license/my-licenses");
    return response.data;
  },

  // Get citizen's licenses
  getCitizenLicenses: async (citizenId: string) => {
    const response = await api.get(`/driving-license/citizen/${citizenId}`);
    return response.data;
  },

  // Add new driving license for citizen
  addLicense: async (citizenId: string, data: CreateLicenseData) => {
    const response = await api.post(
      `/driving-license/citizen/${citizenId}`,
      data
    );
    return response.data;
  },

  // Add new driving license for current user
  addMyLicense: async (data: CreateLicenseData) => {
    const response = await api.post("/driving-license/my-licenses", data);
    return response.data;
  },

  // Verify driving license
  verifyLicense: async (licenseId: string) => {
    const response = await api.put(`/driving-license/${licenseId}/verify`);
    return response.data;
  },

  // Suspend driving license
  suspendLicense: async (licenseId: string, data: SuspendLicenseData) => {
    const response = await api.put(
      `/driving-license/${licenseId}/suspend`,
      data
    );
    return response.data;
  },

  // Reactivate driving license
  reactivateLicense: async (licenseId: string) => {
    const response = await api.put(`/driving-license/${licenseId}/reactivate`);
    return response.data;
  },

  // Get all licenses (Admin/Police only)
  getAllLicenses: async (params?: LicenseSearchParams) => {
    const response = await api.get("/driving-license", { params });
    return response.data;
  },

  // Get license by ID
  getLicenseById: async (licenseId: string) => {
    const response = await api.get(`/driving-license/${licenseId}`);
    return response.data;
  },

  // Update license
  updateLicense: async (
    licenseId: string,
    data: Partial<CreateLicenseData>
  ) => {
    const response = await api.put(`/driving-license/${licenseId}`, data);
    return response.data;
  },

  // Delete license
  deleteLicense: async (licenseId: string) => {
    const response = await api.delete(`/driving-license/${licenseId}`);
    return response.data;
  },

  // Get license statistics
  getLicenseStats: async () => {
    const response = await api.get("/driving-license/stats");
    return response.data;
  },
};
