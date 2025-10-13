/**
 * API Utility functions for making HTTP requests
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

/**
 * Creates a complete API URL by combining base URL with endpoint
 */
export const createApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

/**
 * Enhanced fetch function that automatically uses the correct API base URL
 */
export const apiFetch = (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const url = createApiUrl(endpoint);
  return fetch(url, options);
};

/**
 * Get authorization header with token
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Enhanced fetch with automatic auth headers
 */
export const authFetch = (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  return apiFetch(endpoint, {
    ...options,
    headers,
  });
};
