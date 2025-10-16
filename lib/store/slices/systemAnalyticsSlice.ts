import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import { AdminApiService } from "../../api/admin.api";

// Types for system analytics data
export interface SystemHealth {
  uptime: number;
  memoryUsage: number;
  totalMemory: number;
  cpuUsage: number;
  activeConnections: number;
  responseTime: number;
}

export interface UserRoleDistribution {
  role: string;
  count: number;
  color: string;
}

export interface ViolationTypeDistribution {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TimeSeriesData {
  month: string;
  users?: number;
  violations?: number;
  revenue?: number;
  complaints?: number;
  resolved?: number;
  resolutionRate?: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
  totalAmount?: number;
  color?: string;
  percentage?: number;
}

export interface SystemAnalyticsData {
  // Overview stats
  totalUsers: number;
  totalViolations: number;
  totalFines: number;
  totalComplaints: number;
  totalRevenue: number;
  paidRevenue: number;

  // Time-series data
  userGrowthData: TimeSeriesData[];
  violationTrendData: TimeSeriesData[];
  monthlyPerformance: TimeSeriesData[];

  // Distribution data
  userRoleDistribution: UserRoleDistribution[];
  violationTypeDistribution: ViolationTypeDistribution[];

  // Status breakdowns
  violationsByStatus: StatusBreakdown[];
  finesByStatus: StatusBreakdown[];
  complaintsByStatus: StatusBreakdown[];

  // System health
  systemHealth: SystemHealth;

  // Additional metrics
  pendingViolations: number;
  confirmedViolations: number;
  disputedViolations: number;
  resolvedViolations: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  paidFines: number;
  unpaidFines: number;
  cancelledFines: number;
  disputedFines: number;

  // Metadata
  dateRange: {
    startDate: string;
    endDate: string;
  };
  generatedAt: string;
}

export interface SystemAnalyticsState {
  data: SystemAnalyticsData | null;
  loading: boolean;
  error: string | null;
  lastFetched: string | null;
  selectedTimeRange: string;
  refreshInterval: number | null;
}

const initialState: SystemAnalyticsState = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
  selectedTimeRange: "6months",
  refreshInterval: null,
};

// Async thunks for API calls
export const fetchSystemAnalytics = createAsyncThunk(
  "systemAnalytics/fetchSystemAnalytics",
  async (timeRange: string = "6months", { rejectWithValue }) => {
    try {
      const response = await AdminApiService.getSystemAnalytics({
        range: timeRange,
      });
      return {
        ...response.data,
        timeRange,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch system analytics"
      );
    }
  }
);

export const refreshSystemAnalytics = createAsyncThunk(
  "systemAnalytics/refreshSystemAnalytics",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { systemAnalytics: SystemAnalyticsState };
      const timeRange = state.systemAnalytics.selectedTimeRange;

      const response = await AdminApiService.getSystemAnalytics({
        range: timeRange,
      });
      return {
        ...response.data,
        timeRange,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to refresh system analytics"
      );
    }
  }
);

// System analytics slice
const systemAnalyticsSlice = createSlice({
  name: "systemAnalytics",
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<string>) => {
      state.selectedTimeRange = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    setRefreshInterval: (state, action: PayloadAction<number | null>) => {
      state.refreshInterval = action.payload;
    },

    updateSystemHealth: (
      state,
      action: PayloadAction<Partial<SystemHealth>>
    ) => {
      if (state.data) {
        state.data.systemHealth = {
          ...state.data.systemHealth,
          ...action.payload,
        };
      }
    },

    incrementViolationCount: (
      state,
      action: PayloadAction<{ status: string }>
    ) => {
      if (state.data) {
        state.data.totalViolations += 1;

        // Update status breakdown
        const statusBreakdown = state.data.violationsByStatus.find(
          (item) => item.status === action.payload.status
        );
        if (statusBreakdown) {
          statusBreakdown.count += 1;
        }

        // Update additional metrics
        switch (action.payload.status) {
          case "PENDING":
            state.data.pendingViolations += 1;
            break;
          case "CONFIRMED":
            state.data.confirmedViolations += 1;
            break;
          case "DISPUTED":
            state.data.disputedViolations += 1;
            break;
          case "RESOLVED":
            state.data.resolvedViolations += 1;
            break;
        }
      }
    },

    updateRevenue: (
      state,
      action: PayloadAction<{ amount: number; isPaid: boolean }>
    ) => {
      if (state.data) {
        state.data.totalRevenue += action.payload.amount;
        if (action.payload.isPaid) {
          state.data.paidRevenue += action.payload.amount;
        }
      }
    },

    resetAnalytics: (state) => {
      state.data = null;
      state.error = null;
      state.lastFetched = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch system analytics
    builder
      .addCase(fetchSystemAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload as SystemAnalyticsData;
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchSystemAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Refresh system analytics
    builder
      .addCase(refreshSystemAnalytics.pending, (state) => {
        // Don't set loading to true for refresh to avoid UI flicker
        state.error = null;
      })
      .addCase(refreshSystemAnalytics.fulfilled, (state, action) => {
        state.data = action.payload as SystemAnalyticsData;
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(refreshSystemAnalytics.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setTimeRange,
  clearError,
  setRefreshInterval,
  updateSystemHealth,
  incrementViolationCount,
  updateRevenue,
  resetAnalytics,
} = systemAnalyticsSlice.actions;

export default systemAnalyticsSlice.reducer;

// Base selectors
const selectSystemAnalyticsState = (state: {
  systemAnalytics: SystemAnalyticsState;
}) => state.systemAnalytics;

const selectSystemAnalyticsData = (state: {
  systemAnalytics: SystemAnalyticsState;
}) => state.systemAnalytics.data;

// Memoized selectors
export const selectSystemAnalytics = createSelector(
  [selectSystemAnalyticsData],
  (data) => data
);

export const selectSystemAnalyticsLoading = createSelector(
  [selectSystemAnalyticsState],
  (state) => state.loading
);

export const selectSystemAnalyticsError = createSelector(
  [selectSystemAnalyticsState],
  (state) => state.error
);

export const selectSystemHealthMetrics = createSelector(
  [selectSystemAnalyticsData],
  (data) => data?.systemHealth
);

export const selectViolationMetrics = createSelector(
  [selectSystemAnalyticsData],
  (data) => {
    if (!data) return null;

    return {
      total: data.totalViolations,
      pending: data.pendingViolations,
      confirmed: data.confirmedViolations,
      disputed: data.disputedViolations,
      resolved: data.resolvedViolations,
      byStatus: data.violationsByStatus,
      byType: data.violationTypeDistribution,
    };
  }
);

export const selectRevenueMetrics = createSelector(
  [selectSystemAnalyticsData],
  (data) => {
    if (!data) return null;

    return {
      total: data.totalRevenue,
      paid: data.paidRevenue,
      unpaid: data.totalRevenue - data.paidRevenue,
      byStatus: data.finesByStatus,
    };
  }
);

export const selectUserMetrics = createSelector(
  [selectSystemAnalyticsData],
  (data) => {
    if (!data) return null;

    return {
      total: data.totalUsers,
      byRole: data.userRoleDistribution,
      growth: data.userGrowthData,
    };
  }
);

export const selectTimeSeriesData = createSelector(
  [selectSystemAnalyticsData],
  (data) => {
    if (!data) return null;

    return {
      userGrowth: data.userGrowthData,
      violationTrend: data.violationTrendData,
      monthlyPerformance: data.monthlyPerformance,
    };
  }
);

export const selectSystemOverview = createSelector(
  [selectSystemAnalyticsData],
  (data) => {
    if (!data) return null;

    return {
      totalUsers: data.totalUsers,
      totalViolations: data.totalViolations,
      totalRevenue: data.totalRevenue,
      totalComplaints: data.totalComplaints,
      systemHealth: data.systemHealth,
      lastUpdated: data.generatedAt,
    };
  }
);
