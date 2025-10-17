import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import dashboardSlice from "./slices/dashboardSlice";
import userSlice from "./slices/userSlice";
import violationSlice from "./slices/violationSlice";
import vehicleSlice from "./slices/vehicleSlice";
import adminUsersSlice from "./slices/adminUsersSlice";
import adminViolationsSlice from "./slices/adminViolationsSlice";
import profileSlice from "./slices/profileSlice";
import systemAnalyticsSlice from "./slices/systemAnalyticsSlice";
import revenueAnalyticsSlice from "./slices/revenueAnalyticsSlice";
import trafficAnalyticsSlice from "./slices/trafficAnalyticsSlice";
import fineSlice from "./slices/fineSlice";
import notificationSlice from "./slices/notificationSlice";
import citizenReportsSlice from "./slices/citizenReportsSlice";
import rewardSlice from "./slices/rewardSlice";
import debtSlice from "./slices/debtSlice";
import accidentsSlice from "./slices/accidentsSlice";
import speedMonitoringSlice from "./slices/speedMonitoringSlice";
import analyticsSlice from "./slices/analyticsSlice";
import citizenAnalyticsSlice from "./slices/citizenAnalyticsSlice";
import drivingLicenseSlice from "./slices/drivingLicenseSlice";
import vehicleManagementSlice from "./slices/vehicleManagementSlice";

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
    systemAnalytics: systemAnalyticsSlice,
    revenueAnalytics: revenueAnalyticsSlice,
    trafficAnalytics: trafficAnalyticsSlice,
    fine: fineSlice,
    notification: notificationSlice,
    citizenReports: citizenReportsSlice,
    reward: rewardSlice,
    debt: debtSlice,
    accidents: accidentsSlice,
    speedMonitoring: speedMonitoringSlice,
    analytics: analyticsSlice,
    citizenAnalytics: citizenAnalyticsSlice,
    drivingLicense: drivingLicenseSlice,
    vehicleManagement: vehicleManagementSlice,
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
