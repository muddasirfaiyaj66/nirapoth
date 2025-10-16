import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  accidentsApi,
  Accident,
  AccidentStats,
  AccidentSearchParams,
  DispatchEmergencyData,
} from "@/lib/api/accidents";

interface AccidentsState {
  accidents: Accident[];
  stats: AccidentStats | null;
  selectedAccident: Accident | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: AccidentSearchParams;
}

const initialState: AccidentsState = {
  accidents: [],
  stats: null,
  selectedAccident: null,
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
export const fetchAccidents = createAsyncThunk(
  "accidents/fetchAll",
  async (params: AccidentSearchParams = {}) => {
    const response = await accidentsApi.getAll(params);
    return response;
  }
);

export const fetchAccidentById = createAsyncThunk(
  "accidents/fetchById",
  async (id: string) => {
    const response = await accidentsApi.getById(id);
    return response;
  }
);

export const fetchAccidentStats = createAsyncThunk(
  "accidents/fetchStats",
  async () => {
    const response = await accidentsApi.getStats();
    return response;
  }
);

export const dispatchEmergencyService = createAsyncThunk(
  "accidents/dispatchEmergency",
  async (data: DispatchEmergencyData) => {
    const response = await accidentsApi.dispatchEmergency(data);
    return {
      ...response,
      accidentId: data.accidentId,
      serviceType: data.serviceType,
    };
  }
);

export const markAccidentResolved = createAsyncThunk(
  "accidents/markResolved",
  async ({ accidentId, notes }: { accidentId: string; notes?: string }) => {
    const response = await accidentsApi.markResolved(accidentId, notes);
    return response;
  }
);

export const fetchActiveAccidents = createAsyncThunk(
  "accidents/fetchActive",
  async () => {
    const response = await accidentsApi.getActiveAccidents();
    return response;
  }
);

const accidentsSlice = createSlice({
  name: "accidents",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<AccidentSearchParams>) => {
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
    setSelectedAccident: (state, action: PayloadAction<Accident | null>) => {
      state.selectedAccident = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all accidents
    builder
      .addCase(fetchAccidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccidents.fulfilled, (state, action) => {
        state.loading = false;
        state.accidents = action.payload.accidents;
        state.pagination = {
          page: action.payload.page,
          limit: state.pagination.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchAccidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch accidents";
      });

    // Fetch accident by ID
    builder
      .addCase(fetchAccidentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccidentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAccident = action.payload;
      })
      .addCase(fetchAccidentById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch accident details";
      });

    // Fetch stats
    builder
      .addCase(fetchAccidentStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchAccidentStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchAccidentStats.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch statistics";
      });

    // Dispatch emergency service
    builder
      .addCase(dispatchEmergencyService.pending, (state) => {
        state.error = null;
      })
      .addCase(dispatchEmergencyService.fulfilled, (state, action) => {
        // Update the accident in the list
        const index = state.accidents.findIndex(
          (a) => a.id === action.payload.accidentId
        );
        if (index !== -1) {
          state.accidents[index].status = "RESPONDING";
          if (action.payload.serviceType === "AMBULANCE") {
            state.accidents[index].ambulanceDispatched = true;
          } else if (action.payload.serviceType === "FIRE_SERVICE") {
            state.accidents[index].fireServiceDispatched = true;
          }
        }
        // Update selected accident if it's the same
        if (state.selectedAccident?.id === action.payload.accidentId) {
          state.selectedAccident.status = "RESPONDING";
          if (action.payload.serviceType === "AMBULANCE") {
            state.selectedAccident.ambulanceDispatched = true;
          } else if (action.payload.serviceType === "FIRE_SERVICE") {
            state.selectedAccident.fireServiceDispatched = true;
          }
        }
      })
      .addCase(dispatchEmergencyService.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to dispatch emergency service";
      });

    // Mark as resolved
    builder
      .addCase(markAccidentResolved.pending, (state) => {
        state.error = null;
      })
      .addCase(markAccidentResolved.fulfilled, (state, action) => {
        // Update the accident in the list
        const index = state.accidents.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) {
          state.accidents[index] = action.payload;
        }
        // Update selected accident if it's the same
        if (state.selectedAccident?.id === action.payload.id) {
          state.selectedAccident = action.payload;
        }
      })
      .addCase(markAccidentResolved.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to mark accident as resolved";
      });

    // Fetch active accidents
    builder
      .addCase(fetchActiveAccidents.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchActiveAccidents.fulfilled, (state, action) => {
        state.accidents = action.payload;
      })
      .addCase(fetchActiveAccidents.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to fetch active accidents";
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setPagination,
  setSelectedAccident,
  clearError,
} = accidentsSlice.actions;

export default accidentsSlice.reducer;
