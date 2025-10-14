import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiErrorHandler, handleApiResponse } from "../utils/errorHandler";

// Extend axios types
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    metadata?: { startTime: Date };
  }
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

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

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful requests in development
    if (process.env.NODE_ENV === "development") {
      const duration =
        new Date().getTime() - response.config.metadata?.startTime?.getTime();
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${
          response.config.url
        } - ${duration}ms`
      );
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      const duration =
        new Date().getTime() - originalRequest?.metadata?.startTime?.getTime();
      console.error(
        `❌ ${originalRequest?.method?.toUpperCase()} ${
          originalRequest?.url
        } - ${duration}ms`,
        error.response?.data
      );
    }

    // Handle 401 errors with token refresh
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
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        await apiClient.post("/auth/refresh");
        processQueue(null);
        isRefreshing = false;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        // Only redirect to login if we're in a browser environment
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          localStorage.removeItem("auth");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Generic API methods with consistent error handling
export const api = {
  get: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<{ success: boolean; data?: T; error?: any }> => {
    try {
      const response: AxiosResponse<{
        success: boolean;
        data?: T;
        message?: string;
        statusCode?: number;
      }> = await apiClient.get(url, config);

      return handleApiResponse(response.data);
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error);
      return { success: false, error: apiError };
    }
  },

  post: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<{ success: boolean; data?: T; error?: any }> => {
    try {
      const response: AxiosResponse<{
        success: boolean;
        data?: T;
        message?: string;
        statusCode?: number;
      }> = await apiClient.post(url, data, config);

      return handleApiResponse(response.data);
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error);
      return { success: false, error: apiError };
    }
  },

  put: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<{ success: boolean; data?: T; error?: any }> => {
    try {
      const response: AxiosResponse<{
        success: boolean;
        data?: T;
        message?: string;
        statusCode?: number;
      }> = await apiClient.put(url, data, config);

      return handleApiResponse(response.data);
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error);
      return { success: false, error: apiError };
    }
  },

  delete: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<{ success: boolean; data?: T; error?: any }> => {
    try {
      const response: AxiosResponse<{
        success: boolean;
        data?: T;
        message?: string;
        statusCode?: number;
      }> = await apiClient.delete(url, config);

      return handleApiResponse(response.data);
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error);
      return { success: false, error: apiError };
    }
  },

  patch: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<{ success: boolean; data?: T; error?: any }> => {
    try {
      const response: AxiosResponse<{
        success: boolean;
        data?: T;
        message?: string;
        statusCode?: number;
      }> = await apiClient.patch(url, data, config);

      return handleApiResponse(response.data);
    } catch (error) {
      const apiError = ApiErrorHandler.handle(error);
      return { success: false, error: apiError };
    }
  },
};

export default apiClient;
