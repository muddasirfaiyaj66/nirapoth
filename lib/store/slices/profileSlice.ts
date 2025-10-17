import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/apiClient";

// Types
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  bloodGroup?: string;
  profileImage?: string;
  alternatePhone?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  presentAddress?: string;
  presentCity?: string;
  presentDistrict?: string;
  presentDivision?: string;
  presentUpazila?: string;
  presentPostalCode?: string;
  permanentAddress?: string;
  permanentCity?: string;
  permanentDistrict?: string;
  permanentDivision?: string;
  permanentUpazila?: string;
  permanentPostalCode?: string;
  designation?: string;
  badgeNo?: string;
  joiningDate?: string;
  rank?: string;
  specialization?: string;
  role: "CITIZEN" | "POLICE" | "FIRE_SERVICE" | "ADMIN";
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStatistics {
  totalApplications?: number;
  approvedApplications?: number;
  pendingApplications?: number;
  rejectedApplications?: number;
  totalLicenses?: number;
  activeLicenses?: number;
  expiredLicenses?: number;
  totalVehicles?: number;
  activeVehicles?: number;
  totalFines?: number;
  paidFines?: number;
  unpaidFines?: number;
  totalViolations?: number;
  gems?: number;
  activeAssignments?: number;
  isRestricted?: boolean;
}

export interface ProfileValidation {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  requiredFields: string[];
}

export interface ProfileState {
  profile: UserProfile | null;
  statistics: UserStatistics | null;
  validation: ProfileValidation | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  statisticsLoading: boolean;
  validationLoading: boolean;
}

const initialState: ProfileState = {
  profile: null,
  statistics: null,
  validation: null,
  loading: false,
  error: null,
  updateLoading: false,
  statisticsLoading: false,
  validationLoading: false,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<UserProfile>("/profile/me");

      if (!response.success) {
        throw new Error(response.error?.message || "Failed to fetch profile");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await api.put<UserProfile>(
        "/profile/update",
        profileData
      );

      if (!response.success) {
        throw new Error(response.error?.message || "Failed to update profile");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const fetchStatistics = createAsyncThunk(
  "profile/fetchStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<UserStatistics>("/profile/statistics");

      if (!response.success) {
        throw new Error(
          response.error?.message || "Failed to fetch statistics"
        );
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch statistics");
    }
  }
);

export const validateProfile = createAsyncThunk(
  "profile/validateProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ProfileValidation>("/profile/validate");

      if (!response.success) {
        throw new Error(
          response.error?.message || "Failed to validate profile"
        );
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to validate profile");
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (
    passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put("/profile/change-password", passwordData);

      if (!response.success) {
        throw new Error(response.error?.message || "Failed to change password");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to change password");
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  "profile/uploadProfileImage",
  async (imageData: { imageUrl: string }, { rejectWithValue }) => {
    try {
      const response = await api.put("/profile/upload-image", imageData);

      if (!response.success) {
        throw new Error(response.error?.message || "Failed to upload image");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to upload image");
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetProfile: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Merge the updated data into the existing profile
        if (state.profile && action.payload) {
          state.profile = {
            ...state.profile,
            ...action.payload,
          };
        } else {
          state.profile = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Statistics
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = action.payload;
        state.error = null;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.error = action.payload as string;
      });

    // Validate Profile
    builder
      .addCase(validateProfile.pending, (state) => {
        state.validationLoading = true;
        state.error = null;
      })
      .addCase(validateProfile.fulfilled, (state, action) => {
        state.validationLoading = false;
        state.validation = action.payload;
        state.error = null;
      })
      .addCase(validateProfile.rejected, (state, action) => {
        state.validationLoading = false;
        state.error = action.payload as string;
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.updateLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    // Upload Profile Image
    builder
      .addCase(uploadProfileImage.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (state.profile) {
          state.profile.profileImage = action.payload.imageUrl;
        }
        state.error = null;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
