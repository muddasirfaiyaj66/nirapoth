import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  rewardApi,
  RewardTransaction,
  RewardBalance,
  RewardStats,
  WithdrawalRequest,
  CreateWithdrawalData,
  RewardSearchParams,
} from "@/lib/api/rewards";

interface RewardState {
  balance: RewardBalance | null;
  transactions: RewardTransaction[];
  stats: RewardStats | null;
  withdrawals: WithdrawalRequest[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: RewardSearchParams;
}

const initialState: RewardState = {
  balance: null,
  transactions: [],
  stats: null,
  withdrawals: [],
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
export const fetchMyBalance = createAsyncThunk(
  "reward/fetchMyBalance",
  async (_, { rejectWithValue }) => {
    try {
      return await rewardApi.getMyBalance();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch balance"
      );
    }
  }
);

export const fetchMyTransactions = createAsyncThunk(
  "reward/fetchMyTransactions",
  async (params: RewardSearchParams = {}, { rejectWithValue }) => {
    try {
      const result = await rewardApi.getMyTransactions(params);
      console.log("fetchMyTransactions result:", result);
      return result;
    } catch (error: any) {
      console.error("fetchMyTransactions error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch transactions"
      );
    }
  }
);

export const fetchMyStats = createAsyncThunk(
  "reward/fetchMyStats",
  async (_, { rejectWithValue }) => {
    try {
      return await rewardApi.getMyStats();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

export const requestWithdrawal = createAsyncThunk(
  "reward/requestWithdrawal",
  async (data: CreateWithdrawalData, { rejectWithValue }) => {
    try {
      return await rewardApi.requestWithdrawal(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to request withdrawal"
      );
    }
  }
);

export const fetchMyWithdrawals = createAsyncThunk(
  "reward/fetchMyWithdrawals",
  async (_, { rejectWithValue }) => {
    try {
      return await rewardApi.getMyWithdrawals();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch withdrawals"
      );
    }
  }
);

export const cancelWithdrawal = createAsyncThunk(
  "reward/cancelWithdrawal",
  async (withdrawalId: string, { rejectWithValue }) => {
    try {
      await rewardApi.cancelWithdrawal(withdrawalId);
      return withdrawalId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel withdrawal"
      );
    }
  }
);

const rewardSlice = createSlice({
  name: "reward",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<RewardSearchParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<RewardState["pagination"]>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch balance
      .addCase(fetchMyBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
      })
      // Fetch transactions
      .addCase(fetchMyTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTransactions.fulfilled, (state, action) => {
        state.loading = false;
        // Add defensive checks for the payload structure
        if (action.payload && typeof action.payload === "object") {
          state.transactions = action.payload.transactions || [];
          state.pagination = action.payload.pagination || state.pagination;
        } else {
          // Fallback if payload is not in expected format
          state.transactions = [];
          state.error = "Invalid response format from server";
        }
      })
      .addCase(fetchMyTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Keep existing transactions on error
      })
      // Fetch stats
      .addCase(fetchMyStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Request withdrawal
      .addCase(requestWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawals.unshift(action.payload);
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch withdrawals
      .addCase(fetchMyWithdrawals.fulfilled, (state, action) => {
        state.withdrawals = action.payload;
      })
      // Cancel withdrawal
      .addCase(cancelWithdrawal.fulfilled, (state, action) => {
        state.withdrawals = state.withdrawals.filter(
          (w) => w.id !== action.payload
        );
      });
  },
});

export const { clearError, setFilters, clearFilters, setPagination } =
  rewardSlice.actions;

export default rewardSlice.reducer;
