import axios, { AxiosResponse } from "axios";

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

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true, // Important for httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Token will be handled by httpOnly cookies, but we can add other headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let isLoggingOut = false;
let failedQueue: Array<{
  resolve: (token?: any) => void;
  reject: (error: any) => void;
}> = [];

// Process queued requests after refresh completes
const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Reset API state (call on logout)
export const resetApiState = () => {
  isRefreshing = false;
  isLoggingOut = false;
  failedQueue = [];
};

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh for logout requests, refresh requests, or if we're logging out
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoggingOut &&
      !originalRequest.url?.includes("/auth/logout") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      // If we're already refreshing, add to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        await api.post("/auth/refresh");
        processQueue(null);
        isRefreshing = false;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        // Only redirect to login if we're in a browser environment
        // and it's not a programmatic logout
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          // Clear any auth state before redirecting
          localStorage.removeItem("auth");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  // Register user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post(
      "/auth/register",
      userData
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post(
      "/auth/login",
      credentials
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      isLoggingOut = true;
      await api.post("/auth/logout");
    } finally {
      isLoggingOut = false;
      // Reset refresh state in case there were any pending refreshes
      isRefreshing = false;
      failedQueue = [];
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<UserProfile> => {
    const response: AxiosResponse<ApiResponse<{ user: UserProfile }>> =
      await api.get("/auth/me");

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!.user;
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post(
      "/auth/refresh"
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData): Promise<void> => {
    const response: AxiosResponse<ApiResponse> = await api.post(
      "/auth/forgot-password",
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Reset password
  resetPassword: async (data: ResetPasswordData): Promise<UserProfile> => {
    const response: AxiosResponse<ApiResponse<{ user: UserProfile }>> =
      await api.post("/auth/reset-password", data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!.user;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<UserProfile> => {
    const response: AxiosResponse<ApiResponse<{ user: UserProfile }>> =
      await api.get(`/auth/verify-email?token=${token}`);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!.user;
  },
};

export default api;
