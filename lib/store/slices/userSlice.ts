import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  adminApi,
  UserVerification,
  BlockedUser,
  RoleManagement,
} from "@/lib/api/admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isEmailVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  users: User[];
  verifications: UserVerification[];
  blockedUsers: BlockedUser[];
  roleManagement: RoleManagement[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: UserState = {
  users: [],
  verifications: [],
  blockedUsers: [],
  roleManagement: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (
    params: { page?: number; limit?: number; role?: string; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.getAllUsers(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchVerifications = createAsyncThunk(
  "user/fetchVerifications",
  async (
    params: { page?: number; limit?: number; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.getPendingVerifications(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch verifications"
      );
    }
  }
);

export const fetchBlockedUsers = createAsyncThunk(
  "user/fetchBlockedUsers",
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await adminApi.getBlockedUsers(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blocked users"
      );
    }
  }
);

export const fetchRoleManagement = createAsyncThunk(
  "user/fetchRoleManagement",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getRoleManagement();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch role management data"
      );
    }
  }
);

export const verifyUser = createAsyncThunk(
  "user/verifyUser",
  async (
    { userId, verified }: { userId: string; verified: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.verifyUser(userId, verified);
      return { userId, verified, user: response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify user"
      );
    }
  }
);

export const unblockUser = createAsyncThunk(
  "user/unblockUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await adminApi.unblockUser(userId);
      return { userId, user: response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unblock user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<UserState["pagination"]>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        // DEBUG: Log response
        console.log("🔍 [DEBUG] fetchUsers response:", action.payload);

        // Handle multiple response formats
        const data = action.payload?.data || action.payload;
        state.users = Array.isArray(data) ? data : data?.users || [];
        state.pagination = data?.pagination || action.payload?.pagination;

        console.log(
          "✅ [DEBUG] fetchUsers - users count:",
          state.users?.length
        );
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ [DEBUG] fetchUsers failed:", action.error);
      })
      // Fetch verifications
      .addCase(fetchVerifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVerifications.fulfilled, (state, action) => {
        state.loading = false;

        // DEBUG: Log response
        console.log("🔍 [DEBUG] fetchVerifications response:", action.payload);

        // Handle multiple response formats
        const data = action.payload?.data || action.payload;
        state.verifications = Array.isArray(data) ? data : data?.users || [];
        state.pagination = data?.pagination || action.payload?.pagination;

        console.log(
          "✅ [DEBUG] fetchVerifications - count:",
          state.verifications?.length
        );
      })
      .addCase(fetchVerifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ [DEBUG] fetchVerifications failed:", action.error);
      })
      // Fetch blocked users
      .addCase(fetchBlockedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlockedUsers.fulfilled, (state, action) => {
        state.loading = false;

        // DEBUG: Log response
        console.log("🔍 [DEBUG] fetchBlockedUsers response:", action.payload);

        // Handle multiple response formats
        const data = action.payload?.data || action.payload;
        state.blockedUsers = Array.isArray(data) ? data : data?.users || [];
        state.pagination = data?.pagination || action.payload?.pagination;

        console.log(
          "✅ [DEBUG] fetchBlockedUsers - count:",
          state.blockedUsers?.length
        );
      })
      .addCase(fetchBlockedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ [DEBUG] fetchBlockedUsers failed:", action.error);
      })
      // Fetch role management
      .addCase(fetchRoleManagement.fulfilled, (state, action) => {
        state.roleManagement = action.payload;
      })
      // Verify user
      .addCase(verifyUser.fulfilled, (state, action) => {
        const { userId, verified } = action.payload;
        const userIndex = state.verifications.findIndex(
          (user) => user.id === userId
        );
        if (userIndex !== -1) {
          state.verifications[userIndex].isEmailVerified = verified;
        }
      })
      // Unblock user
      .addCase(unblockUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        state.blockedUsers = state.blockedUsers.filter(
          (user) => user.id !== userId
        );
      });
  },
});

export const { clearError, setPagination } = userSlice.actions;
export default userSlice.reducer;
