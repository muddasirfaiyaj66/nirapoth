import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AdminApiService } from "@/lib/api/admin.api";
import { adminApi } from "@/lib/api/admin";

// Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "ADMIN" | "SUPER_ADMIN" | "POLICE" | "FIRE_SERVICE" | "CITIZEN";
  emailVerified: boolean;
  phoneVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
}

export interface BlockedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isBlocked: boolean;
  blockedAt: string;
  blockedBy?: string;
  blockReason?: string;
  createdAt: string;
}

export interface RoleManagement {
  role: string;
  count: number;
  description: string;
  permissions: string[];
}

export interface UsersState {
  users: User[];
  blockedUsers: BlockedUser[];
  roles: RoleManagement[];
  loading: boolean;
  error: string | null;
  totalUsers: number;
  totalBlockedUsers: number;
  currentPage: number;
  totalPages: number;
  blockedCurrentPage: number;
  blockedTotalPages: number;
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
}

const initialState: UsersState = {
  users: [],
  blockedUsers: [],
  roles: [],
  loading: false,
  error: null,
  totalUsers: 0,
  totalBlockedUsers: 0,
  currentPage: 1,
  totalPages: 1,
  blockedCurrentPage: 1,
  blockedTotalPages: 1,
  searchTerm: "",
  roleFilter: "all",
  statusFilter: "all",
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) => {
    return AdminApiService.getUsers(params);
  }
);

export const blockUser = createAsyncThunk(
  "admin/blockUser",
  async ({ userId, blocked }: { userId: string; blocked: boolean }) => {
    const result = await AdminApiService.blockUser(userId, blocked);
    return { userId, blocked, result };
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId: string) => {
    const result = await AdminApiService.deleteUser(userId);
    return { userId, result };
  }
);

export const createUser = createAsyncThunk(
  "admin/createUser",
  async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    password: string;
    nidNo?: string;
    birthCertificateNo?: string;
  }) => {
    const result = await AdminApiService.createUser(userData);
    return result;
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, newRole }: { userId: string; newRole: string }) => {
    const result = await AdminApiService.updateUserRole(userId, newRole);
    return { userId, newRole, result };
  }
);

// Fetch blocked users
export const fetchBlockedUsers = createAsyncThunk(
  "admin/fetchBlockedUsers",
  async (params?: { page?: number; limit?: number }) => {
    const response = await adminApi.getBlockedUsers(params);
    return response;
  }
);

// Unblock user
export const unblockUser = createAsyncThunk(
  "admin/unblockUser",
  async (userId: string) => {
    const response = await adminApi.unblockUser(userId);
    return { userId, response };
  }
);

// Fetch role management
export const fetchRoleManagement = createAsyncThunk(
  "admin/fetchRoleManagement",
  async () => {
    const response = await adminApi.getRoleManagement();
    return response;
  }
);

// Slice
const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
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

        // DEBUG: Log the actual response structure
        console.log("🔍 [DEBUG] Full API Response:", action.payload);
        console.log("🔍 [DEBUG] payload.data:", action.payload?.data);
        console.log("🔍 [DEBUG] payload.users:", action.payload?.users);
        console.log(
          "🔍 [DEBUG] payload.data type:",
          typeof action.payload?.data
        );

        // Handle multiple response formats
        const data = action.payload?.data || action.payload;
        console.log("🔍 [DEBUG] Extracted data:", data);
        console.log("🔍 [DEBUG] data.users:", data?.users);
        console.log("🔍 [DEBUG] data type:", typeof data);
        console.log("🔍 [DEBUG] Is data array?:", Array.isArray(data));

        // Get users from various possible locations
        let users = [];
        if (Array.isArray(data)) {
          users = data;
          console.log("✅ Found users as direct array");
        } else if (Array.isArray(data?.users)) {
          users = data.users;
          console.log("✅ Found users in data.users");
        } else if (Array.isArray(data?.data)) {
          users = data.data;
          console.log("✅ Found users in data.data");
        } else if (Array.isArray(action.payload?.users)) {
          users = action.payload.users;
          console.log("✅ Found users in payload.users");
        } else {
          console.log("❌ Could not find users array!");
        }

        state.users = users;
        state.totalUsers =
          data?.total || data?.pagination?.total || users.length || 0;
        state.currentPage = data?.page || data?.pagination?.page || 1;
        state.totalPages =
          data?.pages ||
          data?.pagination?.pages ||
          Math.ceil((data?.total || users.length || 0) / (data?.limit || 10));

        console.log("✅ [DEBUG] State updated:");
        console.log("   - users count:", state.users?.length);
        console.log("   - totalUsers:", state.totalUsers);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";

        // DEBUG: Log the error
        console.error("❌ [DEBUG] Fetch users failed:", action.error);
        console.error("❌ [DEBUG] Error message:", action.error.message);
        console.error("❌ [DEBUG] Full payload:", action.payload);
      })
      // Block user
      .addCase(blockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = state.users.find((u) => u.id === action.payload.userId);
        if (user) {
          user.isBlocked = action.payload.blocked;
        }
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user status";
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const userIndex = state.users.findIndex(
          (u) => u.id === action.payload.userId
        );
        if (userIndex !== -1) {
          state.users[userIndex].isDeleted = true;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        // The new user will be fetched when we refresh the list
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create user";
      })
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        const user = state.users.find((u) => u.id === action.payload.userId);
        if (user) {
          user.role = action.payload.newRole as any;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user role";
      })
      // Fetch blocked users
      .addCase(fetchBlockedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlockedUsers.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data || action.payload;
        state.blockedUsers = data?.users || [];
        state.totalBlockedUsers = data?.pagination?.total || 0;
        state.blockedCurrentPage = data?.pagination?.page || 1;
        state.blockedTotalPages = data?.pagination?.pages || 1;
      })
      .addCase(fetchBlockedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blocked users";
      })
      // Unblock user
      .addCase(unblockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.loading = false;
        // Remove user from blocked users list
        state.blockedUsers = state.blockedUsers.filter(
          (u) => u.id !== action.payload.userId
        );
        state.totalBlockedUsers -= 1;
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to unblock user";
      })
      // Fetch role management
      .addCase(fetchRoleManagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleManagement.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchRoleManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch role management";
      });
  },
});

export const {
  setSearchTerm,
  setRoleFilter,
  setStatusFilter,
  setCurrentPage,
  clearError,
} = adminUsersSlice.actions;

export default adminUsersSlice.reducer;
