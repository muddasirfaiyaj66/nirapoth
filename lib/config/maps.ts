// Maps configuration
// This file exports the Google Maps API key for use in client components
// TEMPORARY: Hardcoded until Next.js env var issue is resolved

export const GOOGLE_MAPS_CONFIG = {
  apiKey: "AIzaSyApG0jnhmwKVa_m14DR6bHjEvC-dHArT1A",
} as const;

// Helper to check if API key is configured
export const isGoogleMapsConfigured = (): boolean => {
  return !!GOOGLE_MAPS_CONFIG.apiKey && GOOGLE_MAPS_CONFIG.apiKey.length > 0;
};

// Log for debugging (only in development)
if (process.env.NODE_ENV === "development") {
  console.log(
    "[Maps Config] API Key loaded:",
    isGoogleMapsConfigured() ? "Yes" : "No"
  );
  console.log(
    "[Maps Config] API Key length:",
    GOOGLE_MAPS_CONFIG.apiKey?.length || 0
  );
}
