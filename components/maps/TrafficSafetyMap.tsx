"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  AlertTriangle,
  Clock,
  TrendingUp,
  Loader2,
  Search,
  Route as RouteIcon,
  X,
  Car,
} from "lucide-react";
import { toast } from "sonner";
import { calculateDistance, formatCoordinates } from "@/lib/utils/maps";

export interface TrafficJam {
  id: string;
  location: { lat: number; lng: number };
  roadName: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  delayMinutes: number;
  distance: number; // km from user
  affectedLength: number; // km
  lastUpdated: string;
}

export interface AccidentHotspot {
  id: string;
  location: { lat: number; lng: number };
  roadName: string;
  accidentCount: number;
  severityLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timeRange: string; // e.g., "Last 6 months"
  commonCauses: string[];
}

export interface RouteOption {
  id: string;
  name: string;
  distance: number; // km
  duration: number; // minutes
  hasTraffic: boolean;
  hasAccidentHistory: boolean;
  safetyScore: number; // 0-100
  warnings: string[];
}

interface TrafficSafetyMapProps {
  height?: string;
  className?: string;
  isAuthenticated?: boolean;
  userId?: string;
}

const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 }; // Dhaka
const DEFAULT_RADIUS = 10; // km
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "CRITICAL":
      return { bg: "#dc2626", border: "#991b1b" }; // Red
    case "HIGH":
      return { bg: "#ea580c", border: "#c2410c" }; // Orange
    case "MEDIUM":
      return { bg: "#eab308", border: "#a16207" }; // Yellow
    default:
      return { bg: "#84cc16", border: "#65a30d" }; // Green
  }
};

export default function TrafficSafetyMap({
  height = "600px",
  className = "",
  isAuthenticated = false,
  userId,
}: TrafficSafetyMapProps) {
  // State
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destinationSearch, setDestinationSearch] = useState("");
  const [trafficJams, setTrafficJams] = useState<TrafficJam[]>([]);
  const [accidentHotspots, setAccidentHotspots] = useState<AccidentHotspot[]>(
    []
  );
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [searchingDestination, setSearchingDestination] = useState(false);
  const [radius] = useState(DEFAULT_RADIUS);

  // Get user's current location
  const handleGetUserLocation = useCallback(() => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          toast.success("Location detected!");
          // Fetch nearby traffic and accident data
          fetchTrafficData(location);
          setGettingLocation(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error(
            "Could not get your location. Please enable location services."
          );
          setGettingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error("Geolocation not supported by your browser");
      setGettingLocation(false);
    }
  }, []);

  // Fetch traffic data (mock - replace with real API)
  const fetchTrafficData = async (location: { lat: number; lng: number }) => {
    setLoading(true);
    try {
      // Mock traffic jams data
      // In production, call your backend API: GET /api/traffic/nearby
      const mockTrafficJams: TrafficJam[] = [
        {
          id: "jam-1",
          location: { lat: location.lat + 0.02, lng: location.lng + 0.01 },
          roadName: "Mirpur Road",
          severity: "HIGH",
          delayMinutes: 25,
          distance: calculateDistance(
            location.lat,
            location.lng,
            location.lat + 0.02,
            location.lng + 0.01
          ),
          affectedLength: 3.2,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "jam-2",
          location: { lat: location.lat - 0.03, lng: location.lng + 0.02 },
          roadName: "Tejgaon Link Road",
          severity: "CRITICAL",
          delayMinutes: 45,
          distance: calculateDistance(
            location.lat,
            location.lng,
            location.lat - 0.03,
            location.lng + 0.02
          ),
          affectedLength: 5.5,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "jam-3",
          location: { lat: location.lat + 0.04, lng: location.lng - 0.02 },
          roadName: "Gulshan Avenue",
          severity: "MEDIUM",
          delayMinutes: 15,
          distance: calculateDistance(
            location.lat,
            location.lng,
            location.lat + 0.04,
            location.lng - 0.02
          ),
          affectedLength: 2.1,
          lastUpdated: new Date().toISOString(),
        },
      ];

      // Mock accident hotspots
      // In production: GET /api/accidents/hotspots
      const mockHotspots: AccidentHotspot[] = [
        {
          id: "hotspot-1",
          location: { lat: location.lat + 0.015, lng: location.lng + 0.015 },
          roadName: "Airport Road",
          accidentCount: 47,
          severityLevel: "CRITICAL",
          timeRange: "Last 6 months",
          commonCauses: ["Over-speeding", "Poor lighting", "Sharp curves"],
        },
        {
          id: "hotspot-2",
          location: { lat: location.lat - 0.025, lng: location.lng - 0.01 },
          roadName: "Mohakhali Flyover",
          accidentCount: 32,
          severityLevel: "HIGH",
          timeRange: "Last 6 months",
          commonCauses: ["Lane changing", "Over-speeding"],
        },
      ];

      setTrafficJams(mockTrafficJams);
      setAccidentHotspots(mockHotspots);
    } catch (error) {
      console.error("Error fetching traffic data:", error);
      toast.error("Failed to fetch traffic information");
    } finally {
      setLoading(false);
    }
  };

  // Search for destination
  const handleSearchDestination = async () => {
    if (!destinationSearch.trim()) {
      toast.error("Please enter a destination");
      return;
    }

    setSearchingDestination(true);
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        address: destinationSearch,
        componentRestrictions: { country: "BD" },
      });

      if (response.results[0]) {
        const location = response.results[0].geometry.location;
        const dest = { lat: location.lat(), lng: location.lng() };
        setDestination(dest);
        toast.success("Destination set!");

        // Calculate routes if user location is available
        if (userLocation) {
          calculateRoutes(userLocation, dest);
        }
      } else {
        toast.error("Destination not found");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Failed to find destination");
    } finally {
      setSearchingDestination(false);
    }
  };

  // Calculate route options
  const calculateRoutes = async (
    origin: { lat: number; lng: number },
    dest: { lat: number; lng: number }
  ) => {
    setLoading(true);
    try {
      // Mock route calculations
      // In production: POST /api/routes/calculate with traffic and accident data
      const mockRoutes: RouteOption[] = [
        {
          id: "route-1",
          name: "Fastest Route (via Gulshan)",
          distance: 12.5,
          duration: 25,
          hasTraffic: false,
          hasAccidentHistory: false,
          safetyScore: 95,
          warnings: [],
        },
        {
          id: "route-2",
          name: "Shortest Route (via Mirpur)",
          distance: 10.2,
          duration: 35,
          hasTraffic: true,
          hasAccidentHistory: false,
          safetyScore: 70,
          warnings: ["High traffic on Mirpur Road - 25 min delay"],
        },
        {
          id: "route-3",
          name: "Alternative Route (via Airport Road)",
          distance: 14.8,
          duration: 32,
          hasTraffic: false,
          hasAccidentHistory: true,
          safetyScore: 60,
          warnings: [
            "⚠️ High accident area - 47 accidents in last 6 months",
            "Caution: Poor lighting and sharp curves",
          ],
        },
      ];

      setRouteOptions(mockRoutes);
      setSelectedRoute(mockRoutes[0]); // Auto-select safest/fastest
    } catch (error) {
      console.error("Route calculation error:", error);
      toast.error("Failed to calculate routes");
    } finally {
      setLoading(false);
    }
  };

  // Clear destination and routes
  const handleClearDestination = () => {
    setDestination(null);
    setDestinationSearch("");
    setRouteOptions([]);
    setSelectedRoute(null);
  };

  // Auto-fetch location on mount
  useEffect(() => {
    handleGetUserLocation();
  }, [handleGetUserLocation]);

  // Map center calculation
  const mapCenter = useMemo(() => {
    if (destination) {
      // Center between user and destination
      if (userLocation) {
        return {
          lat: (userLocation.lat + destination.lat) / 2,
          lng: (userLocation.lng + destination.lng) / 2,
        };
      }
      return destination;
    }
    return userLocation || DEFAULT_CENTER;
  }, [userLocation, destination]);

  if (!API_KEY) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="font-semibold">Google Maps API Key Missing</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment
            variables
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Live Traffic & Safety Monitor
            <Badge variant="secondary" className="ml-auto">
              Public Access
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Location */}
          <div className="flex gap-2">
            <Button
              onClick={handleGetUserLocation}
              disabled={gettingLocation}
              variant="outline"
              className="flex-1"
            >
              {gettingLocation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Location...
                </>
              ) : userLocation ? (
                <>
                  <Navigation className="mr-2 h-4 w-4 text-green-600" />
                  Location Set (
                  {formatCoordinates(userLocation.lat, userLocation.lng)})
                </>
              ) : (
                <>
                  <Navigation className="mr-2 h-4 w-4" />
                  Get My Location
                </>
              )}
            </Button>
          </div>

          {/* Destination Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search destination (e.g., Uttara, Dhanmondi)"
                value={destinationSearch}
                onChange={(e) => setDestinationSearch(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSearchDestination()
                }
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleSearchDestination}
              disabled={searchingDestination || !userLocation}
            >
              {searchingDestination ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RouteIcon className="h-4 w-4" />
              )}
            </Button>
            {destination && (
              <Button onClick={handleClearDestination} variant="outline">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Stats */}
          {userLocation && (
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="p-2 rounded bg-red-50 dark:bg-red-950">
                <p className="text-red-600 font-semibold">
                  {trafficJams.length}
                </p>
                <p className="text-xs text-red-700">Traffic Jams</p>
              </div>
              <div className="p-2 rounded bg-orange-50 dark:bg-orange-950">
                <p className="text-orange-600 font-semibold">
                  {accidentHotspots.length}
                </p>
                <p className="text-xs text-orange-700">Accident Zones</p>
              </div>
              <div className="p-2 rounded bg-blue-50 dark:bg-blue-950">
                <p className="text-blue-600 font-semibold">{radius} km</p>
                <p className="text-xs text-blue-700">Search Radius</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map */}
      <Card className="overflow-hidden">
        <APIProvider apiKey={API_KEY}>
          <Map
            style={{ width: "100%", height }}
            defaultCenter={DEFAULT_CENTER}
            center={mapCenter}
            defaultZoom={12}
            zoom={destination ? 11 : 13}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapId="nirapoth-traffic-map"
          >
            {/* User Location Marker */}
            {userLocation && (
              <AdvancedMarker position={userLocation}>
                <Pin
                  background="#2563eb"
                  borderColor="#1e40af"
                  glyphColor="#fff"
                  scale={1.5}
                />
              </AdvancedMarker>
            )}

            {/* Destination Marker */}
            {destination && (
              <AdvancedMarker position={destination}>
                <Pin
                  background="#16a34a"
                  borderColor="#15803d"
                  glyphColor="#fff"
                  scale={1.5}
                />
              </AdvancedMarker>
            )}

            {/* Traffic Jam Markers */}
            {trafficJams.map((jam) => {
              const colors = getSeverityColor(jam.severity);
              return (
                <React.Fragment key={jam.id}>
                  <AdvancedMarker
                    position={jam.location}
                    onClick={() => setSelectedMarker(jam.id)}
                  >
                    <Pin
                      background={colors.bg}
                      borderColor={colors.border}
                      glyphColor="#fff"
                      scale={1.3}
                    />
                  </AdvancedMarker>
                  {selectedMarker === jam.id && (
                    <InfoWindow
                      position={jam.location}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-semibold text-sm mb-1 flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          {jam.roadName}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="mb-2"
                          style={{
                            backgroundColor: colors.bg,
                            color: "white",
                          }}
                        >
                          {jam.severity} TRAFFIC
                        </Badge>
                        <p className="text-xs space-y-1">
                          <span className="block">
                            ⏱️ Delay: ~{jam.delayMinutes} minutes
                          </span>
                          <span className="block">
                            📏 Distance: {jam.distance.toFixed(1)} km away
                          </span>
                          <span className="block">
                            🚗 Affected: {jam.affectedLength} km stretch
                          </span>
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </React.Fragment>
              );
            })}

            {/* Accident Hotspot Markers */}
            {accidentHotspots.map((hotspot) => (
              <React.Fragment key={hotspot.id}>
                <AdvancedMarker
                  position={hotspot.location}
                  onClick={() => setSelectedMarker(hotspot.id)}
                >
                  <div className="bg-yellow-500 border-2 border-yellow-700 rounded-full p-2">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                </AdvancedMarker>
                {selectedMarker === hotspot.id && (
                  <InfoWindow
                    position={hotspot.location}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-2 min-w-[250px]">
                      <h3 className="font-semibold text-sm mb-1 flex items-center gap-1 text-yellow-700">
                        <AlertTriangle className="h-4 w-4" />
                        ACCIDENT HOTSPOT
                      </h3>
                      <p className="font-medium text-sm">{hotspot.roadName}</p>
                      <p className="text-xs mt-2 space-y-1">
                        <span className="block text-red-600 font-semibold">
                          ⚠️ {hotspot.accidentCount} accidents (
                          {hotspot.timeRange})
                        </span>
                        <span className="block font-medium mt-2">
                          Common causes:
                        </span>
                        {hotspot.commonCauses.map((cause, idx) => (
                          <span key={idx} className="block ml-2">
                            • {cause}
                          </span>
                        ))}
                        <span className="block mt-2 text-yellow-700 font-medium">
                          🚨 Drive with extra caution!
                        </span>
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            ))}
          </Map>
        </APIProvider>
      </Card>

      {/* Route Options */}
      {routeOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RouteIcon className="h-5 w-5" />
              Route Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {routeOptions.map((route) => (
              <div
                key={route.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRoute?.id === route.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedRoute(route)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{route.name}</h4>
                    <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                      <span>📏 {route.distance} km</span>
                      <span>⏱️ {route.duration} min</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      route.safetyScore >= 90
                        ? "default"
                        : route.safetyScore >= 70
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    Safety: {route.safetyScore}%
                  </Badge>
                </div>

                {route.warnings.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {route.warnings.map((warning, idx) => (
                      <p
                        key={idx}
                        className="text-xs flex items-start gap-1 text-yellow-700 dark:text-yellow-500"
                      >
                        <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        {warning}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Login Prompt for Enhanced Features */}
      {!isAuthenticated && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Want More Features?
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  Login to access: Real-time updates, Custom route preferences,
                  Report traffic/accidents, Save favorite routes
                </p>
                <Button size="sm" className="mt-3">
                  Login / Sign Up
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
