import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  speedMonitoringApi,
  SpeedViolation,
  SpeedMonitoringStats,
  SpeedViolationSearchParams,
  FileCaseData,
  SpeedZoneLimits,
} from "@/lib/api/speedMonitoring";

interface SpeedMonitoringState {
  violations: SpeedViolation[];
  stats: SpeedMonitoringStats | null;
  zoneLimits: SpeedZoneLimits | null;
  selectedViolation: SpeedViolation | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: SpeedViolationSearchParams;
}

const initialState: SpeedMonitoringState = {
  violations: [],
  stats: null,
  zoneLimits: null,
  selectedViolation: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
};

// Async Thunks
export const fetchSpeedViolations = createAsyncThunk(
  "speedMonitoring/fetchAll",
  async (params: SpeedViolationSearchParams = {}) => {
    const response = await speedMonitoringApi.getAll(params);
    return response;
  }
);

export const fetchSpeedViolationById = createAsyncThunk(
  "speedMonitoring/fetchById",
  async (id: string) => {
    const response = await speedMonitoringApi.getById(id);
    return response;
  }
);

export const fetchSpeedStats = createAsyncThunk(
  "speedMonitoring/fetchStats",
  async () => {
    const response = await speedMonitoringApi.getStats();
    return response;
  }
);

export const fetchZoneLimits = createAsyncThunk(
  "speedMonitoring/fetchZoneLimits",
  async () => {
    const response = await speedMonitoringApi.getZoneLimits();
    return response;
  }
);

export const fileSpeedCase = createAsyncThunk(
  "speedMonitoring/fileCase",
  async (data: FileCaseData) => {
    const response = await speedMonitoringApi.fileCase(data);
    return { ...response, violationId: data.violationId };
  }
);

export const fetchRecentViolations = createAsyncThunk(
  "speedMonitoring/fetchRecent",
  async (limit: number = 20) => {
    const response = await speedMonitoringApi.getRecent(limit);
    return response;
  }
);

const speedMonitoringSlice = createSlice({
  name: "speedMonitoring",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<SpeedViolationSearchParams>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setPagination: (
      state,
      action: PayloadAction<{ page?: number; limit?: number }>
    ) => {
      if (action.payload.page) state.pagination.page = action.payload.page;
      if (action.payload.limit) state.pagination.limit = action.payload.limit;
    },
    setSelectedViolation: (
      state,
      action: PayloadAction<SpeedViolation | null>
    ) => {
      state.selectedViolation = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all violations
    builder
      .addCase(fetchSpeedViolations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpeedViolations.fulfilled, (state, action) => {
        state.loading = false;
        state.violations = action.payload.violations;
        state.pagination = {
          page: action.payload.page,
          limit: state.pagination.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchSpeedViolations.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch speed violations";
      });

    // Fetch violation by ID
    builder
      .addCase(fetchSpeedViolationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpeedViolationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedViolation = action.payload;
      })
      .addCase(fetchSpeedViolationById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch violation details";
      });

    // Fetch stats
    builder
      .addCase(fetchSpeedStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchSpeedStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchSpeedStats.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch statistics";
      });

    // Fetch zone limits
    builder
      .addCase(fetchZoneLimits.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchZoneLimits.fulfilled, (state, action) => {
        state.zoneLimits = action.payload;
      })
      .addCase(fetchZoneLimits.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch zone limits";
      });

    // File case
    builder
      .addCase(fileSpeedCase.pending, (state) => {
        state.error = null;
      })
      .addCase(fileSpeedCase.fulfilled, (state, action) => {
        // Update the violation in the list
        const index = state.violations.findIndex(
          (v) => v.id === action.payload.violationId
        );
        if (index !== -1) {
          state.violations[index].caseFiled = true;
          state.violations[index].caseId = action.payload.caseId;
        }
        // Update selected violation if it's the same
        if (state.selectedViolation?.id === action.payload.violationId) {
          state.selectedViolation.caseFiled = true;
          state.selectedViolation.caseId = action.payload.caseId;
        }
      })
      .addCase(fileSpeedCase.rejected, (state, action) => {
        state.error = action.error.message || "Failed to file case";
      });

    // Fetch recent violations
    builder
      .addCase(fetchRecentViolations.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchRecentViolations.fulfilled, (state, action) => {
        state.violations = action.payload;
      })
      .addCase(fetchRecentViolations.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to fetch recent violations";
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setPagination,
  setSelectedViolation,
  clearError,
} = speedMonitoringSlice.actions;

export default speedMonitoringSlice.reducer;
