"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Car,
  FileText,
  MoreHorizontal,
  RefreshCw,
  Download,
  MessageSquare,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchFines,
  updateFine,
  setFilters,
  clearFilters,
  setPagination,
} from "@/lib/store/slices/fineSlice";
import { toast } from "sonner";
import { Fine, UpdateFineData } from "@/lib/api/fines";

interface DisputeDetails {
  reason?: string;
  description?: string;
  evidence?: string[];
  submittedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  resolution?: string;
}

export default function AdminDisputesPage() {
  const dispatch = useAppDispatch();
  const {
    fines = [],
    loading,
    error,
    pagination,
    filters,
  } = useAppSelector((state) => state.fine);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("DISPUTED");
  const [selectedDispute, setSelectedDispute] = useState<Fine | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionAction, setResolutionAction] = useState<
    "APPROVE" | "REJECT" | null
  >(null);

  // Load disputes on component mount
  useEffect(() => {
    loadDisputes();
  }, []);

  // Load disputes when filters change
  useEffect(() => {
    if (pagination) {
      loadDisputes();
    }
  }, [filters, pagination?.page]);

  const loadDisputes = () => {
    if (!pagination) return;

    const params = {
      page: pagination.page,
      limit: pagination.limit,
      status: "DISPUTED",
      ...filters,
    };
    dispatch(fetchFines(params));
  };

  const handleSearch = () => {
    dispatch(
      setFilters({
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("DISPUTED");
    dispatch(clearFilters());
  };

  const handleViewDispute = (dispute: Fine) => {
    setSelectedDispute(dispute);
    setIsViewDialogOpen(true);
  };

  const handleResolveDispute = (
    dispute: Fine,
    action: "APPROVE" | "REJECT"
  ) => {
    setSelectedDispute(dispute);
    setResolutionAction(action);
    setResolutionNotes("");
    setIsResolveDialogOpen(true);
  };

  const handleSubmitResolution = async () => {
    if (!selectedDispute || !resolutionAction) return;

    try {
      const updateData: UpdateFineData = {
        status: resolutionAction === "APPROVE" ? "CANCELLED" : "UNPAID",
      };

      await dispatch(
        updateFine({ fineId: selectedDispute.id, data: updateData })
      ).unwrap();

      toast.success(
        resolutionAction === "APPROVE"
          ? "Dispute approved - Fine cancelled"
          : "Dispute rejected - Fine remains active"
      );

      setIsResolveDialogOpen(false);
      setSelectedDispute(null);
      setResolutionAction(null);
      setResolutionNotes("");
      loadDisputes();
    } catch (error: any) {
      toast.error(error || "Failed to resolve dispute");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISPUTED":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Disputed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="bg-gray-500/10 text-gray-600 border-gray-500/20"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case "UNPAID":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-600 border-red-500/20"
          >
            <Clock className="h-3 w-3 mr-1" />
            Unpaid
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const disputedFines = fines.filter((fine) => fine.status === "DISPUTED");
  const totalDisputedAmount = disputedFines.reduce(
    (sum, fine) => sum + fine.amount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dispute Management
          </h1>
          <p className="text-muted-foreground">
            Review and resolve disputed traffic fines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => loadDisputes()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Disputes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {disputedFines.length}
            </div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Disputed Amount
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalDisputedAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total value under dispute
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Resolution Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5 days</div>
            <p className="text-xs text-muted-foreground">
              Average processing time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">32%</div>
            <p className="text-xs text-muted-foreground">Disputes approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by vehicle, owner, or fine ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex-1">
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disputes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Disputes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fine ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Violation</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Disputed Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputedFines.map((fine) => (
                    <TableRow key={fine.id}>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {fine.id.slice(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        {fine.violation?.vehicle && (
                          <div className="flex items-center gap-1">
                            <Car className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {fine.violation.vehicle.plateNo}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {fine.violation.vehicle.brand}{" "}
                                {fine.violation.vehicle.model}
                              </div>
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {fine.violation?.vehicle?.owner && (
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {fine.violation.vehicle.owner.firstName}{" "}
                              {fine.violation.vehicle.owner.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {fine.violation.vehicle.owner.email}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {fine.violation?.rule?.title || "Unknown Rule"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {fine.violation?.rule?.description ||
                              "No description"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(fine.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(fine.updatedAt)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(fine.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewDispute(fine)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleResolveDispute(fine, "APPROVE")
                              }
                              className="text-green-600"
                            >
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Approve Dispute
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleResolveDispute(fine, "REJECT")
                              }
                              className="text-red-600"
                            >
                              <ThumbsDown className="h-4 w-4 mr-2" />
                              Reject Dispute
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {disputedFines.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No Active Disputes
                  </h3>
                  <p className="text-muted-foreground">
                    There are currently no disputed fines to review.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} disputes
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                dispatch(setPagination({ page: pagination.page - 1 }))
              }
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                dispatch(setPagination({ page: pagination.page + 1 }))
              }
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Dispute Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>
              Complete information about the disputed fine
            </DialogDescription>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-6">
              {/* Fine Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Fine Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Fine ID:</span>{" "}
                      {selectedDispute.id}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>{" "}
                      {formatCurrency(selectedDispute.amount)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      {getStatusBadge(selectedDispute.status)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Issued:</span>{" "}
                      {formatDate(selectedDispute.issuedAt)}
                    </div>
                    {selectedDispute.dueDate && (
                      <div>
                        <span className="text-muted-foreground">Due Date:</span>{" "}
                        {formatDate(selectedDispute.dueDate)}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Violation Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Rule:</span>{" "}
                      {selectedDispute.violation?.rule?.title || "Unknown"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Description:
                      </span>{" "}
                      {selectedDispute.violation?.rule?.description ||
                        "No description"}
                    </div>
                    {selectedDispute.violation?.vehicle && (
                      <>
                        <div>
                          <span className="text-muted-foreground">
                            Vehicle:
                          </span>{" "}
                          {selectedDispute.violation.vehicle.plateNo}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Model:</span>{" "}
                          {selectedDispute.violation.vehicle.brand}{" "}
                          {selectedDispute.violation.vehicle.model}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              {selectedDispute.violation?.vehicle?.owner && (
                <div>
                  <h4 className="font-medium mb-3">Owner Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      {selectedDispute.violation.vehicle.owner.firstName}{" "}
                      {selectedDispute.violation.vehicle.owner.lastName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      {selectedDispute.violation.vehicle.owner.email}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      {selectedDispute.violation.vehicle.owner.phone}
                    </div>
                  </div>
                </div>
              )}

              {/* Dispute Information */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Dispute Information
                </h4>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Reason:</strong> Owner disputes the validity of this
                    violation and requests a review.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Submitted:</strong>{" "}
                    {formatDate(selectedDispute.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleResolveDispute(selectedDispute, "REJECT");
                  }}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleResolveDispute(selectedDispute, "APPROVE");
                  }}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Dispute Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {resolutionAction === "APPROVE"
                ? "Approve Dispute"
                : "Reject Dispute"}
            </DialogTitle>
            <DialogDescription>
              {resolutionAction === "APPROVE"
                ? "This will cancel the fine and remove it from the user's record."
                : "This will reject the dispute and keep the fine active."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Resolution Notes (Optional)
              </label>
              <Textarea
                placeholder="Add any notes about this decision..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsResolveDialogOpen(false);
                  setResolutionAction(null);
                  setResolutionNotes("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitResolution}
                className={
                  resolutionAction === "APPROVE"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                Confirm{" "}
                {resolutionAction === "APPROVE" ? "Approval" : "Rejection"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
