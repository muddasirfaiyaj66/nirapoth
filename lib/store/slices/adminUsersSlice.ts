import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AdminApiService } from "@/lib/api/admin.api";

// Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role:
    | "ADMIN"
    | "SUPER_ADMIN"
    | "POLICE"
    | "DRIVER"
    | "FIRE_SERVICE"
    | "CITIZEN";
  emailVerified: boolean;
  phoneVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
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
        state.users = action.payload.data.users;
        state.totalUsers = action.payload.data.total;
        state.currentPage = action.payload.data.page;
        state.totalPages = Math.ceil(
          action.payload.data.total / (action.payload.data.limit || 10)
        );
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
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
