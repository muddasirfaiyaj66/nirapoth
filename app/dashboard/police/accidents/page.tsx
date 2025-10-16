"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  MapPin,
  Calendar,
  Clock,
  Eye,
  Phone,
  Ambulance,
  FireExtinguisher,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchActiveAccidents,
  fetchAccidentStats,
  dispatchEmergencyService,
  markAccidentResolved,
  setSelectedAccident,
} from "@/lib/store/slices/accidentsSlice";
import { Accident } from "@/lib/api/accidents";

const SEVERITY_COLORS = {
  LOW: "bg-yellow-500",
  MEDIUM: "bg-orange-500",
  HIGH: "bg-red-500",
  CRITICAL: "bg-red-700",
};

export default function AccidentDetectionPage() {
  const dispatch = useAppDispatch();
  const { accidents, stats, selectedAccident, loading } = useAppSelector(
    (state) => state.accidents
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    // Load accidents and stats
    loadAccidents();
    loadStats();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadAccidents();
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadAccidents = () => {
    dispatch(fetchActiveAccidents());
  };

  const loadStats = () => {
    dispatch(fetchAccidentStats());
  };

  const handleViewDetails = (accident: Accident) => {
    dispatch(setSelectedAccident(accident));
    setIsDetailsOpen(true);
  };

  const handleDispatchAmbulance = async (accidentId: string) => {
    try {
      const result = await dispatch(
        dispatchEmergencyService({
          serviceType: "AMBULANCE",
          accidentId,
        })
      ).unwrap();
      toast.success(
        `Ambulance dispatched! ETA: ${result.estimatedArrival} minutes`
      );
      loadAccidents();
    } catch (error: any) {
      toast.error(error || "Failed to dispatch ambulance");
    }
  };

  const handleDispatchFireService = async (accidentId: string) => {
    try {
      const result = await dispatch(
        dispatchEmergencyService({
          serviceType: "FIRE_SERVICE",
          accidentId,
        })
      ).unwrap();
      toast.success(
        `Fire service dispatched! ETA: ${result.estimatedArrival} minutes`
      );
      loadAccidents();
    } catch (error: any) {
      toast.error(error || "Failed to dispatch fire service");
    }
  };

  const handleMarkResolved = async (accidentId: string) => {
    try {
      await dispatch(
        markAccidentResolved({ accidentId, notes: "Resolved by police" })
      ).unwrap();
      toast.success("Accident marked as resolved");
      setIsDetailsOpen(false);
      loadAccidents();
      loadStats();
    } catch (error: any) {
      toast.error(error || "Failed to update status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) / 1000
    );
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hours ago`;
  };

  const activeCount = accidents.filter((a) => a.status === "ACTIVE").length;
  const respondingCount = accidents.filter(
    (a) => a.status === "RESPONDING"
  ).length;
  const resolvedCount = stats?.resolvedToday || 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          Accident Detection & Response
        </h1>
        <p className="text-muted-foreground">
          Real-time AI-detected accidents and emergency response coordination
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Incidents
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Responding</CardTitle>
            <Ambulance className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {respondingCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Emergency services en route
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved Today
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {resolvedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully handled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accidents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Accidents</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAccidents}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && accidents.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : accidents.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold mb-2">
                No active accidents
              </h3>
              <p className="text-muted-foreground">
                All clear! System is monitoring for incidents.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {accidents.map((accident) => (
                <div
                  key={accident.id}
                  className={`p-4 rounded-lg border-2 ${
                    accident.status === "ACTIVE"
                      ? "border-red-500 bg-red-50 dark:bg-red-950"
                      : "bg-accent"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          className={`${
                            SEVERITY_COLORS[accident.severity]
                          } text-white`}
                        >
                          {accident.severity}
                        </Badge>
                        {accident.status === "ACTIVE" && (
                          <Badge
                            variant="destructive"
                            className="animate-pulse"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            ACTIVE
                          </Badge>
                        )}
                        {accident.hasFire && (
                          <Badge variant="destructive">
                            <FireExtinguisher className="h-3 w-3 mr-1" />
                            Fire Detected
                          </Badge>
                        )}
                      </div>

                      <p className="font-medium mb-2">{accident.description}</p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium text-red-600">
                            {formatTimeAgo(accident.detectedAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[300px]">
                            {accident.location.address}
                          </span>
                        </div>
                        {accident.cameraId && (
                          <span className="text-xs">
                            Camera: {accident.cameraId}
                          </span>
                        )}
                      </div>

                      {accident.status === "RESPONDING" && (
                        <div className="flex items-center gap-2 text-sm">
                          <Ambulance className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-600 font-medium">
                            Emergency services dispatched
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(accident)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {accident.status === "ACTIVE" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleDispatchAmbulance(accident.id)}
                          >
                            <Ambulance className="h-4 w-4 mr-2" />
                            Ambulance
                          </Button>
                          {accident.hasFire && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleDispatchFireService(accident.id)
                              }
                            >
                              <FireExtinguisher className="h-4 w-4 mr-2" />
                              Fire Service
                            </Button>
                          )}
                        </>
                      )}
                      {accident.status === "RESPONDING" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleMarkResolved(accident.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Accident Details</DialogTitle>
            <DialogDescription>
              Complete information about detected accident
            </DialogDescription>
          </DialogHeader>

          {selectedAccident && (
            <div className="space-y-4">
              {/* Snapshot */}
              {selectedAccident.snapshotUrl && (
                <div>
                  <h4 className="font-semibold mb-3">AI Detection Snapshot</h4>
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={selectedAccident.snapshotUrl}
                      alt="Accident snapshot"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <Badge
                    className={`${
                      SEVERITY_COLORS[selectedAccident.severity]
                    } text-white`}
                  >
                    {selectedAccident.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedAccident.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Detected At</p>
                  <p className="font-medium">
                    {formatDate(selectedAccident.detectedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Camera ID</p>
                  <p className="font-medium">{selectedAccident.cameraId}</p>
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="font-semibold mb-2">Location</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedAccident.location.address}
                </p>
                <p className="text-xs text-muted-foreground">
                  Coordinates: {selectedAccident.location.latitude.toFixed(6)},{" "}
                  {selectedAccident.location.longitude.toFixed(6)}
                </p>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground p-3 bg-accent rounded-lg">
                  {selectedAccident.description}
                </p>
              </div>

              {/* Emergency Actions */}
              {selectedAccident.status === "ACTIVE" && (
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleDispatchAmbulance(selectedAccident.id)}
                  >
                    <Ambulance className="h-4 w-4 mr-2" />
                    Dispatch Ambulance
                  </Button>
                  {selectedAccident.hasFire && (
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() =>
                        handleDispatchFireService(selectedAccident.id)
                      }
                    >
                      <FireExtinguisher className="h-4 w-4 mr-2" />
                      Dispatch Fire Service
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
