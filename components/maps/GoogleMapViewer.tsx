"use client";

import React from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useState } from "react";

export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  description?: string;
  type?: "violation" | "report" | "incident" | "default";
}

interface GoogleMapViewerProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  className?: string;
  onMarkerClick?: (marker: MapMarker) => void;
}

const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 }; // Dhaka, Bangladesh
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Get pin color based on marker type
const getPinColor = (type?: string) => {
  switch (type) {
    case "violation":
      return { background: "#dc2626", border: "#991b1b" }; // Red
    case "report":
      return { background: "#2563eb", border: "#1e40af" }; // Blue
    case "incident":
      return { background: "#ea580c", border: "#c2410c" }; // Orange
    default:
      return { background: "#059669", border: "#047857" }; // Green
  }
};

export default function GoogleMapViewer({
  markers,
  center,
  zoom = 12,
  height = "400px",
  className = "",
  onMarkerClick,
}: GoogleMapViewerProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  // Calculate center from markers if not provided
  const mapCenter =
    center ||
    (markers.length > 0
      ? {
          lat:
            markers.reduce((sum, m) => sum + m.position.lat, 0) /
            markers.length,
          lng:
            markers.reduce((sum, m) => sum + m.position.lng, 0) /
            markers.length,
        }
      : DEFAULT_CENTER);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarkerId(marker.id);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarkerId(null);
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

  if (markers.length === 0) {
    return (
      <Card className="p-6" style={{ height }}>
        <div className="flex items-center justify-center h-full text-center text-muted-foreground">
          <div>
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="font-semibold">No Locations to Display</p>
            <p className="text-sm mt-1">
              There are no locations available on the map
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <APIProvider apiKey={API_KEY}>
        <Map
          style={{ width: "100%", height }}
          defaultCenter={DEFAULT_CENTER}
          center={mapCenter}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId="nirapoth-map-viewer"
        >
          {markers.map((marker) => {
            const colors = getPinColor(marker.type);
            const isSelected = selectedMarkerId === marker.id;

            return (
              <React.Fragment key={marker.id}>
                <AdvancedMarker
                  position={marker.position}
                  onClick={() => handleMarkerClick(marker)}
                >
                  <Pin
                    background={colors.background}
                    borderColor={colors.border}
                    glyphColor="#fff"
                    scale={isSelected ? 1.5 : 1.2}
                  />
                </AdvancedMarker>

                {isSelected && (
                  <InfoWindow
                    position={marker.position}
                    onCloseClick={handleCloseInfoWindow}
                  >
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-semibold text-sm mb-1">
                        {marker.title}
                      </h3>
                      {marker.description && (
                        <p className="text-xs text-gray-600">
                          {marker.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {marker.position.lat.toFixed(6)},{" "}
                        {marker.position.lng.toFixed(6)}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            );
          })}
        </Map>
      </APIProvider>
    </Card>
  );
}
