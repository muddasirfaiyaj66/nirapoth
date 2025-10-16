import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AdminApiService } from "../../api/admin.api";
import type { RootState } from "../index";

// Types
export interface ViolationByType {
  ruleId: string;
  type: string;
  code: string;
  count: number;
  penalty: number;
  totalPenalty: number;
}

export interface ViolationByLocation {
  location: string;
  district: string;
  thana: string;
  violationCount: number;
  resolvedCount: number;
  resolutionRate: number;
}

export interface LocationHotspot {
  address: string;
  district: string;
  thana: string;
  latitude: number | null;
  longitude: number | null;
  totalViolations: number;
  pendingViolations: number;
  resolvedViolations: number;
  resolutionRate: number;
}

export interface HourlyDistribution {
  hour: number;
  count: number;
  label: string;
}

export interface WeeklyDistribution {
  day: string;
  count: number;
}

export interface MonthlyTrend {
  year: number;
  month: number;
  monthLabel: string;
  violations: number;
  resolved: number;
  resolutionRate: number;
  avgResolutionHours: number;
}

export interface DailyTrend {
  date: string;
  violations: number;
  resolved: number;
  resolutionRate: number;
}

export interface PeakHour {
  hour: number;
  count: number;
  percentage: number;
  timeLabel: string;
}

export interface ViolationByStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface TrafficAnalyticsData {
  // Overview metrics
  totalViolations: number;
  totalResolved: number;
  totalPending: number;
  overallResolutionRate: number;
  avgResolutionTimeHours: number;
  totalResolvedCount: number;

  // Time-based analysis
  hourlyDistribution: HourlyDistribution[];
  weeklyDistribution: WeeklyDistribution[];
  monthlyTrends: MonthlyTrend[];
  dailyTrends: DailyTrend[];
  peakHours: PeakHour[];

  // Location analysis
  locationHotspots: LocationHotspot[];
  violationsByLocation: ViolationByLocation[];

  // Violation type analysis
  violationsByType: ViolationByType[];
  violationsByStatus: ViolationByStatus[];

  // Metadata
  dateRange: {
    startDate: string;
    endDate: string;
    range: string;
  };
  filters: {
    location: string | null;
    violationType: string | null;
  };
  generatedAt: string;
}

interface TrafficAnalyticsState {
  data: TrafficAnalyticsData | null;
  loading: boolean;
  error: string | null;
  selectedTimeRange: string;
  selectedLocation: string | null;
  selectedViolationType: string | null;
  lastRefresh: string | null;
}

const initialState: TrafficAnalyticsState = {
  data: null,
  loading: false,
  error: null,
  selectedTimeRange: "6months",
  selectedLocation: null,
  selectedViolationType: null,
  lastRefresh: null,
};

// Async thunks
export const fetchTrafficAnalytics = createAsyncThunk(
  "trafficAnalytics/fetchTrafficAnalytics",
  async (
    params: { range?: string; location?: string; violationType?: string } = {}
  ) => {
    const { range = "6months", location, violationType } = params;
    const response = await AdminApiService.getTrafficAnalytics({
      range,
      location,
      violationType,
    });
    return response.data;
  }
);

export const refreshTrafficAnalytics = createAsyncThunk(
  "trafficAnalytics/refreshTrafficAnalytics",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { selectedTimeRange, selectedLocation, selectedViolationType } =
      state.trafficAnalytics;
    const response = await AdminApiService.getTrafficAnalytics({
      range: selectedTimeRange,
      location: selectedLocation || undefined,
      violationType: selectedViolationType || undefined,
    });
    return response.data;
  }
);

// Slice
const trafficAnalyticsSlice = createSlice({
  name: "trafficAnalytics",
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<string>) => {
      state.selectedTimeRange = action.payload;
    },
    setLocationFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedLocation = action.payload;
    },
    setViolationTypeFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedViolationType = action.payload;
    },
    clearFilters: (state) => {
      state.selectedLocation = null;
      state.selectedViolationType = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch traffic analytics
      .addCase(fetchTrafficAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrafficAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastRefresh = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchTrafficAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch traffic analytics";
      })

      // Refresh traffic analytics
      .addCase(refreshTrafficAnalytics.pending, (state) => {
        // Don't show loading on refresh to avoid UI flickering
        state.error = null;
      })
      .addCase(refreshTrafficAnalytics.fulfilled, (state, action) => {
        state.data = action.payload;
        state.lastRefresh = new Date().toISOString();
        state.error = null;
      })
      .addCase(refreshTrafficAnalytics.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to refresh traffic analytics";
      });
  },
});

export const {
  setTimeRange,
  setLocationFilter,
  setViolationTypeFilter,
  clearFilters,
  clearError,
  resetState,
} = trafficAnalyticsSlice.actions;

// Selectors
export const selectTrafficAnalytics = (state: RootState) =>
  state.trafficAnalytics.data;
export const selectTrafficAnalyticsLoading = (state: RootState) =>
  state.trafficAnalytics.loading;
export const selectTrafficAnalyticsError = (state: RootState) =>
  state.trafficAnalytics.error;
export const selectTrafficTimeRange = (state: RootState) =>
  state.trafficAnalytics.selectedTimeRange;
export const selectTrafficLocationFilter = (state: RootState) =>
  state.trafficAnalytics.selectedLocation;
export const selectTrafficViolationTypeFilter = (state: RootState) =>
  state.trafficAnalytics.selectedViolationType;
export const selectTrafficLastRefresh = (state: RootState) =>
  state.trafficAnalytics.lastRefresh;

// Computed selectors
export const selectTrafficOverview = (state: RootState) => {
  const data = state.trafficAnalytics.data;
  if (!data) return null;

  return {
    totalViolations: data.totalViolations,
    totalResolved: data.totalResolved,
    totalPending: data.totalPending,
    overallResolutionRate: data.overallResolutionRate,
    avgResolutionTimeHours: data.avgResolutionTimeHours,
    totalResolvedCount: data.totalResolvedCount,
  };
};

export const selectTrafficTimeAnalysis = (state: RootState) => {
  const data = state.trafficAnalytics.data;
  if (!data) return null;

  return {
    hourlyDistribution: data.hourlyDistribution,
    weeklyDistribution: data.weeklyDistribution,
    monthlyTrends: data.monthlyTrends,
    dailyTrends: data.dailyTrends,
    peakHours: data.peakHours,
  };
};

export const selectTrafficLocationAnalysis = (state: RootState) => {
  const data = state.trafficAnalytics.data;
  if (!data) return null;

  return {
    locationHotspots: data.locationHotspots,
    violationsByLocation: data.violationsByLocation,
  };
};

export const selectTrafficViolationAnalysis = (state: RootState) => {
  const data = state.trafficAnalytics.data;
  if (!data) return null;

  return {
    violationsByType: data.violationsByType,
    violationsByStatus: data.violationsByStatus,
  };
};

export const selectTrafficPeakInsights = (state: RootState) => {
  const data = state.trafficAnalytics.data;
  if (!data) return null;

  const peakHour = data.peakHours?.[0];
  const peakDay =
    data.weeklyDistribution && data.weeklyDistribution.length > 0
      ? data.weeklyDistribution.reduce(
          (peak: WeeklyDistribution, day: WeeklyDistribution) =>
            day.count > peak.count ? day : peak
        )
      : null;

  return {
    peakHour: peakHour
      ? {
          hour: peakHour.hour,
          count: peakHour.count,
          timeLabel: peakHour.timeLabel,
          percentage: peakHour.percentage,
        }
      : null,
    peakDay: peakDay
      ? {
          day: peakDay.day,
          count: peakDay.count,
        }
      : null,
    topViolationType: data.violationsByType?.[0] || null,
    topLocation: data.locationHotspots?.[0] || null,
  };
};

export const selectTrafficEfficiencyMetrics = (state: RootState) => {
  const data = state.trafficAnalytics.data;
  if (!data) return null;

  const avgResolutionDays = data.avgResolutionTimeHours / 24;
  const efficiencyScore = Math.max(0, 100 - avgResolutionDays * 10); // Simple efficiency calculation

  return {
    avgResolutionTimeHours: data.avgResolutionTimeHours,
    avgResolutionTimeDays: avgResolutionDays,
    resolutionRate: data.overallResolutionRate,
    efficiencyScore,
    performanceLevel:
      efficiencyScore >= 80
        ? "Excellent"
        : efficiencyScore >= 60
        ? "Good"
        : efficiencyScore >= 40
        ? "Average"
        : "Poor",
  };
};

export const selectActiveFilters = (state: RootState) => {
  const { selectedLocation, selectedViolationType } = state.trafficAnalytics;
  const hasFilters = selectedLocation || selectedViolationType;

  return {
    hasFilters,
    location: selectedLocation,
    violationType: selectedViolationType,
    filterCount: [selectedLocation, selectedViolationType].filter(Boolean)
      .length,
  };
};

export default trafficAnalyticsSlice.reducer;
