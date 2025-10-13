import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authFetch } from "../../utils/api";

export interface Vehicle {
  id: string;
  plateNo: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  type: "CAR" | "MOTORCYCLE" | "TRUCK" | "BUS" | "VAN" | "MICROBUS";
  engineNo: string;
  chassisNo: string;
  registrationNo?: string;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  assignments?: VehicleAssignment[];
}

export interface VehicleAssignment {
  id: string;
  vehicleId: string;
  driverId: string;
  assignedBy: string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "REVOKED";
  startDate: string;
  endDate?: string;
  licenseValidated: boolean;
  gemValidated: boolean;
  restrictions?: string;
  notes?: string;

  vehicle?: Vehicle;
  driver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface VehiclesState {
  vehicles: Vehicle[];
  assignments: VehicleAssignment[];
  isLoading: boolean;
  error: string | null;
  selectedVehicle: Vehicle | null;
}

const initialState: VehiclesState = {
  vehicles: [],
  assignments: [],
  isLoading: false,
  error: null,
  selectedVehicle: null,
};

// Async thunks
export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch("vehicles/my-vehicles");

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to fetch vehicles");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const addVehicle = createAsyncThunk(
  "vehicles/addVehicle",
  async (
    vehicleData: {
      plateNo: string;
      brand: string;
      model: string;
      year: number;
      color: string;
      type: string;
      engineNo: string;
      chassisNo: string;
      registrationNo?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authFetch("vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to add vehicle");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const updateVehicle = createAsyncThunk(
  "vehicles/updateVehicle",
  async (
    {
      id,
      ...vehicleData
    }: {
      id: string;
      plateNo?: string;
      brand?: string;
      model?: string;
      year?: number;
      color?: string;
      type?: string;
      engineNo?: string;
      chassisNo?: string;
      registrationNo?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to update vehicle");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  "vehicles/deleteVehicle",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to delete vehicle");
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const fetchVehicleAssignments = createAsyncThunk(
  "vehicles/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch("vehicle-assignment/citizen/me");

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to fetch assignments");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const assignDriver = createAsyncThunk(
  "vehicles/assignDriver",
  async (
    assignmentData: {
      vehicleId: string;
      driverId: string;
      startDate: string;
      endDate?: string;
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authFetch("vehicle-assignment/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to assign driver");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const assignSelfAsDriver = createAsyncThunk(
  "vehicles/assignSelfAsDriver",
  async (
    assignmentData: {
      vehicleId: string;
      startDate: string;
      endDate?: string;
      notes?: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as any;
      const userId = state.auth.user?.id;

      if (!userId) {
        return rejectWithValue("User not authenticated");
      }

      const response = await authFetch("vehicle-assignment/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...assignmentData,
          driverId: userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(
          error.message || "Failed to assign self as driver"
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const unassignDriver = createAsyncThunk(
  "vehicles/unassignDriver",
  async (assignmentId: string, { rejectWithValue }) => {
    try {
      const response = await authFetch("vehicle-assignment/unassign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignmentId }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to unassign driver");
      }

      return assignmentId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedVehicle: (state, action: PayloadAction<Vehicle | null>) => {
      state.selectedVehicle = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch vehicles
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles = action.payload;
        state.error = null;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add vehicle
    builder
      .addCase(addVehicle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles.push(action.payload);
        state.error = null;
      })
      .addCase(addVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update vehicle
    builder
      .addCase(updateVehicle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.vehicles.findIndex(
          (v) => v.id === action.payload.id
        );
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete vehicle
    builder
      .addCase(deleteVehicle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles = state.vehicles.filter((v) => v.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch assignments
    builder
      .addCase(fetchVehicleAssignments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVehicleAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments = action.payload;
        state.error = null;
      })
      .addCase(fetchVehicleAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Assign driver
    builder
      .addCase(assignDriver.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignDriver.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments.push(action.payload);
        state.error = null;
      })
      .addCase(assignDriver.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Assign self as driver
    builder
      .addCase(assignSelfAsDriver.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignSelfAsDriver.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments.push(action.payload);
        state.error = null;
      })
      .addCase(assignSelfAsDriver.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Unassign driver
    builder
      .addCase(unassignDriver.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unassignDriver.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments = state.assignments.filter(
          (a) => a.id !== action.payload
        );
        state.error = null;
      })
      .addCase(unassignDriver.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedVehicle } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
