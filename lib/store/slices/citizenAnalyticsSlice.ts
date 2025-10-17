import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api/apiClient";

// Types
export interface ViolationOverview {
  month: string;
  count: number;
}

export interface FineAnalytic {
  month: string;
  total: number;
  paid: number;
  unpaid: number;
}

export interface RewardOverTime {
  month: string;
  rewards: number;
  penalties: number;
  net: number;
}

export interface ViolationType {
  type: string;
  count: number;
}

export interface RecentActivity {
  id: string;
  type: "fine" | "reward";
  description: string;
  amount: number;
  status: string;
  date: Date;
  vehicle?: string;
}

export interface CitizenAnalytics {
  currentBalance: number;
  totalRewards: number;
  totalPenalties: number;
  totalReports: number;
  approvedReports: number;
  violationsOverview: ViolationOverview[];
  finesAnalytics: FineAnalytic[];
  rewardsOverTime: RewardOverTime[];
  violationsByType: ViolationType[];
  recentActivity: RecentActivity[];
}

interface CitizenAnalyticsState {
  analytics: CitizenAnalytics | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: CitizenAnalyticsState = {
  analytics: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async Thunks
export const fetchCitizenAnalytics = createAsyncThunk(
  "citizenAnalytics/fetch",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 Fetching citizen analytics from /citizen/analytics");
      const response = await api.get<CitizenAnalytics>("/citizen/analytics");
      console.log("✅ Citizen analytics response:", response);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch analytics");
    } catch (error: any) {
      console.error("❌ Failed to fetch citizen analytics:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analytics"
      );
    }
  }
);

// Slice
const citizenAnalyticsSlice = createSlice({
  name: "citizenAnalytics",
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.analytics = null;
      state.error = null;
      state.lastUpdated = null;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.analytics) {
        state.analytics.currentBalance = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Analytics
      .addCase(fetchCitizenAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCitizenAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
        state.lastUpdated = Date.now();

        // 📊 LOG ALL FETCHED DATA
        console.log("====== CITIZEN ANALYTICS DATA FROM BACKEND ======");
        console.log("📈 Current Balance:", action.payload.currentBalance);
        console.log("💰 Total Rewards:", action.payload.totalRewards);
        console.log("⚠️ Total Penalties:", action.payload.totalPenalties);
        console.log("📝 Total Reports:", action.payload.totalReports);
        console.log("✅ Approved Reports:", action.payload.approvedReports);
        console.log(
          "\n🔴 Violations Overview (6 months):",
          action.payload.violationsOverview
        );
        console.log("\n💵 Fines Analytics:", action.payload.finesAnalytics);
        console.log("\n📊 Rewards Over Time:", action.payload.rewardsOverTime);
        console.log(
          "\n🏷️ Violations By Type:",
          action.payload.violationsByType
        );
        console.log(
          "\n⏰ Recent Activity (last 10):",
          action.payload.recentActivity
        );
        console.log("==================================================");
      })
      .addCase(fetchCitizenAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAnalytics, updateBalance } = citizenAnalyticsSlice.actions;
export default citizenAnalyticsSlice.reducer;
