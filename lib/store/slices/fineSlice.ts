import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fineApi,
  Fine,
  FineStats,
  FineSearchParams,
  CreateFineData,
  UpdateFineData,
} from "@/lib/api/fines";

export interface FineState {
  fines: Fine[];
  stats: FineStats | null;
  overdueFines: Fine[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search?: string;
    status?: string;
    vehiclePlate?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

const initialState: FineState = {
  fines: [],
  stats: null,
  overdueFines: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
};

// Async thunks
export const fetchFines = createAsyncThunk(
  "fine/fetchFines",
  async (params: FineSearchParams = {}, { rejectWithValue }) => {
    try {
      const response = await fineApi.getAllFines(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch fines"
      );
    }
  }
);

export const fetchFineStats = createAsyncThunk(
  "fine/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fineApi.getFineStats();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch fine statistics"
      );
    }
  }
);

export const fetchOverdueFines = createAsyncThunk(
  "fine/fetchOverdueFines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fineApi.getOverdueFines();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch overdue fines"
      );
    }
  }
);

export const fetchMyFines = createAsyncThunk(
  "fine/fetchMyFines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fineApi.getMyFines();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your fines"
      );
    }
  }
);

export const createFine = createAsyncThunk(
  "fine/createFine",
  async (data: CreateFineData, { rejectWithValue }) => {
    try {
      const response = await fineApi.createFine(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create fine"
      );
    }
  }
);

export const updateFine = createAsyncThunk(
  "fine/updateFine",
  async (
    { fineId, data }: { fineId: string; data: UpdateFineData },
    { rejectWithValue }
  ) => {
    try {
      const response = await fineApi.updateFine(fineId, data);
      return { fineId, fine: response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update fine"
      );
    }
  }
);

export const deleteFine = createAsyncThunk(
  "fine/deleteFine",
  async (fineId: string, { rejectWithValue }) => {
    try {
      await fineApi.deleteFine(fineId);
      return fineId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete fine"
      );
    }
  }
);

const fineSlice = createSlice({
  name: "fine",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<FineState["pagination"]>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<FineState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch fines
      .addCase(fetchFines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFines.fulfilled, (state, action) => {
        state.loading = false;
        state.fines = action.payload.fines;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch fine stats
      .addCase(fetchFineStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFineStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchFineStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch overdue fines
      .addCase(fetchOverdueFines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverdueFines.fulfilled, (state, action) => {
        state.loading = false;
        state.overdueFines = action.payload;
      })
      .addCase(fetchOverdueFines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch my fines
      .addCase(fetchMyFines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyFines.fulfilled, (state, action) => {
        state.loading = false;
        state.fines = action.payload;
      })
      .addCase(fetchMyFines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create fine
      .addCase(createFine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFine.fulfilled, (state, action) => {
        state.loading = false;
        state.fines.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createFine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update fine
      .addCase(updateFine.fulfilled, (state, action) => {
        const { fineId, fine } = action.payload;
        const index = state.fines.findIndex((f) => f.id === fineId);
        if (index !== -1) {
          state.fines[index] = fine;
        }
      })
      // Delete fine
      .addCase(deleteFine.fulfilled, (state, action) => {
        const fineId = action.payload;
        state.fines = state.fines.filter((fine) => fine.id !== fineId);
        state.pagination.total -= 1;
      });
  },
});

export const { clearError, setPagination, setFilters, clearFilters } =
  fineSlice.actions;
export default fineSlice.reducer;

