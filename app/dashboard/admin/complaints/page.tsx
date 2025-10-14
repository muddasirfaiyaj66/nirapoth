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
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { complaintApi } from "@/lib/api/complaints";

interface Complaint {
  id: string;
  type: "TRAFFIC" | "INFRASTRUCTURE";
  title: string;
  description?: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  location?: string;
  reporterName?: string;
  reporterEmail?: string;
  createdAt: string;
  updatedAt: string;
}

interface ComplaintsResponse {
  success: boolean;
  data: {
    complaints: Complaint[];
    total: number;
    page: number;
    limit: number;
  };
}

export default function AdminComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch complaints
  const {
    data: complaintsData,
    isLoading,
    error,
  } = useQuery<ComplaintsResponse>({
    queryKey: [
      "admin-complaints",
      page,
      searchTerm,
      statusFilter,
      typeFilter,
      priorityFilter,
    ],
    queryFn: async () => {
      return complaintApi.getAllComplaints({
        page,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(typeFilter !== "all" && { type: typeFilter }),
        ...(priorityFilter !== "all" && { priority: priorityFilter }),
      });
    },
  });

  // Update complaint status mutation
  const updateComplaintMutation = useMutation({
    mutationFn: async ({
      complaintId,
      status,
    }: {
      complaintId: string;
      status: string;
    }) => {
      return complaintApi.updateComplaintStatus(complaintId, { status });
    },
    onSuccess: () => {
      toast.success("Complaint status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-complaints"] });
    },
    onError: (error) => {
      toast.error("Failed to update complaint status");
      console.error("Update complaint error:", error);
    },
  });

  const handleUpdateStatus = (complaintId: string, status: string) => {
    updateComplaintMutation.mutate({ complaintId, status });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "RESOLVED":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "CLOSED":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "LOW":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "TRAFFIC":
        return AlertTriangle;
      case "INFRASTRUCTURE":
        return FileText;
      default:
        return FileText;
    }
  };

  const complaints = complaintsData?.data?.complaints || [];
  const totalComplaints = complaintsData?.data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Complaint Management
          </h1>
          <p className="text-muted-foreground">
            Review and manage citizen complaints
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Complaints
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComplaints}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complaints.filter((c) => c.status === "PENDING").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complaints.filter((c) => c.status === "IN_PROGRESS").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complaints.filter((c) => c.status === "RESOLVED").length}
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
                  placeholder="Search complaints by title, description, or reporter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="TRAFFIC">Traffic</SelectItem>
                <SelectItem value="INFRASTRUCTURE">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              Failed to load complaints. Please try again.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((complaint) => {
                    const TypeIcon = getTypeIcon(complaint.type);
                    return (
                      <TableRow key={complaint.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{complaint.title}</div>
                            <div className="text-sm text-muted-foreground max-w-xs truncate">
                              {complaint.description || "No description"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{complaint.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getPriorityBadgeColor(
                              complaint.priority || "LOW"
                            )}
                          >
                            {complaint.priority || "LOW"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            {complaint.reporterName && (
                              <div className="font-medium flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {complaint.reporterName}
                              </div>
                            )}
                            {complaint.reporterEmail && (
                              <div className="text-sm text-muted-foreground">
                                {complaint.reporterEmail}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {complaint.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {complaint.location}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusBadgeColor(complaint.status)}
                          >
                            {complaint.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(
                                complaint.createdAt
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
                                setSelectedComplaint(complaint);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {complaint.status === "PENDING" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      complaint.id,
                                      "IN_PROGRESS"
                                    )
                                  }
                                  disabled={updateComplaintMutation.isPending}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStatus(complaint.id, "RESOLVED")
                                  }
                                  disabled={updateComplaintMutation.isPending}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {complaint.status === "IN_PROGRESS" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleUpdateStatus(complaint.id, "RESOLVED")
                                }
                                disabled={updateComplaintMutation.isPending}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
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
      {totalComplaints > 10 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * 10 + 1} to{" "}
            {Math.min(page * 10, totalComplaints)} of {totalComplaints}{" "}
            complaints
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
              disabled={page * 10 >= totalComplaints}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Complaint Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>
              Review complaint information and take action
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Complaint Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Title:</span>{" "}
                      {selectedComplaint.title}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>{" "}
                      {selectedComplaint.type}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Priority:</span>{" "}
                      <Badge
                        variant="outline"
                        className={getPriorityBadgeColor(
                          selectedComplaint.priority || "LOW"
                        )}
                      >
                        {selectedComplaint.priority || "LOW"}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <Badge
                        variant="outline"
                        className={getStatusBadgeColor(
                          selectedComplaint.status
                        )}
                      >
                        {selectedComplaint.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Reporter & Location</h4>
                  <div className="space-y-2 text-sm">
                    {selectedComplaint.reporterName && (
                      <div>
                        <span className="text-muted-foreground">Reporter:</span>{" "}
                        {selectedComplaint.reporterName}
                      </div>
                    )}
                    {selectedComplaint.reporterEmail && (
                      <div>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {selectedComplaint.reporterEmail}
                      </div>
                    )}
                    {selectedComplaint.location && (
                      <div>
                        <span className="text-muted-foreground">Location:</span>{" "}
                        {selectedComplaint.location}
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Created:</span>{" "}
                      {new Date(selectedComplaint.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Updated:</span>{" "}
                      {new Date(selectedComplaint.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedComplaint.description && (
                <div>
                  <h4 className="font-medium mb-3">Description</h4>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <p className="text-sm">{selectedComplaint.description}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedComplaint.status !== "CLOSED" && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  {selectedComplaint.status === "PENDING" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleUpdateStatus(
                            selectedComplaint.id,
                            "IN_PROGRESS"
                          );
                          setIsViewDialogOpen(false);
                        }}
                        disabled={updateComplaintMutation.isPending}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Mark In Progress
                      </Button>
                      <Button
                        onClick={() => {
                          handleUpdateStatus(selectedComplaint.id, "RESOLVED");
                          setIsViewDialogOpen(false);
                        }}
                        disabled={updateComplaintMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Resolved
                      </Button>
                    </>
                  )}
                  {selectedComplaint.status === "IN_PROGRESS" && (
                    <Button
                      onClick={() => {
                        handleUpdateStatus(selectedComplaint.id, "RESOLVED");
                        setIsViewDialogOpen(false);
                      }}
                      disabled={updateComplaintMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Resolved
                    </Button>
                  )}
                  {selectedComplaint.status === "RESOLVED" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleUpdateStatus(selectedComplaint.id, "CLOSED");
                        setIsViewDialogOpen(false);
                      }}
                      disabled={updateComplaintMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Close Complaint
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
