import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  analyticsApi,
  DashboardStats,
  CaseResolutionData,
  SystemEfficiency,
  PoliceStationPerformance,
  RevenueData,
  ViolationData,
  RoadCongestion,
  UserRoleDistribution,
  ViolationTypeDistribution,
  UserSubmissionTrend,
  EmergencyResponse,
  AnalyticsData,
} from "@/lib/api/analytics";

interface AnalyticsState {
  dashboardStats: DashboardStats | null;
  caseResolution: CaseResolutionData[];
  systemEfficiency: SystemEfficiency | null;
  policeStations: PoliceStationPerformance[];
  revenue: RevenueData[];
  violations: ViolationData[];
  roadCongestion: RoadCongestion[];
  userRoles: UserRoleDistribution[];
  violationTypes: ViolationTypeDistribution[];
  userSubmissions: UserSubmissionTrend[];
  emergencyResponses: EmergencyResponse[];
  loading: {
    dashboardStats: boolean;
    caseResolution: boolean;
    systemEfficiency: boolean;
    policeStations: boolean;
    revenue: boolean;
    violations: boolean;
    roadCongestion: boolean;
    userRoles: boolean;
    violationTypes: boolean;
    userSubmissions: boolean;
    emergencyResponses: boolean;
    all: boolean;
  };
  error: string | null;
}

const initialState: AnalyticsState = {
  dashboardStats: null,
  caseResolution: [],
  systemEfficiency: null,
  policeStations: [],
  revenue: [],
  violations: [],
  roadCongestion: [],
  userRoles: [],
  violationTypes: [],
  userSubmissions: [],
  emergencyResponses: [],
  loading: {
    dashboardStats: false,
    caseResolution: false,
    systemEfficiency: false,
    policeStations: false,
    revenue: false,
    violations: false,
    roadCongestion: false,
    userRoles: false,
    violationTypes: false,
    userSubmissions: false,
    emergencyResponses: false,
    all: false,
  },
  error: null,
};

// Async Thunks
export const fetchDashboardStats = createAsyncThunk(
  "analytics/fetchDashboardStats",
  async () => {
    const response = await analyticsApi.getDashboardStats();
    return response;
  }
);

export const fetchCaseResolution = createAsyncThunk(
  "analytics/fetchCaseResolution",
  async () => {
    const response = await analyticsApi.getCaseResolution();
    return response;
  }
);

export const fetchSystemEfficiency = createAsyncThunk(
  "analytics/fetchSystemEfficiency",
  async () => {
    const response = await analyticsApi.getSystemEfficiency();
    return response;
  }
);

export const fetchPoliceStationPerformance = createAsyncThunk(
  "analytics/fetchPoliceStations",
  async () => {
    const response = await analyticsApi.getPoliceStationPerformance();
    return response;
  }
);

export const fetchRevenue = createAsyncThunk(
  "analytics/fetchRevenue",
  async (months: number = 6) => {
    const response = await analyticsApi.getRevenue(months);
    return response;
  }
);

export const fetchViolations = createAsyncThunk(
  "analytics/fetchViolations",
  async (hours: number = 24) => {
    const response = await analyticsApi.getViolations(hours);
    return response;
  }
);

export const fetchRoadCongestion = createAsyncThunk(
  "analytics/fetchRoadCongestion",
  async () => {
    const response = await analyticsApi.getRoadCongestion();
    return response;
  }
);

export const fetchUserRoles = createAsyncThunk(
  "analytics/fetchUserRoles",
  async () => {
    const response = await analyticsApi.getUserRoles();
    return response;
  }
);

export const fetchViolationTypes = createAsyncThunk(
  "analytics/fetchViolationTypes",
  async () => {
    const response = await analyticsApi.getViolationTypes();
    return response;
  }
);

export const fetchUserSubmissions = createAsyncThunk(
  "analytics/fetchUserSubmissions",
  async (days: number = 7) => {
    const response = await analyticsApi.getUserSubmissions(days);
    return response;
  }
);

export const fetchEmergencyResponses = createAsyncThunk(
  "analytics/fetchEmergencyResponses",
  async () => {
    const response = await analyticsApi.getEmergencyResponses();
    return response;
  }
);

export const fetchAllAnalytics = createAsyncThunk(
  "analytics/fetchAll",
  async () => {
    const response = await analyticsApi.getAll();
    return response;
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Dashboard Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.dashboardStats = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading.dashboardStats = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading.dashboardStats = false;
        state.error = action.error.message || "Failed to fetch dashboard stats";
      });

    // Case Resolution
    builder
      .addCase(fetchCaseResolution.pending, (state) => {
        state.loading.caseResolution = true;
        state.error = null;
      })
      .addCase(fetchCaseResolution.fulfilled, (state, action) => {
        state.loading.caseResolution = false;
        state.caseResolution = action.payload;
      })
      .addCase(fetchCaseResolution.rejected, (state, action) => {
        state.loading.caseResolution = false;
        state.error =
          action.error.message || "Failed to fetch case resolution data";
      });

    // System Efficiency
    builder
      .addCase(fetchSystemEfficiency.pending, (state) => {
        state.loading.systemEfficiency = true;
        state.error = null;
      })
      .addCase(fetchSystemEfficiency.fulfilled, (state, action) => {
        state.loading.systemEfficiency = false;
        state.systemEfficiency = action.payload;
      })
      .addCase(fetchSystemEfficiency.rejected, (state, action) => {
        state.loading.systemEfficiency = false;
        state.error =
          action.error.message || "Failed to fetch system efficiency";
      });

    // Police Stations
    builder
      .addCase(fetchPoliceStationPerformance.pending, (state) => {
        state.loading.policeStations = true;
        state.error = null;
      })
      .addCase(fetchPoliceStationPerformance.fulfilled, (state, action) => {
        state.loading.policeStations = false;
        state.policeStations = action.payload;
      })
      .addCase(fetchPoliceStationPerformance.rejected, (state, action) => {
        state.loading.policeStations = false;
        state.error =
          action.error.message || "Failed to fetch police station data";
      });

    // Revenue
    builder
      .addCase(fetchRevenue.pending, (state) => {
        state.loading.revenue = true;
        state.error = null;
      })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.loading.revenue = false;
        state.revenue = action.payload;
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.loading.revenue = false;
        state.error = action.error.message || "Failed to fetch revenue data";
      });

    // Violations
    builder
      .addCase(fetchViolations.pending, (state) => {
        state.loading.violations = true;
        state.error = null;
      })
      .addCase(fetchViolations.fulfilled, (state, action) => {
        state.loading.violations = false;
        state.violations = action.payload;
      })
      .addCase(fetchViolations.rejected, (state, action) => {
        state.loading.violations = false;
        state.error = action.error.message || "Failed to fetch violations data";
      });

    // Road Congestion
    builder
      .addCase(fetchRoadCongestion.pending, (state) => {
        state.loading.roadCongestion = true;
        state.error = null;
      })
      .addCase(fetchRoadCongestion.fulfilled, (state, action) => {
        state.loading.roadCongestion = false;
        state.roadCongestion = action.payload;
      })
      .addCase(fetchRoadCongestion.rejected, (state, action) => {
        state.loading.roadCongestion = false;
        state.error =
          action.error.message || "Failed to fetch road congestion data";
      });

    // User Roles
    builder
      .addCase(fetchUserRoles.pending, (state) => {
        state.loading.userRoles = true;
        state.error = null;
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.loading.userRoles = false;
        state.userRoles = action.payload;
      })
      .addCase(fetchUserRoles.rejected, (state, action) => {
        state.loading.userRoles = false;
        state.error = action.error.message || "Failed to fetch user roles data";
      });

    // Violation Types
    builder
      .addCase(fetchViolationTypes.pending, (state) => {
        state.loading.violationTypes = true;
        state.error = null;
      })
      .addCase(fetchViolationTypes.fulfilled, (state, action) => {
        state.loading.violationTypes = false;
        state.violationTypes = action.payload;
      })
      .addCase(fetchViolationTypes.rejected, (state, action) => {
        state.loading.violationTypes = false;
        state.error =
          action.error.message || "Failed to fetch violation types data";
      });

    // User Submissions
    builder
      .addCase(fetchUserSubmissions.pending, (state) => {
        state.loading.userSubmissions = true;
        state.error = null;
      })
      .addCase(fetchUserSubmissions.fulfilled, (state, action) => {
        state.loading.userSubmissions = false;
        state.userSubmissions = action.payload;
      })
      .addCase(fetchUserSubmissions.rejected, (state, action) => {
        state.loading.userSubmissions = false;
        state.error =
          action.error.message || "Failed to fetch user submissions data";
      });

    // Emergency Responses
    builder
      .addCase(fetchEmergencyResponses.pending, (state) => {
        state.loading.emergencyResponses = true;
        state.error = null;
      })
      .addCase(fetchEmergencyResponses.fulfilled, (state, action) => {
        state.loading.emergencyResponses = false;
        state.emergencyResponses = action.payload;
      })
      .addCase(fetchEmergencyResponses.rejected, (state, action) => {
        state.loading.emergencyResponses = false;
        state.error =
          action.error.message || "Failed to fetch emergency responses";
      });

    // Fetch All Analytics
    builder
      .addCase(fetchAllAnalytics.pending, (state) => {
        state.loading.all = true;
        state.error = null;
      })
      .addCase(fetchAllAnalytics.fulfilled, (state, action) => {
        state.loading.all = false;
        state.caseResolution = action.payload.caseResolution;
        state.systemEfficiency = action.payload.systemEfficiency;
        state.policeStations = action.payload.policeStations;
        state.revenue = action.payload.revenue;
        state.violations = action.payload.violations;
        state.roadCongestion = action.payload.roadCongestion;
        state.userRoles = action.payload.userRoles;
        state.violationTypes = action.payload.violationTypes;
        state.userSubmissions = action.payload.userSubmissions;
        state.emergencyResponses = action.payload.emergencyResponses;
      })
      .addCase(fetchAllAnalytics.rejected, (state, action) => {
        state.loading.all = false;
        state.error = action.error.message || "Failed to fetch all analytics";
      });
  },
});

export const { clearError } = analyticsSlice.actions;

export default analyticsSlice.reducer;
