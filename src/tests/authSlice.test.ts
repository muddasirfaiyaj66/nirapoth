import { configureStore } from "@reduxjs/toolkit";
import authSlice, {
  login,
  register,
  logout,
  getCurrentUser,
  initialState,
} from "../lib/store/slices/authSlice";

// Mock the API
jest.mock("../lib/api/auth", () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
}));

import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getCurrentUser as getCurrentUserApi,
} from "../lib/api/auth";

const mockLoginApi = loginApi as jest.MockedFunction<typeof loginApi>;
const mockRegisterApi = registerApi as jest.MockedFunction<typeof registerApi>;
const mockLogoutApi = logoutApi as jest.MockedFunction<typeof logoutApi>;
const mockGetCurrentUserApi = getCurrentUserApi as jest.MockedFunction<
  typeof getCurrentUserApi
>;

describe("Auth Slice", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authSlice,
      },
    });
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should handle login pending", () => {
      const action = { type: login.pending.type };
      const state = authSlice(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle login fulfilled", () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        role: "CITIZEN",
        isActive: true,
        isEmailVerified: true,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      };

      const mockTokens = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };

      const action = {
        type: login.fulfilled.type,
        payload: {
          success: true,
          data: {
            user: mockUser,
            tokens: mockTokens,
          },
        },
      };

      const state = authSlice(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.tokens).toEqual(mockTokens);
      expect(state.error).toBe(null);
    });

    it("should handle login rejected", () => {
      const action = {
        type: login.rejected.type,
        payload: "Login failed",
      };

      const state = authSlice(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
      expect(state.tokens).toBe(null);
      expect(state.error).toBe("Login failed");
    });
  });

  describe("register", () => {
    it("should handle register pending", () => {
      const action = { type: register.pending.type };
      const state = authSlice(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle register fulfilled", () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        role: "CITIZEN",
        isActive: true,
        isEmailVerified: false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      };

      const mockTokens = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };

      const action = {
        type: register.fulfilled.type,
        payload: {
          success: true,
          data: {
            user: mockUser,
            tokens: mockTokens,
          },
        },
      };

      const state = authSlice(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.tokens).toEqual(mockTokens);
      expect(state.error).toBe(null);
    });

    it("should handle register rejected", () => {
      const action = {
        type: register.rejected.type,
        payload: "Registration failed",
      };

      const state = authSlice(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
      expect(state.tokens).toBe(null);
      expect(state.error).toBe("Registration failed");
    });
  });

  describe("logout", () => {
    it("should handle logout pending", () => {
      const action = { type: logout.pending.type };
      const state = authSlice(initialState, action);

      expect(state.loading).toBe(true);
    });

    it("should handle logout fulfilled", () => {
      const action = {
        type: logout.fulfilled.type,
        payload: {
          success: true,
          message: "Logged out successfully",
        },
      };

      const state = authSlice(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
      expect(state.tokens).toBe(null);
      expect(state.error).toBe(null);
    });

    it("should handle logout rejected", () => {
      const action = {
        type: logout.rejected.type,
        payload: "Logout failed",
      };

      const state = authSlice(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Logout failed");
    });
  });

  describe("getCurrentUser", () => {
    it("should handle getCurrentUser pending", () => {
      const action = { type: getCurrentUser.pending.type };
      const state = authSlice(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle getCurrentUser fulfilled", () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        role: "CITIZEN",
        isActive: true,
        isEmailVerified: true,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      };

      const action = {
        type: getCurrentUser.fulfilled.type,
        payload: {
          success: true,
          data: {
            user: mockUser,
          },
        },
      };

      const state = authSlice(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBe(null);
    });

    it("should handle getCurrentUser rejected", () => {
      const action = {
        type: getCurrentUser.rejected.type,
        payload: "Failed to get current user",
      };

      const state = authSlice(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
      expect(state.error).toBe("Failed to get current user");
    });
  });
});
