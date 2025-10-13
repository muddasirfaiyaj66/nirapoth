import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authFetch } from "../../utils/api";

export interface DrivingLicense {
  id: string;
  userId: string;
  licenseNo: string;
  category:
    | "LIGHT_VEHICLE"
    | "MOTORCYCLE"
    | "LIGHT_VEHICLE_MOTORCYCLE"
    | "HEAVY_VEHICLE"
    | "PSV"
    | "GOODS_VEHICLE";
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "SUSPENDED" | "REVOKED";
  issueDate: string;
  expiryDate: string;
  issuingAuthority?: string;
  restrictions?: string;
  endorsements?: string;
  violationCount: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;

  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface LicenseApplication {
  category:
    | "LIGHT_VEHICLE"
    | "MOTORCYCLE"
    | "LIGHT_VEHICLE_MOTORCYCLE"
    | "HEAVY_VEHICLE"
    | "PSV"
    | "GOODS_VEHICLE";
  previousLicenseNo?: string;
  medicalCertificate?: string;
  isRenewal: boolean;
  additionalDocuments?: string[];
}

export interface LicensesState {
  licenses: DrivingLicense[];
  isLoading: boolean;
  error: string | null;
  selectedLicense: DrivingLicense | null;
}

const initialState: LicensesState = {
  licenses: [],
  isLoading: false,
  error: null,
  selectedLicense: null,
};

// Async thunks
export const fetchLicenses = createAsyncThunk(
  "licenses/fetchLicenses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch("driving-license");

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to fetch licenses");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const applyForLicense = createAsyncThunk(
  "licenses/applyForLicense",
  async (formData: LicenseApplication, { rejectWithValue }) => {
    try {
      const response = await authFetch("driving-license/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to apply for license");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const renewLicense = createAsyncThunk(
  "licenses/renewLicense",
  async (licenseId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/driving-license/renew/${licenseId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to renew license");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const updateLicense = createAsyncThunk(
  "licenses/updateLicense",
  async (
    {
      id,
      ...updateData
    }: {
      id: string;
      restrictions?: string;
      endorsements?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/driving-license/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to update license");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const suspendLicense = createAsyncThunk(
  "licenses/suspendLicense",
  async (
    { id, reason }: { id: string; reason: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/driving-license/suspend/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to suspend license");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const validateLicense = createAsyncThunk(
  "licenses/validateLicense",
  async (licenseNo: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/driving-license/validate/${licenseNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to validate license");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

const licensesSlice = createSlice({
  name: "licenses",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedLicense: (
      state,
      action: PayloadAction<DrivingLicense | null>
    ) => {
      state.selectedLicense = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch licenses
    builder
      .addCase(fetchLicenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLicenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.licenses = action.payload;
        state.error = null;
      })
      .addCase(fetchLicenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Apply for license
    builder
      .addCase(applyForLicense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyForLicense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.licenses.push(action.payload);
        state.error = null;
      })
      .addCase(applyForLicense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Renew license
    builder
      .addCase(renewLicense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(renewLicense.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.licenses.findIndex(
          (l) => l.id === action.payload.id
        );
        if (index !== -1) {
          state.licenses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(renewLicense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update license
    builder
      .addCase(updateLicense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLicense.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.licenses.findIndex(
          (l) => l.id === action.payload.id
        );
        if (index !== -1) {
          state.licenses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateLicense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Suspend license
    builder
      .addCase(suspendLicense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(suspendLicense.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.licenses.findIndex(
          (l) => l.id === action.payload.id
        );
        if (index !== -1) {
          state.licenses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(suspendLicense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Validate license
    builder
      .addCase(validateLicense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateLicense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(validateLicense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedLicense } = licensesSlice.actions;
export default licensesSlice.reducer;
