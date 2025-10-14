import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { adminApi } from "@/lib/api/admin";

// Types
export interface DashboardStats {
  totalUsers: number;
  totalViolations: number;
  totalRevenue: number;
  activeCameras: number;
  pendingComplaints: number;
  resolvedIncidents: number;
  systemUptime: number;
  restrictedCitizens: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface DashboardState {
  stats: DashboardStats | null;
  userGrowthData: TimeSeriesData[];
  violationTrendData: TimeSeriesData[];
  userRoleDistribution: ChartData[];
  violationTypeDistribution: ChartData[];
  monthlyPerformance: TimeSeriesData[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  stats: null,
  userGrowthData: [],
  violationTrendData: [],
  userRoleDistribution: [],
  violationTypeDistribution: [],
  monthlyPerformance: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const [overviewData, userStats] = await Promise.all([
        adminApi.getAdminOverview(),
        adminApi.getUserStats(),
      ]);

      return {
        overview: overviewData,
        userStats,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

export const fetchUserGrowthData = createAsyncThunk(
  "dashboard/fetchUserGrowth",
  async (_, { rejectWithValue }) => {
    try {
      // This would typically fetch from a time-series endpoint
      // For now, we'll generate sample data based on real patterns
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentMonth = new Date().getMonth();

      return months.slice(0, currentMonth + 1).map((month, index) => ({
        date: month,
        value: Math.floor(Math.random() * 100) + index * 20,
        label: `${month} 2024`,
      }));
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch user growth data"
      );
    }
  }
);

export const fetchViolationTrendData = createAsyncThunk(
  "dashboard/fetchViolationTrend",
  async (_, { rejectWithValue }) => {
    try {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentMonth = new Date().getMonth();

      return months.slice(0, currentMonth + 1).map((month, index) => ({
        date: month,
        value: Math.floor(Math.random() * 50) + 20,
        label: `${month} 2024`,
      }));
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch violation trend data"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state, action: PayloadAction<Partial<DashboardStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.overview;
        state.userGrowthData = action.payload.overview.userGrowthData || [];
        state.violationTrendData =
          action.payload.overview.violationTrendData || [];
        state.userRoleDistribution =
          action.payload.overview.userRoleDistribution || [];
        state.violationTypeDistribution =
          action.payload.overview.violationTypeDistribution || [];
        state.monthlyPerformance =
          action.payload.overview.monthlyPerformance || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user growth data
      .addCase(fetchUserGrowthData.fulfilled, (state, action) => {
        state.userGrowthData = action.payload;
      })
      // Fetch violation trend data
      .addCase(fetchViolationTrendData.fulfilled, (state, action) => {
        state.violationTrendData = action.payload;
      });
  },
});

export const { clearError, updateStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
