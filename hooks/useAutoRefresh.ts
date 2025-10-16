import { useEffect, useRef } from "react";

export interface UseAutoRefreshOptions {
  enabled?: boolean;
  interval?: number; // in milliseconds
  onRefresh: () => void | Promise<void>;
}

/**
 * Hook to automatically refresh data at specified intervals
 * @param options Configuration options for auto-refresh
 * @returns Refresh function to manually trigger refresh
 */
export function useAutoRefresh({
  enabled = true,
  interval = 30000, // Default: 30 seconds
  onRefresh,
}: UseAutoRefreshOptions): () => void {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onRefreshRef = useRef(onRefresh);

  // Keep onRefresh ref updated
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Initial fetch
    onRefreshRef.current();

    // Set up interval for auto-refresh
    intervalRef.current = setInterval(() => {
      onRefreshRef.current();
    }, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval]);

  // Manual refresh function
  const manualRefresh = () => {
    onRefreshRef.current();
  };

  return manualRefresh;
}

/**
 * Hook to refresh data when the window regains focus
 * @param onRefresh Function to call when window regains focus
 */
export function useRefreshOnFocus(onRefresh: () => void | Promise<void>): void {
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    const handleFocus = () => {
      onRefreshRef.current();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);
}

/**
 * Hook to refresh data when the page becomes visible
 * @param onRefresh Function to call when page becomes visible
 */
export function useRefreshOnVisible(
  onRefresh: () => void | Promise<void>
): void {
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        onRefreshRef.current();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}

/**
 * Combined hook for comprehensive auto-refresh functionality
 * Includes: auto-refresh, refresh on focus, and refresh on visible
 */
export function useComprehensiveRefresh(
  options: UseAutoRefreshOptions
): () => void {
  const manualRefresh = useAutoRefresh(options);
  useRefreshOnFocus(options.onRefresh);
  useRefreshOnVisible(options.onRefresh);

  return manualRefresh;
}
