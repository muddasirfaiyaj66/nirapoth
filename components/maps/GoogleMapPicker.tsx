"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search, Loader2, Navigation } from "lucide-react";
import { toast } from "sonner";

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  district: string;
  division: string;
}

interface GoogleMapPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
  height?: string;
  className?: string;
}

const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 }; // Dhaka, Bangladesh
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export default function GoogleMapPicker({
  onLocationSelect,
  initialLocation,
  height = "500px",
  className = "",
}: GoogleMapPickerProps) {
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  }>(
    initialLocation
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : DEFAULT_CENTER
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [addressInfo, setAddressInfo] = useState<LocationData | null>(
    initialLocation || null
  );

  // Reverse geocode to get address from coordinates
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng },
      });

      if (response.results[0]) {
        const result = response.results[0];
        const components = result.address_components;

        let city = "";
        let district = "";
        let division = "";

        components.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (
            component.types.includes("administrative_area_level_2") ||
            component.types.includes("administrative_area_level_3")
          ) {
            district = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            division = component.long_name;
          }
        });

        const locationData: LocationData = {
          latitude: lat,
          longitude: lng,
          address: result.formatted_address,
          city: city || district || "",
          district: district || city || "",
          division: division || "Dhaka",
        };

        setAddressInfo(locationData);
        return locationData;
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      toast.error("Failed to get address information");
    }
    return null;
  }, []);

  // Handle map click to select location
  const handleMapClick = useCallback(
    async (e: any) => {
      if (e.detail?.latLng) {
        const lat = e.detail.latLng.lat;
        const lng = e.detail.latLng.lng;
        setSelectedPosition({ lat, lng });

        // Get address information
        const locationData = await reverseGeocode(lat, lng);
        if (locationData) {
          onLocationSelect(locationData);
        }
      }
    },
    [reverseGeocode, onLocationSelect]
  );

  // Search for location
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a location to search");
      return;
    }

    setIsSearching(true);
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        address: searchQuery,
        componentRestrictions: { country: "BD" }, // Restrict to Bangladesh
      });

      if (response.results[0]) {
        const location = response.results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        setSelectedPosition({ lat, lng });

        const locationData = await reverseGeocode(lat, lng);
        if (locationData) {
          onLocationSelect(locationData);
          toast.success("Location found!");
        }
      } else {
        toast.error("Location not found. Please try a different search.");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search location");
    } finally {
      setIsSearching(false);
    }
  };

  // Get current location using browser geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setSelectedPosition({ lat, lng });

        const locationData = await reverseGeocode(lat, lng);
        if (locationData) {
          onLocationSelect(locationData);
          toast.success("Current location detected!");
        }
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error(
          "Failed to get current location. Please enable location services."
        );
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle keyboard search (Enter key)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
      {/* Search Bar */}
      <Card className="p-4">
        <div className="space-y-3">
          <Label htmlFor="location-search">Search Location</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location-search"
                type="text"
                placeholder="Search for a location in Bangladesh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              variant="secondary"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
            <Button
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
              variant="outline"
            >
              {isGettingLocation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting
                </>
              ) : (
                <>
                  <Navigation className="mr-2 h-4 w-4" />
                  Current
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Click on the map to select a location, or use the search bar
          </p>
        </div>
      </Card>

      {/* Map Container */}
      <Card className="overflow-hidden">
        <APIProvider apiKey={API_KEY}>
          <Map
            style={{ width: "100%", height }}
            defaultCenter={DEFAULT_CENTER}
            center={selectedPosition}
            defaultZoom={13}
            gestureHandling="greedy"
            disableDefaultUI={false}
            onClick={handleMapClick}
            mapId="nirapoth-map-picker"
          >
            {selectedPosition && (
              <AdvancedMarker position={selectedPosition}>
                <Pin
                  background="#dc2626"
                  borderColor="#991b1b"
                  glyphColor="#fff"
                  scale={1.3}
                />
              </AdvancedMarker>
            )}
          </Map>
        </APIProvider>
      </Card>

      {/* Selected Location Info */}
      {addressInfo && (
        <Card className="p-4 bg-muted/50">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Selected Location</p>
                <p className="text-sm text-muted-foreground">
                  {addressInfo.address}
                </p>
                <div className="flex gap-2 mt-2 text-xs">
                  {addressInfo.city && (
                    <span className="bg-background px-2 py-1 rounded">
                      City: {addressInfo.city}
                    </span>
                  )}
                  {addressInfo.district && (
                    <span className="bg-background px-2 py-1 rounded">
                      District: {addressInfo.district}
                    </span>
                  )}
                  {addressInfo.division && (
                    <span className="bg-background px-2 py-1 rounded">
                      Division: {addressInfo.division}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Coordinates: {selectedPosition.lat.toFixed(6)},{" "}
                  {selectedPosition.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
