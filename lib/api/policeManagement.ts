import api from "./auth";

// Types
export interface PoliceOfficer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "POLICE";
  designation: string;
  badgeNo: string;
  rank: string;
  joiningDate: string;
  serviceLength?: number;
  specialization?: string;
  stationId?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  station?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface PoliceStation {
  id: string;
  name: string;
  code: string;
  stationType?: string;
  status: "ACTIVE" | "INACTIVE" | "UNDER_CONSTRUCTION" | "TEMPORARY_CLOSED";
  organizationId?: string;
  locationId?: string;
  contactId?: string;
  officerInChargeId?: string;
  capacity?: number;
  currentStrength?: number;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
    code: string;
    level: string;
  };
  location?: {
    id: string;
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    district?: string;
    division?: string;
  };
  contact?: {
    id: string;
    phone?: string;
    email?: string;
    website?: string;
    emergencyPhone?: string;
  };
  officerInCharge?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface PoliceOrganization {
  id: string;
  name: string;
  code: string;
  level:
    | "HEADQUARTERS"
    | "RANGE"
    | "DISTRICT"
    | "CIRCLE"
    | "STATION"
    | "OUTPOST";
  description?: string;
  parentId?: string;
  locationId?: string;
  contactId?: string;
  headOfficerId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parent?: PoliceOrganization;
  children?: PoliceOrganization[];
  stations?: PoliceStation[];
  location?: {
    id: string;
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    district?: string;
    division?: string;
  };
  contact?: {
    id: string;
    phone?: string;
    email?: string;
    website?: string;
    emergencyPhone?: string;
  };
  headOfficer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreatePoliceOfficerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  designation: string;
  badgeNo: string;
  rank: string;
  joiningDate: string;
  stationId?: string;
  specialization?: string;
  presentAddress?: string;
  presentCity?: string;
  presentDistrict?: string;
}

export interface CreatePoliceStationData {
  name: string;
  code: string;
  stationType?: string;
  organizationId?: string;
  locationData: {
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    district?: string;
    division?: string;
  };
  contactData: {
    phone: string;
    email?: string;
  };
  capacity?: number;
  supervisorId?: string;
}

export interface CreateOrganizationData {
  name: string;
  code: string;
  level:
    | "HEADQUARTERS"
    | "RANGE"
    | "DISTRICT"
    | "CIRCLE"
    | "STATION"
    | "OUTPOST";
  description?: string;
  parentId?: string;
  locationData?: {
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    district?: string;
    division?: string;
  };
  contactData?: {
    phone?: string;
    email?: string;
    website?: string;
    emergencyPhone?: string;
  };
  headOfficerId?: string;
}

export interface AssignPoliceData {
  policeId: string;
  stationId: string;
  role?: "OFFICER" | "INSPECTOR" | "SUPERINTENDENT" | "DIG" | "IG";
}

export interface PoliceSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  rank?: string;
  stationId?: string;
  status?: string;
}

export interface StationSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  organizationId?: string;
}

export interface OrganizationSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  parentId?: string;
}

// API functions
export const policeManagementApi = {
  // Police Officers
  // Get all police officers
  getAllPoliceOfficers: async (params?: PoliceSearchParams) => {
    const response = await api.get("/police/officers", { params });
    return response.data;
  },

  // Get police officer by ID
  getPoliceOfficerById: async (officerId: string) => {
    const response = await api.get(`/police/officers/${officerId}`);
    return response.data;
  },

  // Create new police officer
  createPoliceOfficer: async (data: CreatePoliceOfficerData) => {
    const response = await api.post("/police/officers", data);
    return response.data;
  },

  // Update police officer
  updatePoliceOfficer: async (
    officerId: string,
    data: Partial<CreatePoliceOfficerData>
  ) => {
    const response = await api.put(`/police/officers/${officerId}`, data);
    return response.data;
  },

  // Delete police officer
  deletePoliceOfficer: async (officerId: string) => {
    const response = await api.delete(`/police/officers/${officerId}`);
    return response.data;
  },

  // Assign police officer to station
  assignPoliceToStation: async (data: AssignPoliceData) => {
    const response = await api.post("/police/assign", data);
    return response.data;
  },

  // Police Stations
  // Get all police stations
  getAllPoliceStations: async (params?: StationSearchParams) => {
    const response = await api.get("/police/stations", { params });
    return response.data;
  },

  // Get police station by ID
  getPoliceStationById: async (stationId: string) => {
    const response = await api.get(`/police/stations/${stationId}`);
    return response.data;
  },

  // Create new police station
  createPoliceStation: async (data: CreatePoliceStationData) => {
    const response = await api.post("/police/stations", data);
    return response.data;
  },

  // Update police station
  updatePoliceStation: async (
    stationId: string,
    data: Partial<CreatePoliceStationData>
  ) => {
    const response = await api.put(`/police/stations/${stationId}`, data);
    return response.data;
  },

  // Delete police station
  deletePoliceStation: async (stationId: string) => {
    const response = await api.delete(`/police/stations/${stationId}`);
    return response.data;
  },

  // Get station officers
  getStationOfficers: async (stationId: string) => {
    const response = await api.get(`/police/stations/${stationId}/officers`);
    return response.data;
  },

  // Police Organizations
  // Get all police organizations
  getAllPoliceOrganizations: async (params?: OrganizationSearchParams) => {
    const response = await api.get("/police/organizations", { params });
    return response.data;
  },

  // Get police organization by ID
  getPoliceOrganizationById: async (organizationId: string) => {
    const response = await api.get(`/police/organizations/${organizationId}`);
    return response.data;
  },

  // Create new police organization
  createPoliceOrganization: async (data: CreateOrganizationData) => {
    const response = await api.post("/police/organizations", data);
    return response.data;
  },

  // Update police organization
  updatePoliceOrganization: async (
    organizationId: string,
    data: Partial<CreateOrganizationData>
  ) => {
    const response = await api.put(
      `/police/organizations/${organizationId}`,
      data
    );
    return response.data;
  },

  // Delete police organization
  deletePoliceOrganization: async (organizationId: string) => {
    const response = await api.delete(
      `/police/organizations/${organizationId}`
    );
    return response.data;
  },

  // Get organization hierarchy
  getOrganizationHierarchy: async () => {
    const response = await api.get("/police/organizations/hierarchy");
    return response.data;
  },

  // Get organization stations
  getOrganizationStations: async (organizationId: string) => {
    const response = await api.get(
      `/police/organizations/${organizationId}/stations`
    );
    return response.data;
  },

  // Statistics
  // Get police statistics
  getPoliceStats: async () => {
    const response = await api.get("/police/stats");
    return response.data;
  },

  // Get station statistics
  getStationStats: async (stationId: string) => {
    const response = await api.get(`/police/stations/${stationId}/stats`);
    return response.data;
  },
};
