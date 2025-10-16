// Re-export all API modules
export * from "./auth";
export * from "./vehicles";
export * from "./violations";
export * from "./complaints";
export * from "./payments";
export * from "./dashboard";
export * from "./admin";
export * from "./citizen";
export * from "./drivingLicense";
export * from "./vehicleAssignment";
export * from "./userProfile";
export * from "./policeManagement";
export * from "./aiIntegration";
export * from "./notifications";
export * from "./citizenReports";

// Export the main API instance
export { default as api } from "./auth";
