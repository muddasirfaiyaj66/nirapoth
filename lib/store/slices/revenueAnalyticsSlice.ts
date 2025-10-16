import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AdminApiService } from "../../api/admin.api";
import type { RootState } from "../index";

// Types
export interface RevenueMetrics {
  totalRevenue: number;
  totalFines: number;
  avgFineAmount: number;
  collectionRate: number;
  pendingRevenue: number;
  revenueGrowth: number;
  currentMonthRevenue: number;
  lastMonthRevenue: number;
}

export interface TimeSeriesDataPoint {
  date?: string;
  year?: number;
  month?: number;
  monthLabel?: string;
  revenue: number;
  fines: number;
  avgFine?: number;
}

export interface PaymentMethodData {
  method: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface ViolationRevenueData {
  type: string;
  count: number;
  revenue: number;
  avgFine: number;
}

export interface FineStatusData {
  status: string;
  count: number;
  revenue: number;
}

export interface TopViolationType {
  type: string;
  count: number;
  revenue: number;
}

export interface RevenueAnalyticsData {
  // Overview metrics
  totalRevenue: number;
  totalFines: number;
  avgFineAmount: number;
  collectionRate: number;
  pendingRevenue: number;
  revenueGrowth: number;
  currentMonthRevenue: number;
  lastMonthRevenue: number;

  // Time series data
  timeSeriesData: TimeSeriesDataPoint[];
  dailyRevenue: TimeSeriesDataPoint[];
  monthlyRevenue: TimeSeriesDataPoint[];

  // Distribution data
  finesByStatus: FineStatusData[];
  paymentMethodDistribution: PaymentMethodData[];
  violationRevenueData: ViolationRevenueData[];
  topViolationTypes: TopViolationType[];

  // Metadata
  dateRange: {
    startDate: string;
    endDate: string;
    range: string;
    granularity: string;
  };
  generatedAt: string;
}

interface RevenueAnalyticsState {
  data: RevenueAnalyticsData | null;
  loading: boolean;
  error: string | null;
  selectedTimeRange: string;
  selectedGranularity: string;
  lastRefresh: string | null;
}

const initialState: RevenueAnalyticsState = {
  data: null,
  loading: false,
  error: null,
  selectedTimeRange: "6months",
  selectedGranularity: "monthly",
  lastRefresh: null,
};

// Async thunks
export const fetchRevenueAnalytics = createAsyncThunk(
  "revenueAnalytics/fetchRevenueAnalytics",
  async (params: { range?: string; granularity?: string } = {}) => {
    const { range = "6months", granularity = "monthly" } = params;
    const response = await AdminApiService.getRevenueAnalytics({
      range,
      granularity,
    });
    return response.data;
  }
);

export const refreshRevenueAnalytics = createAsyncThunk(
  "revenueAnalytics/refreshRevenueAnalytics",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { selectedTimeRange, selectedGranularity } = state.revenueAnalytics;
    const response = await AdminApiService.getRevenueAnalytics({
      range: selectedTimeRange,
      granularity: selectedGranularity,
    });
    return response.data;
  }
);

// Slice
const revenueAnalyticsSlice = createSlice({
  name: "revenueAnalytics",
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<string>) => {
      state.selectedTimeRange = action.payload;
    },
    setGranularity: (state, action: PayloadAction<string>) => {
      state.selectedGranularity = action.payload;
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
      // Fetch revenue analytics
      .addCase(fetchRevenueAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastRefresh = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchRevenueAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch revenue analytics";
      })

      // Refresh revenue analytics
      .addCase(refreshRevenueAnalytics.pending, (state) => {
        // Don't show loading on refresh to avoid UI flickering
        state.error = null;
      })
      .addCase(refreshRevenueAnalytics.fulfilled, (state, action) => {
        state.data = action.payload;
        state.lastRefresh = new Date().toISOString();
        state.error = null;
      })
      .addCase(refreshRevenueAnalytics.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to refresh revenue analytics";
      });
  },
});

export const { setTimeRange, setGranularity, clearError, resetState } =
  revenueAnalyticsSlice.actions;

// Selectors
export const selectRevenueAnalytics = (state: RootState) =>
  state.revenueAnalytics.data;
export const selectRevenueAnalyticsLoading = (state: RootState) =>
  state.revenueAnalytics.loading;
export const selectRevenueAnalyticsError = (state: RootState) =>
  state.revenueAnalytics.error;
export const selectRevenueTimeRange = (state: RootState) =>
  state.revenueAnalytics.selectedTimeRange;
export const selectRevenueGranularity = (state: RootState) =>
  state.revenueAnalytics.selectedGranularity;
export const selectRevenueLastRefresh = (state: RootState) =>
  state.revenueAnalytics.lastRefresh;

// Computed selectors
export const selectRevenueOverview = (state: RootState) => {
  const data = state.revenueAnalytics.data;
  if (!data) return null;

  return {
    totalRevenue: data.totalRevenue,
    totalFines: data.totalFines,
    avgFineAmount: data.avgFineAmount,
    collectionRate: data.collectionRate,
    pendingRevenue: data.pendingRevenue,
    revenueGrowth: data.revenueGrowth,
    currentMonthRevenue: data.currentMonthRevenue,
    lastMonthRevenue: data.lastMonthRevenue,
  };
};

export const selectRevenueTimeSeriesData = (state: RootState) => {
  const data = state.revenueAnalytics.data;
  if (!data) return null;

  return {
    timeSeriesData: data.timeSeriesData,
    dailyRevenue: data.dailyRevenue,
    monthlyRevenue: data.monthlyRevenue,
  };
};

export const selectRevenueDistributionData = (state: RootState) => {
  const data = state.revenueAnalytics.data;
  if (!data) return null;

  return {
    finesByStatus: data.finesByStatus,
    paymentMethodDistribution: data.paymentMethodDistribution,
    violationRevenueData: data.violationRevenueData,
    topViolationTypes: data.topViolationTypes,
  };
};

export const selectRevenueGrowthMetrics = (state: RootState) => {
  const data = state.revenueAnalytics.data;
  if (!data) return null;

  return {
    revenueGrowth: data.revenueGrowth,
    currentMonth: data.currentMonthRevenue,
    lastMonth: data.lastMonthRevenue,
    growthDirection: data.revenueGrowth >= 0 ? "up" : "down",
    growthColor: data.revenueGrowth >= 0 ? "text-green-600" : "text-red-600",
  };
};

export const selectRevenueCollectionMetrics = (state: RootState) => {
  const data = state.revenueAnalytics.data;
  if (!data) return null;

  const collectedRevenue = data.totalRevenue;
  const pendingRevenue = data.pendingRevenue;
  const totalRevenuePotential = collectedRevenue + pendingRevenue;

  return {
    collectedRevenue,
    pendingRevenue,
    totalRevenuePotential,
    collectionRate: data.collectionRate,
    collectionEfficiency:
      totalRevenuePotential > 0
        ? (collectedRevenue / totalRevenuePotential) * 100
        : 0,
  };
};

export default revenueAnalyticsSlice.reducer;
