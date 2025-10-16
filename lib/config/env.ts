/**
 * Centralized environment variable configuration
 * This file helps with debugging and ensures consistent access to env vars
 */

// Cloudinary Configuration
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
} as const;

// API Configuration
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  aiServiceUrl:
    process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000",
} as const;

// Check if Cloudinary is configured
export const isCloudinaryConfigured = (): boolean => {
  const hasCloudName =
    !!cloudinaryConfig.cloudName && cloudinaryConfig.cloudName !== "";
  const hasUploadPreset =
    !!cloudinaryConfig.uploadPreset && cloudinaryConfig.uploadPreset !== "";

  return hasCloudName && hasUploadPreset;
};

// Debug function to log environment variables
export const debugEnvironmentVariables = () => {
  
  console.log(
    "Is Cloudinary Configured?",
    isCloudinaryConfigured() ? "✅ YES" : "❌ NO"
  );

};
