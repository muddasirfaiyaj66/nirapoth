import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "./slices/authSlice";
import adminUsersReducer from "./slices/adminUsersSlice";
import adminViolationsReducer from "./slices/adminViolationsSlice";
import vehiclesReducer from "./slices/vehiclesSlice";
import licensesReducer from "./slices/licensesSlice";
import policeReducer from "./slices/policeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminUsers: adminUsersReducer,
    adminViolations: adminViolationsReducer,
    vehicles: vehiclesReducer,
    licenses: licensesReducer,
    police: policeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
