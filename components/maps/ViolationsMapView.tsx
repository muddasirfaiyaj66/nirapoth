"use client";

import React, { useMemo } from "react";
import GoogleMapViewer, { MapMarker } from "./GoogleMapViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp } from "lucide-react";

export interface ViolationLocation {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  district?: string;
  violationType?: string;
  vehiclePlate?: string;
  status?: string;
  createdAt?: string;
}

interface ViolationsMapViewProps {
  violations: ViolationLocation[];
  title?: string;
  height?: string;
  className?: string;
  showStats?: boolean;
}

export default function ViolationsMapView({
  violations,
  title = "Violations Map",
  height = "500px",
  className = "",
  showStats = true,
}: ViolationsMapViewProps) {
  // Convert violations to map markers
  const markers: MapMarker[] = useMemo(() => {
    return violations.map((violation) => ({
      id: violation.id,
      position: {
        lat: violation.latitude,
        lng: violation.longitude,
      },
      title: violation.vehiclePlate || "Unknown Vehicle",
      description: `${violation.violationType || "Violation"} - ${
        violation.address || "Location"
      }`,
      type: "violation" as const,
    }));
  }, [violations]);

  // Calculate statistics
  const stats = useMemo(() => {
    const locationGroups = violations.reduce((acc, v) => {
      const key = v.city || v.district || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topLocations = Object.entries(locationGroups)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      total: violations.length,
      topLocations,
    };
  }, [violations]);

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {title}
            </CardTitle>
            {showStats && (
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {stats.total} Violations
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Map */}
          <GoogleMapViewer markers={markers} height={height} zoom={11} />

          {/* Top Locations */}
          {showStats && stats.topLocations.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">
                  Top Violation Locations
                </h3>
              </div>
              <div className="space-y-2">
                {stats.topLocations.map(([location, count], index) => (
                  <div
                    key={location}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium">{location}</span>
                    </div>
                    <Badge variant="outline">{count} violations</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
