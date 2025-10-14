import { api, resetApiState } from "./apiClient";

// Define UserRole enum to match backend
export enum UserRole {
  CITIZEN = "CITIZEN",
  POLICE = "POLICE",
  FIRE_SERVICE = "FIRE_SERVICE",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

// Types
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  designation?: string;
  stationId?: string;
  nidNo?: string;
  birthCertificateNo?: string;
  profileImage?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  nidNo?: string;
  birthCertificateNo?: string;
  role?: UserRole;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
  errors?: string[];
}

// Auth API functions
export const authApi = {
  // Register user
  register: async (userData: RegisterData) => {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    if (!response.success) {
      throw new Error(response.error?.message || "Registration failed");
    }
    return response.data!;
  },

  // Login user
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    if (!response.success) {
      throw new Error(response.error?.message || "Login failed");
    }
    return response.data!;
  },

  // Logout user
  logout: async () => {
    const response = await api.post("/auth/logout");
    resetApiState();
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get<{ user: UserProfile }>("/auth/me");
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to get user");
    }
    return response.data!.user;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post<AuthResponse>("/auth/refresh");
    if (!response.success) {
      throw new Error(response.error?.message || "Token refresh failed");
    }
    return response.data!;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await api.post("/auth/forgot-password", data);
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to send reset email");
    }
    return response;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordData) => {
    const response = await api.post<{ user: UserProfile }>(
      "/auth/reset-password",
      data
    );
    if (!response.success) {
      throw new Error(response.error?.message || "Password reset failed");
    }
    return response.data!.user;
  },

  // Verify email
  verifyEmail: async (token: string) => {
    const response = await api.get<{ user: UserProfile }>(
      `/auth/verify-email?token=${token}`
    );
    if (!response.success) {
      throw new Error(response.error?.message || "Email verification failed");
    }
    return response.data!.user;
  },
};

export { resetApiState };
export default api;
