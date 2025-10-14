import api from "./auth";

// Types
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "CITIZEN" | "POLICE" | "FIRE_SERVICE" | "ADMIN" | "SUPER_ADMIN";
  designation?: string;
  stationId?: string;
  nidNo?: string;
  birthCertificateNo?: string;
  profileImage?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Personal Information
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  // Contact Information
  alternatePhone?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  // Address Information
  presentAddress?: string;
  presentCity?: string;
  presentDistrict?: string;
  presentDivision?: string;
  presentPostalCode?: string;
  permanentAddress?: string;
  permanentCity?: string;
  permanentDistrict?: string;
  permanentDivision?: string;
  permanentPostalCode?: string;
  // Driving License Information
  drivingLicenseNo?: string;
  drivingLicenseIssueDate?: string;
  drivingLicenseExpiryDate?: string;
  drivingLicenseCategory?: string;
  isDrivingLicenseVerified: boolean;
  // Professional Information
  badgeNo?: string;
  joiningDate?: string;
  serviceLength?: number;
  rank?: string;
  specialization?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  nidNo?: string;
  birthCertificateNo?: string;
  profileImage?: string;
  // Personal Information
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  // Contact Information
  alternatePhone?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  // Address Information
  presentAddress?: string;
  presentCity?: string;
  presentDistrict?: string;
  presentDivision?: string;
  presentPostalCode?: string;
  permanentAddress?: string;
  permanentCity?: string;
  permanentDistrict?: string;
  permanentDivision?: string;
  permanentPostalCode?: string;
  // Professional Information
  designation?: string;
  badgeNo?: string;
  joiningDate?: string;
  serviceLength?: number;
  rank?: string;
  specialization?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UploadProfileImageData {
  image: File;
}

// API functions
export const userProfileApi = {
  // Get current user profile
  getMyProfile: async (): Promise<{
    success: boolean;
    data: { user: UserProfile };
  }> => {
    const response = await api.get("/user-profile/me");
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put("/user-profile/me", data);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordData) => {
    const response = await api.put("/user-profile/change-password", data);
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (data: UploadProfileImageData) => {
    const formData = new FormData();
    formData.append("image", data.image);

    const response = await api.post("/user-profile/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete profile image
  deleteProfileImage: async () => {
    const response = await api.delete("/user-profile/image");
    return response.data;
  },

  // Get user by ID (Admin/Police only)
  getUserById: async (userId: string) => {
    const response = await api.get(`/user-profile/${userId}`);
    return response.data;
  },

  // Update user by ID (Admin only)
  updateUserById: async (userId: string, data: UpdateProfileData) => {
    const response = await api.put(`/user-profile/${userId}`, data);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get("/user-profile/stats");
    return response.data;
  },
};
