import { API_CONFIG, buildApiUrl, getAuthHeaders } from "../config/api.config";

/**
 * Generic API client for making HTTP requests with proper error handling
 */
export class ApiClient {
  /**
   * Check if user is authenticated before making admin requests
   */
  private static checkAuth(): boolean {
    if (typeof window !== "undefined") {
      // Check if auth state indicates user is logged out
      const isLoggedOut = localStorage.getItem("auth_logged_out") === "true";
      if (isLoggedOut) {
        return false;
      }
    }
    return true;
  }

  /**
   * Make a GET request
   */
  static async get<T = any>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    if (!this.checkAuth()) {
      throw new Error("User is logged out");
    }
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = searchParams.toString()
      ? `${buildApiUrl(endpoint)}?${searchParams}`
      : buildApiUrl(endpoint);

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      }
      if (response.status === 401) {
        throw new Error("Authentication required. Please login.");
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Make a POST request
   */
  static async post<T = any>(endpoint: string, data?: any): Promise<T> {
    if (!this.checkAuth()) {
      throw new Error("User is logged out");
    }
    const response = await fetch(buildApiUrl(endpoint), {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include", // Include cookies for authentication
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      }
      if (response.status === 401) {
        throw new Error("Authentication required. Please login.");
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Make a PUT request
   */
  static async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(buildApiUrl(endpoint), {
      method: "PUT",
      headers: getAuthHeaders(),
      credentials: "include", // Include cookies for authentication
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Make a DELETE request
   */
  static async delete<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(buildApiUrl(endpoint), {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

/**
 * Admin API service with specific methods for admin operations
 */
export class AdminApiService {
  // User Management
  static async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    return ApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_USERS, params);
  }

  static async blockUser(userId: string, blocked: boolean) {
    return ApiClient.post(`${API_CONFIG.ENDPOINTS.ADMIN_USERS}/block`, {
      userId,
      blocked,
    });
  }

  static async deleteUser(userId: string) {
    return ApiClient.post(`${API_CONFIG.ENDPOINTS.ADMIN_USERS}/delete`, {
      userId,
    });
  }

  static async createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    password: string;
    nidNo?: string;
    birthCertificateNo?: string;
  }) {
    return ApiClient.post(
      `${API_CONFIG.ENDPOINTS.ADMIN_USERS}/create`,
      userData
    );
  }

  static async updateUserRole(userId: string, newRole: string) {
    return ApiClient.post(`${API_CONFIG.ENDPOINTS.ADMIN_USERS}/update-role`, {
      userId,
      role: newRole, // Backend expects 'role', not 'newRole'
    });
  }

  static async verifyUser(userId: string, verified: boolean) {
    return ApiClient.post(`${API_CONFIG.ENDPOINTS.ADMIN_USERS}/verify`, {
      userId,
      verified,
    });
  }

  static async unblockUser(userId: string) {
    return ApiClient.post(`${API_CONFIG.ENDPOINTS.ADMIN_USERS}/unblock`, {
      userId,
    });
  }

  static async getVerifications(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    return ApiClient.get(
      `${API_CONFIG.ENDPOINTS.ADMIN_USERS}/verifications`,
      params
    );
  }

  // Violation Management
  static async getViolations(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    method?: string;
  }) {
    return ApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_VIOLATIONS, params);
  }

  static async updateViolationStatus(violationId: string, status: string) {
    return ApiClient.post(
      `${API_CONFIG.ENDPOINTS.ADMIN_VIOLATIONS}/update-status`,
      { violationId, status }
    );
  }

  // Analytics
  static async getSystemAnalytics(params?: { range?: string }) {
    return ApiClient.get(
      `${API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS}/system`,
      params
    );
  }

  static async getRevenueAnalytics(params?: {
    range?: string;
    granularity?: string;
  }) {
    return ApiClient.get(
      `${API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS}/revenue`,
      params
    );
  }

  static async getTrafficAnalytics(params?: {
    range?: string;
    location?: string;
    violationType?: string;
  }) {
    return ApiClient.get(
      `${API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS}/traffic`,
      params
    );
  }

  static async getDashboardStats() {
    return ApiClient.get(`${API_CONFIG.ENDPOINTS.ADMIN}/dashboard/stats`);
  }

  // System Management
  static async getSystemConfig() {
    return ApiClient.get(`${API_CONFIG.ENDPOINTS.ADMIN}/system/config`);
  }

  static async updateSystemConfig(config: any) {
    return ApiClient.post(
      `${API_CONFIG.ENDPOINTS.ADMIN}/system/config`,
      config
    );
  }
}
