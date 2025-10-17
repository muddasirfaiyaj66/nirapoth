import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { drivingLicenseApi, DrivingLicense, CreateDrivingLicenseDTO, UpdateDrivingLicenseDTO } from "@/lib/api/drivingLicense";

interface DrivingLicenseState {
  license: DrivingLicense | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: DrivingLicenseState = {
  license: null,
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunks
export const fetchMyLicense = createAsyncThunk(
  "drivingLicense/fetchMyLicense",
  async (_, { rejectWithValue }) => {
    try {
      const response = await drivingLicenseApi.getMyLicense();
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch license"
      );
    }
  }
);

export const createLicense = createAsyncThunk(
  "drivingLicense/createLicense",
  async (data: CreateDrivingLicenseDTO, { dispatch, rejectWithValue }) => {
    try {
      const response = await drivingLicenseApi.createLicense(data);
      // Refetch after creation
      dispatch(fetchMyLicense());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create license"
      );
    }
  }
);

export const updateLicense = createAsyncThunk(
  "drivingLicense/updateLicense",
  async (
    { licenseId, data }: { licenseId: string; data: UpdateDrivingLicenseDTO },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await drivingLicenseApi.updateLicense(licenseId, data);
      // Refetch after update
      dispatch(fetchMyLicense());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update license"
      );
    }
  }
);

export const payBlacklistPenalty = createAsyncThunk(
  "drivingLicense/payBlacklistPenalty",
  async (licenseId: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await drivingLicenseApi.payBlacklistPenalty(licenseId);
      // Refetch after payment
      dispatch(fetchMyLicense());
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to pay penalty"
      );
    }
  }
);

const drivingLicenseSlice = createSlice({
  name: "drivingLicense",
  initialState,
  reducers: {
    clearLicense: (state) => {
      state.license = null;
      state.error = null;
      state.lastFetched = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch my license
    builder
      .addCase(fetchMyLicense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLicense.fulfilled, (state, action) => {
        state.loading = false;
        state.license = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchMyLicense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create license
    builder
      .addCase(createLicense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLicense.fulfilled, (state) => {
        state.loading = false;
        // License will be updated by fetchMyLicense dispatch
      })
      .addCase(createLicense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update license
    builder
      .addCase(updateLicense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLicense.fulfilled, (state) => {
        state.loading = false;
        // License will be updated by fetchMyLicense dispatch
      })
      .addCase(updateLicense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Pay blacklist penalty
    builder
      .addCase(payBlacklistPenalty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payBlacklistPenalty.fulfilled, (state) => {
        state.loading = false;
        // License will be updated by fetchMyLicense dispatch
      })
      .addCase(payBlacklistPenalty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLicense, clearError } = drivingLicenseSlice.actions;
export default drivingLicenseSlice.reducer;

