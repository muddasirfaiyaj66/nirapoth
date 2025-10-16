import { toast } from "sonner";

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

/**
 * Show error toast with proper message extraction
 */
export const showErrorToast = (error: any, fallback?: string) => {
  const message = getErrorMessage(error, fallback);
  toast.error(message);
};

/**
 * Show success toast
 */
export const showSuccessToast = (message: string, options?: any) => {
  toast.success(message, options);
};
