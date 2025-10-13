import { useAppDispatch, useAppSelector } from "../store";
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  getCurrentUser as getCurrentUserAction,
  forgotPassword as forgotPasswordAction,
  resetPassword as resetPasswordAction,
  verifyEmail as verifyEmailAction,
  clearAuth,
  setLoading,
  setError,
} from "../store/slices/authSlice";
import { useCallback } from "react";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        await dispatch(loginAction(credentials)).unwrap();
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error };
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (userData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone: string;
      nidNo?: string;
      birthCertificateNo?: string;
      role?: string;
    }) => {
      try {
        await dispatch(registerAction(userData)).unwrap();
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error };
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAction()).unwrap();
      return { success: true };
    } catch (error: any) {
      // Even if logout fails on server, clear local state
      dispatch(clearAuth());
      return { success: false, error: error };
    }
  }, [dispatch]);

  const getCurrentUser = useCallback(async () => {
    try {
      const user = await dispatch(getCurrentUserAction()).unwrap();
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error };
    }
  }, [dispatch]);

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        await dispatch(forgotPasswordAction({ email })).unwrap();
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error };
      }
    },
    [dispatch]
  );

  const resetPassword = useCallback(
    async (token: string, password: string) => {
      try {
        const user = await dispatch(
          resetPasswordAction({ token, password })
        ).unwrap();
        return { success: true, user };
      } catch (error: any) {
        return { success: false, error: error };
      }
    },
    [dispatch]
  );

  const verifyEmail = useCallback(
    async (token: string) => {
      try {
        const user = await dispatch(verifyEmailAction(token)).unwrap();
        return { success: true, user };
      } catch (error: any) {
        return { success: false, error: error };
      }
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  const setLoadingState = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(loading));
    },
    [dispatch]
  );

  return {
    // State
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,

    // Actions
    login,
    register,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
    clearError,
    setLoadingState,
  };
};
