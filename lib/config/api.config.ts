// API Configuration
export const API_CONFIG = {
  BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://your-backend-domain.com" // Replace with your production backend URL
      : "http://localhost:5000", // Backend port
  ENDPOINTS: {
    // Auth endpoints
    AUTH: "/api/auth",
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",

    // Admin endpoints
    ADMIN: "/api/admin",
    ADMIN_USERS: "/api/admin/users",
    ADMIN_VIOLATIONS: "/api/admin/violations",
    ADMIN_ANALYTICS: "/api/admin/analytics",

    // Profile endpoints
    PROFILE: "/api/profile",

    // Dashboard endpoints
    DASHBOARD: "/api/dashboard",
  },
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Common headers for API requests
export const getAuthHeaders = () => {
  // The auth system uses cookies, so we don't need Bearer tokens
  // Just return basic headers since credentials are included via cookies
  return {
    "Content-Type": "application/json",
  };
};
