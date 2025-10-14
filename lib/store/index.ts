import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import dashboardSlice from "./slices/dashboardSlice";
import userSlice from "./slices/userSlice";
import violationSlice from "./slices/violationSlice";
import vehicleSlice from "./slices/vehicleSlice";
import adminUsersSlice from "./slices/adminUsersSlice";
import adminViolationsSlice from "./slices/adminViolationsSlice";
import profileSlice from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    dashboard: dashboardSlice,
    user: userSlice,
    violation: violationSlice,
    vehicle: vehicleSlice,
    adminUsers: adminUsersSlice,
    adminViolations: adminViolationsSlice,
    profile: profileSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Redux hooks
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

// Custom hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
