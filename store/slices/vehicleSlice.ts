import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  vehicleApi,
  Vehicle,
  CreateVehicleDTO,
  UpdateVehicleDTO,
} from "@/lib/api/vehicle";

interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: VehicleState = {
  vehicles: [],
  selectedVehicle: null,
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunks
export const fetchMyVehicles = createAsyncThunk(
  "vehicle/fetchMyVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await vehicleApi.getMyVehicles();
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vehicles"
      );
    }
  }
);

export const fetchVehicleById = createAsyncThunk(
  "vehicle/fetchVehicleById",
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      const response = await vehicleApi.getVehicleById(vehicleId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vehicle"
      );
    }
  }
);

export const createVehicle = createAsyncThunk(
  "vehicle/createVehicle",
  async (data: CreateVehicleDTO, { dispatch, rejectWithValue }) => {
    try {
      const response = await vehicleApi.createVehicle(data);
      // Refetch after creation
      dispatch(fetchMyVehicles());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create vehicle"
      );
    }
  }
);

export const updateVehicle = createAsyncThunk(
  "vehicle/updateVehicle",
  async (
    { vehicleId, data }: { vehicleId: string; data: UpdateVehicleDTO },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await vehicleApi.updateVehicle(vehicleId, data);
      // Refetch after update
      dispatch(fetchMyVehicles());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update vehicle"
      );
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  "vehicle/deleteVehicle",
  async (vehicleId: string, { dispatch, rejectWithValue }) => {
    try {
      await vehicleApi.deleteVehicle(vehicleId);
      // Refetch after deletion
      dispatch(fetchMyVehicles());
      return vehicleId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete vehicle"
      );
    }
  }
);

export const getVehicleStats = createAsyncThunk(
  "vehicle/getVehicleStats",
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      const response = await vehicleApi.getVehicleStats(vehicleId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vehicle stats"
      );
    }
  }
);

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    clearVehicles: (state) => {
      state.vehicles = [];
      state.selectedVehicle = null;
      state.error = null;
      state.lastFetched = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedVehicle: (state, action) => {
      state.selectedVehicle = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch my vehicles
    builder
      .addCase(fetchMyVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchMyVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch vehicle by ID
    builder
      .addCase(fetchVehicleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVehicle = action.payload;
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create vehicle
    builder
      .addCase(createVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicle.fulfilled, (state) => {
        state.loading = false;
        // Vehicles will be updated by fetchMyVehicles dispatch
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update vehicle
    builder
      .addCase(updateVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVehicle.fulfilled, (state) => {
        state.loading = false;
        // Vehicles will be updated by fetchMyVehicles dispatch
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete vehicle
    builder
      .addCase(deleteVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVehicle.fulfilled, (state) => {
        state.loading = false;
        // Vehicles will be updated by fetchMyVehicles dispatch
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearVehicles, clearError, setSelectedVehicle } =
  vehicleSlice.actions;
export default vehicleSlice.reducer;
