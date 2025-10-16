import { toast } from "sonner";

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: string[];
  details?: any;
}

/**
 * Extract error message from various error types
 * Handles Error objects, strings, and Redux rejection payloads
 */
export const getErrorMessage = (
  error: any,
  fallback: string = "An error occurred"
): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  return fallback;
};

export class ApiErrorHandler {
  static handle(error: any): ApiError {
    console.error("API Error:", error);

    // Network error
    if (!error.response) {
      return {
        message: "Network error. Please check your connection.",
        statusCode: 0,
      };
    }

    // Server error with response
    const { status, data } = error.response;
    const message =
      data?.message || data?.error || "An unexpected error occurred";
    const errors = data?.errors || [];

    return {
      message,
      statusCode: status,
      errors,
      details: data,
    };
  }

  static showError(error: ApiError, customMessage?: string): void {
    const message = customMessage || error.message;

    // Don't show toast for 401 errors (handled by auth interceptor)
    if (error.statusCode === 401) {
      return;
    }

    // Show specific error messages based on status code
    switch (error.statusCode) {
      case 400:
        toast.error(message || "Invalid request. Please check your input.");
        break;
      case 403:
        toast.error("You don't have permission to perform this action.");
        break;
      case 404:
        toast.error("The requested resource was not found.");
        break;
      case 422:
        toast.error(message || "Validation error. Please check your input.");
        break;
      case 500:
        toast.error("Server error. Please try again later.");
        break;
      default:
        toast.error(message);
    }
  }

  static handleAndShow(error: any, customMessage?: string): ApiError {
    const apiError = this.handle(error);
    this.showError(apiError, customMessage);
    return apiError;
  }
}

// Utility function for consistent API response handling
export const handleApiResponse = <T>(
  response: any,
  errorMessage?: string
): { success: boolean; data?: T; error?: ApiError } => {
  if (response?.success) {
    return { success: true, data: response.data };
  }

  const error = ApiErrorHandler.handle({
    response: {
      status: response?.statusCode || 500,
      data: response,
    },
  });

  ApiErrorHandler.showError(error, errorMessage);
  return { success: false, error };
};
