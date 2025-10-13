import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authFetch } from "../../utils/api";

export interface PoliceStation {
  id: string;
  name: string;
  code: string;
  district: string;
  address: string;
  contactNumber?: string;
  inChargeId?: string;
  isActive: boolean;
  createdAt: string;

  inCharge?: {
    id: string;
    firstName: string;
    lastName: string;
    rank: string;
  };

  officers?: PoliceOfficer[];
  _count?: {
    officers: number;
  };
}

export interface PoliceOfficer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  rank:
    | "CONSTABLE"
    | "HEAD_CONSTABLE"
    | "SUB_INSPECTOR"
    | "ASSISTANT_SUB_INSPECTOR"
    | "INSPECTOR"
    | "ADDITIONAL_SP"
    | "SP"
    | "ADDITIONAL_DIG"
    | "DIG"
    | "ADDITIONAL_IG"
    | "IG"
    | "DIG_RANGE"
    | "ADDITIONAL_IGP"
    | "IGP";
  badgeNumber?: string;
  stationId?: string;
  isActive: boolean;

  station?: {
    id: string;
    name: string;
    district: string;
  };
}

export interface PoliceState {
  stations: PoliceStation[];
  officers: PoliceOfficer[];
  unassignedOfficers: PoliceOfficer[];
  isLoading: boolean;
  error: string | null;
  selectedStation: PoliceStation | null;
  selectedOfficer: PoliceOfficer | null;
}

const initialState: PoliceState = {
  stations: [],
  officers: [],
  unassignedOfficers: [],
  isLoading: false,
  error: null,
  selectedStation: null,
  selectedOfficer: null,
};

// Async thunks
export const fetchStations = createAsyncThunk(
  "police/fetchStations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch("police/stations");

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to fetch stations");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const fetchOfficers = createAsyncThunk(
  "police/fetchOfficers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch("police/officers");

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to fetch officers");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const fetchUnassignedOfficers = createAsyncThunk(
  "police/fetchUnassignedOfficers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch("police/officers/unassigned");

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(
          error.message || "Failed to fetch unassigned officers"
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const createStation = createAsyncThunk(
  "police/createStation",
  async (
    stationData: {
      name: string;
      code: string;
      district: string;
      address: string;
      contactNumber?: string;
      inChargeId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authFetch("police/stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stationData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to create station");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const createOfficer = createAsyncThunk(
  "police/createOfficer",
  async (
    officerData: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      rank: string;
      badgeNumber?: string;
      stationId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authFetch("police/officers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(officerData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to create officer");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const assignOfficer = createAsyncThunk(
  "police/assignOfficer",
  async (
    assignmentData: {
      stationId: string;
      officerId: string;
      rank?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authFetch("police/assign-officer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to assign officer");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const updateStation = createAsyncThunk(
  "police/updateStation",
  async (
    {
      id,
      ...updateData
    }: {
      id: string;
      name?: string;
      code?: string;
      district?: string;
      address?: string;
      contactNumber?: string;
      inChargeId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/police/stations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to update station");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const updateOfficer = createAsyncThunk(
  "police/updateOfficer",
  async (
    {
      id,
      ...updateData
    }: {
      id: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      rank?: string;
      badgeNumber?: string;
      stationId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/police/officers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to update officer");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

const policeSlice = createSlice({
  name: "police",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedStation: (
      state,
      action: PayloadAction<PoliceStation | null>
    ) => {
      state.selectedStation = action.payload;
    },
    setSelectedOfficer: (
      state,
      action: PayloadAction<PoliceOfficer | null>
    ) => {
      state.selectedOfficer = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch stations
    builder
      .addCase(fetchStations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stations = action.payload;
        state.error = null;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch officers
    builder
      .addCase(fetchOfficers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOfficers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.officers = action.payload;
        state.error = null;
      })
      .addCase(fetchOfficers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch unassigned officers
    builder
      .addCase(fetchUnassignedOfficers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnassignedOfficers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unassignedOfficers = action.payload;
        state.error = null;
      })
      .addCase(fetchUnassignedOfficers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create station
    builder
      .addCase(createStation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stations.push(action.payload);
        state.error = null;
      })
      .addCase(createStation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create officer
    builder
      .addCase(createOfficer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOfficer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.officers.push(action.payload);
        // Remove from unassigned if it was there
        state.unassignedOfficers = state.unassignedOfficers.filter(
          (o) => o.id !== action.payload.id
        );
        state.error = null;
      })
      .addCase(createOfficer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Assign officer
    builder
      .addCase(assignOfficer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignOfficer.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.officers.findIndex(
          (o) => o.id === action.payload.id
        );
        if (index !== -1) {
          state.officers[index] = action.payload;
        }
        // Remove from unassigned
        state.unassignedOfficers = state.unassignedOfficers.filter(
          (o) => o.id !== action.payload.id
        );
        state.error = null;
      })
      .addCase(assignOfficer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update station
    builder
      .addCase(updateStation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStation.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.stations.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.stations[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateStation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update officer
    builder
      .addCase(updateOfficer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOfficer.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.officers.findIndex(
          (o) => o.id === action.payload.id
        );
        if (index !== -1) {
          state.officers[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOfficer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedStation, setSelectedOfficer } =
  policeSlice.actions;
export default policeSlice.reducer;
