/**
 * Google Maps Utility Functions
 *
 * Utilities for working with Google Maps in the NiraPoth application
 */

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  district: string;
  division: string;
}

export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  description?: string;
  type?: "violation" | "report" | "incident" | "default";
}

/**
 * Convert location data to map marker format
 */
export const locationToMarker = (
  id: string,
  location: LocationData,
  title: string,
  description?: string,
  type?: MapMarker["type"]
): MapMarker => {
  return {
    id,
    position: {
      lat: location.latitude,
      lng: location.longitude,
    },
    title,
    description: description || location.address,
    type: type || "default",
  };
};

/**
 * Calculate the center point of multiple locations
 */
export const calculateCenter = (
  markers: MapMarker[]
): { lat: number; lng: number } => {
  if (markers.length === 0) {
    // Default to Dhaka, Bangladesh
    return { lat: 23.8103, lng: 90.4125 };
  }

  const sum = markers.reduce(
    (acc, marker) => ({
      lat: acc.lat + marker.position.lat,
      lng: acc.lng + marker.position.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / markers.length,
    lng: sum.lng / markers.length,
  };
};

/**
 * Calculate distance between two coordinates in kilometers
 * Using the Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Find the zoom level that fits all markers
 */
export const getOptimalZoom = (markers: MapMarker[]): number => {
  if (markers.length <= 1) return 13;

  // Calculate the bounds
  const lats = markers.map((m) => m.position.lat);
  const lngs = markers.map((m) => m.position.lng);

  const maxLat = Math.max(...lats);
  const minLat = Math.min(...lats);
  const maxLng = Math.max(...lngs);
  const minLng = Math.min(...lngs);

  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);

  // Estimate zoom level based on the span
  if (maxDiff > 5) return 8;
  if (maxDiff > 2) return 9;
  if (maxDiff > 1) return 10;
  if (maxDiff > 0.5) return 11;
  if (maxDiff > 0.2) return 12;
  if (maxDiff > 0.1) return 13;
  if (maxDiff > 0.05) return 14;
  return 15;
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

/**
 * Validate if coordinates are within Bangladesh bounds
 */
export const isWithinBangladesh = (lat: number, lng: number): boolean => {
  // Approximate bounds of Bangladesh
  const bounds = {
    north: 26.63,
    south: 20.74,
    east: 92.67,
    west: 88.01,
  };

  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lng >= bounds.west &&
    lng <= bounds.east
  );
};

/**
 * Get Google Maps link for a location
 */
export const getGoogleMapsLink = (lat: number, lng: number): string => {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

/**
 * Get directions link between two points
 */
export const getDirectionsLink = (
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): string => {
  return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}`;
};
