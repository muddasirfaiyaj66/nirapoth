"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Gauge,
  MapPin,
  Calendar,
  Eye,
  AlertTriangle,
  TrendingUp,
  Search,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const SPEED_LIMITS = {
  HIGHWAY: 100,
  ARTERIAL: 80,
  URBAN: 50,
  RESIDENTIAL: 30,
  SCHOOL_ZONE: 20,
};

export default function SpeedMonitoringPage() {
  const [violations, setViolations] = useState<any[]>([]);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterZone, setFilterZone] = useState("all");

  useEffect(() => {
    loadViolations();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadViolations, 30000);
    return () => clearInterval(interval);
  }, [filterZone]);

  const loadViolations = () => {
    // This would be an API call
  };

  const handleViewDetails = (violation: any) => {
    setSelectedViolation(violation);
    setIsDetailsOpen(true);
  };

  const handleFileCase = async (violationId: string) => {
    try {
      toast.success("Case filed! Fine notice will be sent to vehicle owner.");
    } catch (error: any) {
      toast.error(error || "Failed to file case");
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSpeedColor = (speed: number, limit: number) => {
    const excess = speed - limit;
    if (excess < 10) return "text-yellow-600";
    if (excess < 20) return "text-orange-600";
    return "text-red-600";
  };

  const calculateFine = (speed: number, limit: number) => {
    const excess = speed - limit;
    if (excess < 10) return 1000;
    if (excess < 20) return 2000;
    if (excess < 30) return 5000;
    return 10000;
  };

  const todayCount = violations.filter((v) => v.detectedToday).length;
  const totalFines = violations.reduce(
    (sum, v) => sum + calculateFine(v.speed, v.speedLimit),
    0
  );
  const avgExcess = violations.length
    ? violations.reduce((sum, v) => sum + (v.speed - v.speedLimit), 0) /
      violations.length
    : 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Gauge className="h-8 w-8" />
          Speed Monitoring & Enforcement
        </h1>
        <p className="text-muted-foreground">
          Real-time speed violation detection and automated fine processing
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Violations
            </CardTitle>
            <Gauge className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{todayCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Detected by AI cameras
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalFines)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-filed cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Speed Excess
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {avgExcess.toFixed(1)} km/h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Over speed limit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by vehicle plate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Select value={filterZone} onValueChange={setFilterZone}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="HIGHWAY">Highway</SelectItem>
                <SelectItem value="URBAN">Urban</SelectItem>
                <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                <SelectItem value="SCHOOL_ZONE">School Zone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Violations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Speed Violations</CardTitle>
            <Button variant="outline" size="sm" onClick={loadViolations}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {violations.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold mb-2">
                No violations detected
              </h3>
              <p className="text-muted-foreground">
                All vehicles are within speed limits!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {violations.map((violation) => {
                const fine = calculateFine(
                  violation.speed,
                  violation.speedLimit
                );
                return (
                  <div
                    key={violation.id}
                    className="flex items-center justify-between p-4 bg-accent rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-lg font-mono">
                          {violation.vehiclePlate}
                        </Badge>
                        <Badge variant="secondary">{violation.zone}</Badge>
                        <span
                          className={`text-2xl font-bold ${getSpeedColor(
                            violation.speed,
                            violation.speedLimit
                          )}`}
                        >
                          {violation.speed} km/h
                        </span>
                        <span className="text-sm text-muted-foreground">
                          (Limit: {violation.speedLimit} km/h)
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(violation.detectedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[300px]">
                            {violation.location.address}
                          </span>
                        </div>
                        <span className="text-xs">
                          Camera: {violation.cameraId}
                        </span>
                      </div>

                      <div className="mt-2">
                        <span className="text-sm font-semibold text-red-600">
                          Fine: {formatCurrency(fine)}
                        </span>
                        {violation.excess > 30 && (
                          <Badge variant="destructive" className="ml-2">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Severe
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(violation)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {!violation.caseFiled && (
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleFileCase(violation.id)}
                        >
                          File Case
                        </Button>
                      )}
                      {violation.caseFiled && (
                        <Badge variant="default" className="bg-green-600">
                          Case Filed
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Speed Limits Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Speed Limits Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(SPEED_LIMITS).map(([zone, limit]) => (
              <div key={zone} className="p-3 bg-accent rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {zone.replace("_", " ")}
                </p>
                <p className="text-2xl font-bold">{limit} km/h</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Speed Violation Details</DialogTitle>
            <DialogDescription>
              Complete information about detected violation
            </DialogDescription>
          </DialogHeader>

          {selectedViolation && (
            <div className="space-y-4">
              {/* Snapshot */}
              {selectedViolation.snapshotUrl && (
                <div>
                  <h4 className="font-semibold mb-3">Speed Camera Capture</h4>
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={selectedViolation.snapshotUrl}
                      alt="Speed violation"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Plate</p>
                  <p className="font-mono font-semibold text-lg">
                    {selectedViolation.vehiclePlate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zone Type</p>
                  <p className="font-medium">{selectedViolation.zone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Recorded Speed
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {selectedViolation.speed} km/h
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Speed Limit</p>
                  <p className="text-2xl font-bold">
                    {selectedViolation.speedLimit} km/h
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Excess Speed</p>
                  <p className="text-xl font-bold text-orange-600">
                    +{selectedViolation.speed - selectedViolation.speedLimit}{" "}
                    km/h
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fine Amount</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(
                      calculateFine(
                        selectedViolation.speed,
                        selectedViolation.speedLimit
                      )
                    )}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="font-semibold mb-2">Location</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedViolation.location.address}
                </p>
                <p className="text-xs text-muted-foreground">
                  Camera ID: {selectedViolation.cameraId}
                </p>
              </div>

              {/* Detection Info */}
              <div>
                <h4 className="font-semibold mb-2">Detection Information</h4>
                <div className="text-sm text-muted-foreground p-3 bg-accent rounded-lg">
                  <p>Detected: {formatDate(selectedViolation.detectedAt)}</p>
                  <p>Camera: {selectedViolation.cameraId}</p>
                  <p>
                    Status:{" "}
                    {selectedViolation.caseFiled ? "Case Filed" : "Pending"}
                  </p>
                </div>
              </div>

              {!selectedViolation.caseFiled && (
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => handleFileCase(selectedViolation.id)}
                  >
                    File Case & Send Fine Notice
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
