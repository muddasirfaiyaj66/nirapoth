import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { adminApi } from "@/lib/api/admin";

export interface Violation {
  id: string;
  type: string;
  description: string;
  vehicleId: string;
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

export interface ViolationState {
  violations: Violation[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    status?: string;
    type?: string;
    search?: string;
  };
}

const initialState: ViolationState = {
  violations: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {},
};

// Async thunks
export const fetchViolations = createAsyncThunk(
  "violation/fetchViolations",
  async (
    params: { page?: number; limit?: number; status?: string; type?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.getAllViolations(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch violations"
      );
    }
  }
);

export const createViolation = createAsyncThunk(
  "violation/createViolation",
  async (
    violationData: {
      vehiclePlate: string;
      violationType: string;
      description: string;
      location: {
        latitude: number;
        longitude: number;
        address?: string;
        city?: string;
        district?: string;
      };
      evidenceUrl: string[];
      fineAmount: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.createViolation(violationData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create violation"
      );
    }
  }
);

export const updateViolationStatus = createAsyncThunk(
  "violation/updateStatus",
  async (
    { violationId, status }: { violationId: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.updateViolationStatus(
        violationId,
        status
      );
      return { violationId, status, violation: response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update violation status"
      );
    }
  }
);

const violationSlice = createSlice({
  name: "violation",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<ViolationState["pagination"]>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<ViolationState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch violations
      .addCase(fetchViolations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchViolations.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.violations = action.payload.data.violations;
          state.pagination = action.payload.data.pagination;
        }
      })
      .addCase(fetchViolations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create violation
      .addCase(createViolation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createViolation.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new violation to the beginning of the list
        if (action.payload.data?.violation) {
          state.violations.unshift(action.payload.data.violation);
        }
      })
      .addCase(createViolation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update violation status
      .addCase(updateViolationStatus.fulfilled, (state, action) => {
        const { violationId, status } = action.payload;
        const violationIndex = state.violations.findIndex(
          (violation) => violation.id === violationId
        );
        if (violationIndex !== -1) {
          state.violations[violationIndex].status = status;
        }
      });
  },
});

export const { clearError, setPagination, setFilters } = violationSlice.actions;
export default violationSlice.reducer;
