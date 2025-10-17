"use client";

import React, { useMemo } from "react";
import GoogleMapViewer, { MapMarker } from "./GoogleMapViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertCircle, CheckCircle, Clock } from "lucide-react";

export interface CitizenReportLocation {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  vehiclePlate?: string;
  violationType?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
}

interface CitizenReportsMapViewProps {
  reports: CitizenReportLocation[];
  title?: string;
  height?: string;
  className?: string;
  showStats?: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "APPROVED":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "REJECTED":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  }
};

export default function CitizenReportsMapView({
  reports,
  title = "My Reports Map",
  height = "500px",
  className = "",
  showStats = true,
}: CitizenReportsMapViewProps) {
  // Convert reports to map markers
  const markers: MapMarker[] = useMemo(() => {
    return reports.map((report) => ({
      id: report.id,
      position: {
        lat: report.latitude,
        lng: report.longitude,
      },
      title: `${report.vehiclePlate || "Unknown"} - ${report.status}`,
      description: `${report.violationType || "Violation"} at ${
        report.address || "Location"
      }`,
      type: "report" as const,
    }));
  }, [reports]);

  // Calculate statistics
  const stats = useMemo(() => {
    const statusCounts = reports.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: reports.length,
      pending: statusCounts.PENDING || 0,
      approved: statusCounts.APPROVED || 0,
      rejected: statusCounts.REJECTED || 0,
    };
  }, [reports]);

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
                {stats.total} Reports
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Map */}
          <GoogleMapViewer markers={markers} height={height} zoom={11} />

          {/* Status Statistics */}
          {showStats && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                    Pending
                  </span>
                </div>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {stats.pending}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-800 dark:text-green-200">
                    Approved
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {stats.approved}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-medium text-red-800 dark:text-red-200">
                    Rejected
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {stats.rejected}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
