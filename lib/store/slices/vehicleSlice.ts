import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { citizenApi, Vehicle } from "@/lib/api/citizen";

export interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    search?: string;
    type?: string;
    status?: string;
  };
}

const initialState: VehicleState = {
  vehicles: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {},
};

// Async thunks
export const fetchVehicles = createAsyncThunk(
  "vehicle/fetchVehicles",
  async (
    params: { page?: number; limit?: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await citizenApi.getMyVehicles(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vehicles"
      );
    }
  }
);

export const registerVehicle = createAsyncThunk(
  "vehicle/registerVehicle",
  async (
    vehicleData: {
      licensePlate: string;
      make: string;
      model: string;
      year: number;
      type: string;
      color: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await citizenApi.registerVehicle(vehicleData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to register vehicle"
      );
    }
  }
);

export const updateVehicle = createAsyncThunk(
  "vehicle/updateVehicle",
  async (
    {
      vehicleId,
      vehicleData,
    }: { vehicleId: string; vehicleData: Partial<Vehicle> },
    { rejectWithValue }
  ) => {
    try {
      const response = await citizenApi.updateVehicle(vehicleId, vehicleData);
      return { vehicleId, vehicle: response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update vehicle"
      );
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  "vehicle/deleteVehicle",
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      await citizenApi.deleteVehicle(vehicleId);
      return vehicleId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete vehicle"
      );
    }
  }
);

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<VehicleState["pagination"]>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<VehicleState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload.vehicles;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register vehicle
      .addCase(registerVehicle.fulfilled, (state, action) => {
        state.vehicles.unshift(action.payload);
        state.pagination.total += 1;
      })
      // Update vehicle
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const { vehicleId, vehicle } = action.payload;
        const index = state.vehicles.findIndex((v) => v.id === vehicleId);
        if (index !== -1) {
          state.vehicles[index] = vehicle;
        }
      })
      // Delete vehicle
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        const vehicleId = action.payload;
        state.vehicles = state.vehicles.filter((v) => v.id !== vehicleId);
        state.pagination.total -= 1;
      });
  },
});

export const { clearError, setPagination, setFilters } = vehicleSlice.actions;
export default vehicleSlice.reducer;
