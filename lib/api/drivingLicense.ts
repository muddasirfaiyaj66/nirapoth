import apiClient from "./apiClient";

export interface DrivingLicense {
  id: string;
  licenseNo: string;
  citizenId: string;
  category: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  gems: number;
  isBlacklisted: boolean;
  blacklistedAt?: string;
  blacklistReason?: string;
  blacklistPenaltyPaid: boolean;
  isActive: boolean;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  restrictions: string[];
  endorsements: string[];
  violationCount: number;
  lastViolationAt?: string;
  isSuspended: boolean;
  suspendedUntil?: string;
  suspensionReason?: string;
  createdAt: string;
  updatedAt: string;
  citizen: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profileImage?: string;
    dateOfBirth?: string;
    address?: string;
  };
}

export interface CreateDrivingLicenseDTO {
  licenseNo: string;
  category: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  restrictions?: string[];
  endorsements?: string[];
}

export interface UpdateDrivingLicenseDTO {
  category?: string;
  expiryDate?: string;
  restrictions?: string[];
  endorsements?: string[];
  isActive?: boolean;
}

export const drivingLicenseApi = {
  // Create a new driving license
  async createLicense(data: CreateDrivingLicenseDTO): Promise<{
    success: boolean;
    message: string;
    data: DrivingLicense;
  }> {
    const response = await apiClient.post("/driving-licenses", data);
    return response.data;
  },

  // Get current user's driving license
  async getMyLicense(): Promise<{
    success: boolean;
    data?: DrivingLicense;
    message?: string;
  }> {
    try {
      const response = await apiClient.get("/driving-licenses/my-license");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "No driving license found",
        };
      }
      throw error;
    }
  },

  // Update driving license
  async updateLicense(
    licenseId: string,
    data: UpdateDrivingLicenseDTO
  ): Promise<{
    success: boolean;
    message: string;
    data: DrivingLicense;
  }> {
    const response = await apiClient.patch(
      `/driving-licenses/${licenseId}`,
      data
    );
    return response.data;
  },

  // Get license by ID (Admin/Police)
  async getLicenseById(licenseId: string): Promise<{
    success: boolean;
    data: DrivingLicense;
  }> {
    const response = await apiClient.get(`/driving-licenses/${licenseId}`);
    return response.data;
  },

  // Get license by license number (Admin/Police)
  async getLicenseByLicenseNo(licenseNo: string): Promise<{
    success: boolean;
    data: DrivingLicense;
  }> {
    const response = await apiClient.get(
      `/driving-licenses/by-license-no/${licenseNo}`
    );
    return response.data;
  },

  // Check license validity
  async checkValidity(licenseId: string): Promise<{
    success: boolean;
    data: {
      valid: boolean;
      reason?: string;
    };
  }> {
    const response = await apiClient.get(
      `/driving-licenses/${licenseId}/validity`
    );
    return response.data;
  },

  // Deduct gems (Police only)
  async deductGems(
    licenseId: string,
    gemsToDeduct: number,
    reason: string
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      license: DrivingLicense;
      blacklisted: boolean;
      remainingGems: number;
    };
  }> {
    const response = await apiClient.post(
      `/driving-licenses/${licenseId}/deduct-gems`,
      {
        gemsToDeduct,
        reason,
      }
    );
    return response.data;
  },

  // Get blacklisted licenses (Admin/Police)
  async getBlacklistedLicenses(): Promise<{
    success: boolean;
    data: DrivingLicense[];
  }> {
    const response = await apiClient.get("/driving-licenses/blacklisted");
    return response.data;
  },

  // Pay blacklist penalty
  async payBlacklistPenalty(licenseId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post(
      `/driving-licenses/${licenseId}/pay-blacklist-penalty`
    );
    return response.data;
  },
};
