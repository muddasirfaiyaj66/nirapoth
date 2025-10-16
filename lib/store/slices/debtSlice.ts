import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  debtApi,
  OutstandingDebt,
  DebtSummary,
  DebtPaymentData,
} from "@/lib/api/debt";

interface DebtState {
  debts: OutstandingDebt[];
  totalDebt: number;
  totalLateFees: number;
  debtCount: number;
  oldestDueDate: string | null;
  loading: boolean;
  error: string | null;
  paymentLoading: boolean;
  paymentError: string | null;
}

const initialState: DebtState = {
  debts: [],
  totalDebt: 0,
  totalLateFees: 0,
  debtCount: 0,
  oldestDueDate: null,
  loading: false,
  error: null,
  paymentLoading: false,
  paymentError: null,
};

/**
 * Fetch user's debts with summary
 */
export const fetchMyDebts = createAsyncThunk<
  DebtSummary,
  void,
  { rejectValue: string }
>("debt/fetchMyDebts", async (_, { rejectWithValue }) => {
  try {
    const response = await debtApi.getMyDebts();
    if (response.success && response.data) {
      return response.data;
    }
    return rejectWithValue(response.error || "No data received");
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch debts"
    );
  }
});

/**
 * Fetch total debt amount
 */
export const fetchTotalDebt = createAsyncThunk<
  { totalDebt: number; hasDebt: boolean },
  void,
  { rejectValue: string }
>("debt/fetchTotalDebt", async (_, { rejectWithValue }) => {
  try {
    const response = await debtApi.getTotalDebt();
    if (response.success && response.data) {
      // Ensure the returned payload includes `hasDebt` (derive from totalDebt if missing)
      return {
        totalDebt: response.data.totalDebt,
        hasDebt:
          // cast to any to safely access optional property when the API type doesn't declare it
          (response.data as any).hasDebt ?? response.data.totalDebt > 0,
      };
    }
    return rejectWithValue(response.error || "No data received");
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch total debt"
    );
  }
});

/**
 * Make a payment towards a debt
 */
export const makeDebtPayment = createAsyncThunk<
  OutstandingDebt,
  DebtPaymentData,
  { rejectValue: string }
>("debt/makePayment", async (paymentData, { rejectWithValue }) => {
  try {
    const response = await debtApi.payDebt(paymentData);
    if (response.success && response.data) {
      return response.data;
    }
    return rejectWithValue(response.error || "No data received");
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || "Failed to process payment"
    );
  }
});

/**
 * Get details of a specific debt
 */
export const fetchDebtDetails = createAsyncThunk<
  OutstandingDebt,
  string,
  { rejectValue: string }
>("debt/fetchDebtDetails", async (debtId, { rejectWithValue }) => {
  try {
    const response = await debtApi.getDebtDetails(debtId);
    if (response.success && response.data) {
      return response.data;
    }
    return rejectWithValue(response.error || "No data received");
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch debt details"
    );
  }
});

const debtSlice = createSlice({
  name: "debt",
  initialState,
  reducers: {
    clearDebtError: (state) => {
      state.error = null;
      state.paymentError = null;
    },
    clearDebtState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch my debts
    builder
      .addCase(fetchMyDebts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyDebts.fulfilled,
        (state, action: PayloadAction<DebtSummary>) => {
          state.loading = false;
          state.debts = action.payload.debts;
          state.totalDebt = action.payload.totalDebt;
          state.totalLateFees = action.payload.totalLateFees;
          state.debtCount = action.payload.debtCount;
          state.oldestDueDate = action.payload.oldestDueDate;
          state.error = null;
        }
      )
      .addCase(fetchMyDebts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch debts";
      });

    // Fetch total debt
    builder
      .addCase(fetchTotalDebt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalDebt.fulfilled, (state, action) => {
        state.loading = false;
        state.totalDebt = action.payload.totalDebt;
        state.error = null;
      })
      .addCase(fetchTotalDebt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch total debt";
      });

    // Make debt payment
    builder
      .addCase(makeDebtPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(
        makeDebtPayment.fulfilled,
        (state, action: PayloadAction<OutstandingDebt>) => {
          state.paymentLoading = false;
          state.paymentError = null;

          // Update the debt in the list
          const index = state.debts.findIndex(
            (debt) => debt.id === action.payload.id
          );
          if (index !== -1) {
            state.debts[index] = action.payload;

            // If debt is paid, remove from list
            if (action.payload.status === "PAID") {
              state.debts.splice(index, 1);
              state.debtCount -= 1;
            }
          }

          // Recalculate totals
          state.totalDebt = state.debts.reduce(
            (sum, debt) => sum + (debt.currentAmount - debt.paidAmount),
            0
          );
          state.totalLateFees = state.debts.reduce(
            (sum, debt) => sum + debt.lateFees,
            0
          );
        }
      )
      .addCase(makeDebtPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload ?? "Failed to process payment";
      });

    // Fetch debt details
    builder
      .addCase(fetchDebtDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDebtDetails.fulfilled,
        (state, action: PayloadAction<OutstandingDebt>) => {
          state.loading = false;
          state.error = null;

          // Update or add debt to the list
          const index = state.debts.findIndex(
            (debt) => debt.id === action.payload.id
          );
          if (index !== -1) {
            state.debts[index] = action.payload;
          } else {
            state.debts.push(action.payload);
          }
        }
      )
      .addCase(fetchDebtDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch debt details";
      });
  },
});

export const { clearDebtError, clearDebtState } = debtSlice.actions;
export default debtSlice.reducer;
