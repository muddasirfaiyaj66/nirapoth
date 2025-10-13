import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AdminApiService } from "@/lib/api/admin.api";

// Types
export interface Violation {
  id: string;
  violationType: string;
  description: string;
  fineAmount: number;
  status: "PENDING" | "CONFIRMED" | "DISPUTED" | "RESOLVED";
  detectionMethod: "AI_CAMERA" | "MANUAL" | "CITIZEN_REPORT";
  location: string;
  vehiclePlateNumber?: string;
  driverName?: string;
  evidenceImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ViolationsState {
  violations: Violation[];
  loading: boolean;
  error: string | null;
  totalViolations: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  statusFilter: string;
  methodFilter: string;
}

const initialState: ViolationsState = {
  violations: [],
  loading: false,
  error: null,
  totalViolations: 0,
  currentPage: 1,
  totalPages: 1,
  searchTerm: "",
  statusFilter: "all",
  methodFilter: "all",
};

// Async thunks
export const fetchViolations = createAsyncThunk(
  "admin/fetchViolations",
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    method?: string;
  }) => {
    return AdminApiService.getViolations(params);
  }
);

export const updateViolationStatus = createAsyncThunk(
  "admin/updateViolationStatus",
  async ({ violationId, status }: { violationId: string; status: string }) => {
    const result = await AdminApiService.updateViolationStatus(
      violationId,
      status
    );
    return { violationId, status, result };
  }
);

// Slice
const adminViolationsSlice = createSlice({
  name: "adminViolations",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    setMethodFilter: (state, action: PayloadAction<string>) => {
      state.methodFilter = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
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
        state.violations = action.payload.data.violations;
        state.totalViolations = action.payload.data.total;
        state.currentPage = action.payload.data.page;
        state.totalPages = Math.ceil(
          action.payload.data.total / (action.payload.data.limit || 10)
        );
      })
      .addCase(fetchViolations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch violations";
      })
      // Update violation status
      .addCase(updateViolationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateViolationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const violation = state.violations.find(
          (v) => v.id === action.payload.violationId
        );
        if (violation) {
          violation.status = action.payload.status as Violation["status"];
        }
      })
      .addCase(updateViolationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to update violation status";
      });
  },
});

export const {
  setSearchTerm,
  setStatusFilter,
  setMethodFilter,
  setCurrentPage,
  clearError,
} = adminViolationsSlice.actions;

export default adminViolationsSlice.reducer;
