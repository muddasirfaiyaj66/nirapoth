import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  citizenReportApi,
  CitizenReport,
  CitizenReportSearchParams,
  CitizenReportStats,
  CreateCitizenReportData,
  ReviewReportData,
} from "@/lib/api/citizenReports";

interface CitizenReportsState {
  reports: CitizenReport[];
  stats: CitizenReportStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: CitizenReportSearchParams;
}

const initialState: CitizenReportsState = {
  reports: [],
  stats: null,
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

// Async thunks
export const fetchMyReports = createAsyncThunk(
  "citizenReports/fetchMyReports",
  async (params: CitizenReportSearchParams = {}, { rejectWithValue }) => {
    try {
      const response = await citizenReportApi.getMyReports(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reports"
      );
    }
  }
);

export const fetchReportById = createAsyncThunk(
  "citizenReports/fetchReportById",
  async (reportId: string, { rejectWithValue }) => {
    try {
      const response = await citizenReportApi.getReportById(reportId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch report"
      );
    }
  }
);

export const createReport = createAsyncThunk(
  "citizenReports/createReport",
  async (data: CreateCitizenReportData, { rejectWithValue }) => {
    try {
      const response = await citizenReportApi.createReport(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create report"
      );
    }
  }
);

export const deleteReport = createAsyncThunk(
  "citizenReports/deleteReport",
  async (reportId: string, { rejectWithValue }) => {
    try {
      await citizenReportApi.deleteReport(reportId);
      return reportId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete report"
      );
    }
  }
);

export const fetchMyStats = createAsyncThunk(
  "citizenReports/fetchMyStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await citizenReportApi.getMyStats();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch statistics"
      );
    }
  }
);

// Police thunks
export const fetchPendingReports = createAsyncThunk(
  "citizenReports/fetchPendingReports",
  async (params: CitizenReportSearchParams = {}, { rejectWithValue }) => {
    try {
      const response = await citizenReportApi.getPendingReports(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending reports"
      );
    }
  }
);

export const reviewReport = createAsyncThunk(
  "citizenReports/reviewReport",
  async (
    { reportId, data }: { reportId: string; data: ReviewReportData },
    { rejectWithValue }
  ) => {
    try {
      const response = await citizenReportApi.reviewReport(reportId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to review report"
      );
    }
  }
);

const citizenReportsSlice = createSlice({
  name: "citizenReports",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<CitizenReportSearchParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<CitizenReportsState["pagination"]>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my reports
      .addCase(fetchMyReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.reports || [];
        // Safely handle pagination
        state.pagination = action.payload.pagination || {
          page: 1,
          limit: 20,
          total: action.payload.reports?.length || 0,
          totalPages: 1,
        };
      })
      .addCase(fetchMyReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch report by ID
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false;
        // Update report in list if exists, otherwise add it
        const index = state.reports.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.reports[index] = action.payload;
        } else {
          state.reports.unshift(action.payload);
        }
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create report
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload);
        // Safely update pagination
        if (state.pagination) {
          state.pagination.total = (state.pagination.total || 0) + 1;
          state.pagination.totalPages = Math.ceil(
            state.pagination.total / (state.pagination.limit || 20)
          );
        }
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete report
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter((r) => r.id !== action.payload);
        state.pagination.total -= 1;
      })
      // Fetch stats
      .addCase(fetchMyStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Fetch pending reports (Police)
      .addCase(fetchPendingReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.reports;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPendingReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Review report (Police)
      .addCase(reviewReport.fulfilled, (state, action) => {
        // Remove the reviewed report from the list since it's no longer pending
        state.reports = state.reports.filter((r) => r.id !== action.payload.id);

        // Update pagination safely
        if (state.pagination) {
          state.pagination.total = Math.max(0, state.pagination.total - 1);
          state.pagination.totalPages = Math.ceil(
            state.pagination.total / state.pagination.limit
          );
        }
      });
  },
});

export const { clearError, setFilters, clearFilters, setPagination } =
  citizenReportsSlice.actions;

export default citizenReportsSlice.reducer;
