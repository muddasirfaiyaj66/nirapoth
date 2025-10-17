import { api } from "./apiClient";

export interface Division {
  id: string;
  name: string;
  bn_name: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface District {
  id: string;
  divisionId: string;
  name: string;
  bn_name: string;
  lat?: string;
  lon?: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
  division?: Division;
}

export interface Upazila {
  id: string;
  districtId: string;
  name: string;
  bn_name: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
  district?: District & { division?: Division };
}

export interface SearchResults {
  divisions: Division[];
  districts: District[];
  upazilas: Upazila[];
}

export const bdGeoApi = {
  /**
   * Get all divisions
   */
  getDivisions: async (): Promise<Division[]> => {
    const response = await api.get("/bd-geo/divisions");
    return response.data.data;
  },

  /**
   * Get districts (optionally filtered by division)
   */
  getDistricts: async (divisionId?: string): Promise<District[]> => {
    const url = divisionId
      ? `/bd-geo/districts?divisionId=${divisionId}`
      : "/bd-geo/districts";
    const response = await api.get(url);
    return response.data.data;
  },

  /**
   * Get upazilas (optionally filtered by district)
   */
  getUpazilas: async (districtId?: string): Promise<Upazila[]> => {
    const url = districtId
      ? `/bd-geo/upazilas?districtId=${districtId}`
      : "/bd-geo/upazilas";
    const response = await api.get(url);
    return response.data.data;
  },

  /**
   * Search locations by query
   */
  searchLocations: async (query: string): Promise<SearchResults> => {
    const response = await api.get(
      `/bd-geo/search?q=${encodeURIComponent(query)}`
    );
    return response.data.data;
  },
};
