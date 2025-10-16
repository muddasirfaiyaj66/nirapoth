import apiClient from "./apiClient";

export interface Camera {
  id: string;
  name: string | null;
  streamUrl: string;
  installedAt: string;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "OFFLINE";
  locationId: string | null;
  location?: {
    id: string;
    address: string | null;
    city: string | null;
    district: string | null;
    latitude: number;
    longitude: number;
  } | null;
  stationId: string | null;
  station?: {
    id: string;
    name: string;
  } | null;
  fireServiceId: string | null;
  fireService?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CameraStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  offline: number;
  operationalRate: string;
}

export interface Location {
  id: string;
  address: string | null;
  city: string | null;
  district: string | null;
  latitude: number;
  longitude: number;
}

export interface PoliceStation {
  id: string;
  name: string;
}

export interface CreateCameraRequest {
  name?: string;
  streamUrl: string;
  status?: Camera["status"];
  locationId?: string;
  stationId?: string;
  fireServiceId?: string;
}

export interface UpdateCameraRequest extends Partial<CreateCameraRequest> {}

export interface GetCamerasRequest {
  status?: Camera["status"];
  locationId?: string;
  stationId?: string;
  search?: string;
}

export class CameraApiService {
  /**
   * Get all cameras with optional filtering
   */
  static async getCameras(params?: GetCamerasRequest): Promise<Camera[]> {
    const response = await apiClient.get("/cameras", { params });
    return response.data.data;
  }

  /**
   * Get a single camera by ID
   */
  static async getCameraById(id: string): Promise<Camera> {
    const response = await apiClient.get(`/cameras/${id}`);
    return response.data.data;
  }

  /**
   * Create a new camera
   */
  static async createCamera(data: CreateCameraRequest): Promise<Camera> {
    const response = await apiClient.post("/cameras", data);
    return response.data.data;
  }

  /**
   * Update an existing camera
   */
  static async updateCamera(
    id: string,
    data: UpdateCameraRequest
  ): Promise<Camera> {
    const response = await apiClient.put(`/cameras/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete a camera
   */
  static async deleteCamera(id: string): Promise<void> {
    await apiClient.delete(`/cameras/${id}`);
  }

  /**
   * Get camera statistics
   */
  static async getCameraStats(): Promise<CameraStats> {
    const response = await apiClient.get("/cameras/stats");
    return response.data.data;
  }

  /**
   * Update camera status only
   */
  static async updateCameraStatus(
    id: string,
    status: Camera["status"]
  ): Promise<Camera> {
    const response = await apiClient.patch(`/cameras/${id}/status`, { status });
    return response.data.data;
  }

  /**
   * Get locations for dropdown
   */
  static async getLocations(): Promise<Location[]> {
    const response = await apiClient.get("/cameras/locations");
    return response.data.data;
  }

  /**
   * Get police stations for dropdown
   */
  static async getPoliceStations(): Promise<PoliceStation[]> {
    const response = await apiClient.get("/cameras/stations");
    return response.data.data;
  }
}
