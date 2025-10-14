"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  User,
  Car,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";

interface Violation {
  id: string;
  violationType: string;
  description: string;
  fineAmount: number;
  status: "PENDING" | "CONFIRMED" | "DISPUTED" | "RESOLVED";
  detectionMethod: "AI_CAMERA" | "MANUAL" | "CITIZEN_REPORT";
  location: string;
  vehiclePlateNumber?: string;
  driverName?: string;
  evidenceImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ViolationsResponse {
  success: boolean;
  data: {
    violations: Violation[];
    total: number;
    page: number;
    limit: number;
  };
}

export default function PendingViolationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch pending violations
  const {
    data: violationsData,
    isLoading,
    error,
  } = useQuery<ViolationsResponse>({
    queryKey: ["admin-violations-pending", page, searchTerm, methodFilter],
    queryFn: async () => {
      return adminApi.getViolations({
        page,
        limit: 10,
        status: "PENDING",
        ...(searchTerm && { search: searchTerm }),
        ...(methodFilter !== "all" && { method: methodFilter }),
      });
    },
  });

  // Update violation status mutation
  const updateViolationMutation = useMutation({
    mutationFn: async ({
      violationId,
      status,
    }: {
      violationId: string;
      status: string;
    }) => {
      return adminApi.updateViolationStatus(violationId, status);
    },
    onSuccess: () => {
      toast.success("Violation status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-violations-pending"] });
    },
    onError: (error) => {
      toast.error("Failed to update violation status");
      console.error("Update violation error:", error);
    },
  });

  const handleUpdateStatus = (violationId: string, status: string) => {
    updateViolationMutation.mutate({ violationId, status });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "CONFIRMED":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "DISPUTED":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "RESOLVED":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "AI_CAMERA":
        return Camera;
      case "MANUAL":
        return Shield;
      case "CITIZEN_REPORT":
        return User;
      default:
        return Shield;
    }
  };

  const violations = violationsData?.data?.violations || [];
  const totalViolations = violationsData?.data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pending Violations
          </h1>
          <p className="text-muted-foreground">
            Review and approve pending traffic violations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="text-sm">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {totalViolations} Pending
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViolations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Detected</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                violations.filter((v) => v.detectionMethod === "AI_CAMERA")
                  .length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Manual Reports
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {violations.filter((v) => v.detectionMethod === "MANUAL").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳
              {violations
                .reduce((sum, v) => sum + v.fineAmount, 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search violations by plate number, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="AI_CAMERA">AI Camera</SelectItem>
                <SelectItem value="MANUAL">Manual</SelectItem>
                <SelectItem value="CITIZEN_REPORT">Citizen Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Violations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Violations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              Failed to load violations. Please try again.
            </div>
          ) : violations.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No pending violations found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Violation</TableHead>
                    <TableHead>Vehicle/Driver</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Fine Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violations.map((violation) => {
                    const MethodIcon = getMethodIcon(violation.detectionMethod);
                    return (
                      <TableRow key={violation.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {violation.violationType}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {violation.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {violation.vehiclePlateNumber && (
                              <div className="font-medium flex items-center gap-1">
                                <Car className="h-3 w-3" />
                                {violation.vehiclePlateNumber}
                              </div>
                            )}
                            {violation.driverName && (
                              <div className="text-sm text-muted-foreground">
                                {violation.driverName}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {violation.location}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MethodIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {violation.detectionMethod.replace("_", " ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ৳{violation.fineAmount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(
                                violation.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedViolation(violation);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(violation.id, "CONFIRMED")
                              }
                              disabled={updateViolationMutation.isPending}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(violation.id, "DISPUTED")
                              }
                              disabled={updateViolationMutation.isPending}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalViolations > 10 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * 10 + 1} to{" "}
            {Math.min(page * 10, totalViolations)} of {totalViolations}{" "}
            violations
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page * 10 >= totalViolations}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Violation Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Violation Details</DialogTitle>
            <DialogDescription>
              Review violation information and evidence
            </DialogDescription>
          </DialogHeader>
          {selectedViolation && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Violation Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>{" "}
                      {selectedViolation.violationType}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Description:
                      </span>{" "}
                      {selectedViolation.description}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Fine Amount:
                      </span>{" "}
                      ৳{selectedViolation.fineAmount.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>{" "}
                      {selectedViolation.location}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Detection Method:
                      </span>{" "}
                      {selectedViolation.detectionMethod.replace("_", " ")}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Status & Dates</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <Badge
                        variant="outline"
                        className={getStatusBadgeColor(
                          selectedViolation.status
                        )}
                      >
                        {selectedViolation.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>{" "}
                      {new Date(selectedViolation.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Last Updated:
                      </span>{" "}
                      {new Date(selectedViolation.updatedAt).toLocaleString()}
                    </div>
                    {selectedViolation.vehiclePlateNumber && (
                      <div>
                        <span className="text-muted-foreground">Vehicle:</span>{" "}
                        {selectedViolation.vehiclePlateNumber}
                      </div>
                    )}
                    {selectedViolation.driverName && (
                      <div>
                        <span className="text-muted-foreground">Driver:</span>{" "}
                        {selectedViolation.driverName}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Evidence Image */}
              {selectedViolation.evidenceImageUrl && (
                <div>
                  <h4 className="font-medium mb-3">Evidence</h4>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <img
                      src={selectedViolation.evidenceImageUrl}
                      alt="Violation Evidence"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleUpdateStatus(selectedViolation.id, "DISPUTED");
                    setIsViewDialogOpen(false);
                  }}
                  disabled={updateViolationMutation.isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Dispute
                </Button>
                <Button
                  onClick={() => {
                    handleUpdateStatus(selectedViolation.id, "CONFIRMED");
                    setIsViewDialogOpen(false);
                  }}
                  disabled={updateViolationMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Violation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
