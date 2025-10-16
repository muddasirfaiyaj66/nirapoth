"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Shield,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Search,
  Clock,
  TrendingUp,
  AlertTriangle,
  Eye,
  FileText,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchPendingReports,
  reviewReport,
  setFilters,
  clearFilters,
  setPagination,
} from "@/lib/store/slices/citizenReportsSlice";
import { CitizenReport } from "@/lib/api/citizenReports";
import { toast } from "sonner";
import Image from "next/image";

export default function PoliceReviewReportsPage() {
  const dispatch = useAppDispatch();
  const {
    reports = [],
    loading,
    pagination,
    filters,
  } = useAppSelector((state) => state.citizenReports);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"APPROVED" | "REJECTED">(
    "APPROVED"
  );
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats
  const [reviewStats, setReviewStats] = useState({
    pendingCount: 0,
    reviewedToday: 0,
    approvalRate: 0,
  });

  // Load pending reports on mount
  useEffect(() => {
    loadPendingReports();
    loadReviewStats();
  }, []);

  // Load reports when filters/pagination change
  useEffect(() => {
    if (pagination) {
      loadPendingReports();
    }
  }, [filters, pagination?.page]);

  const loadPendingReports = () => {
    if (!pagination) return;
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      status: "PENDING",
      ...filters,
    };
    dispatch(fetchPendingReports(params));
  };

  const loadReviewStats = async () => {
    // This would be an API call in production
    setReviewStats({
      pendingCount: reports.length,
      reviewedToday: 0,
      approvalRate: 85,
    });
  };

  const handleSearch = () => {
    dispatch(setFilters({ search: searchQuery }));
  };

  const handleViewDetails = (report: CitizenReport) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  const handleStartReview = (
    report: CitizenReport,
    action: "APPROVED" | "REJECTED"
  ) => {
    setSelectedReport(report);
    setReviewAction(action);
    setReviewNotes("");
    setIsDetailsOpen(false);
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedReport) return;

    if (!reviewNotes.trim()) {
      toast.error("Please provide review notes");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        reviewReport({
          reportId: selectedReport.id,
          data: {
            status: reviewAction,
            reviewNotes: reviewNotes.trim(),
          },
        })
      ).unwrap();

      const message =
        reviewAction === "APPROVED"
          ? "Report approved! Citizen will receive 5% reward."
          : "Report rejected. Citizen will receive 5% penalty.";

      toast.success(message, { duration: 5000 });
      setIsReviewDialogOpen(false);
      setSelectedReport(null);
      setReviewNotes("");

      // Refresh stats
      loadReviewStats();
    } catch (error: any) {
      toast.error(error || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Review Citizen Reports
        </h1>
        <p className="text-muted-foreground">
          Review and approve/reject violation reports submitted by citizens
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pagination?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Reports awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Reviewed Today
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reviewStats.reviewedToday}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cases processed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reviewStats.approvalRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall approval rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by vehicle plate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  dispatch(clearFilters());
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Reports List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">
              No pending reports to review at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="text-lg font-mono">
                        {report.vehiclePlate}
                      </Badge>
                      <Badge variant="secondary">
                        {report.violationType.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 dark:bg-yellow-950"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Pending Review
                      </Badge>
                    </div>

                    {/* Description */}
                    {report.description && (
                      <p className="text-sm text-muted-foreground">
                        {report.description}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(report.createdAt)}</span>
                      </div>
                      {report.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate max-w-[300px]">
                            {report.location.city || report.location.address}
                          </span>
                        </div>
                      )}
                      {report.citizen && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>
                            Reported by: {report.citizen.firstName}{" "}
                            {report.citizen.lastName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Evidence Preview */}
                    {report.evidenceUrl && report.evidenceUrl.length > 0 && (
                      <div className="flex gap-2">
                        {report.evidenceUrl.slice(0, 3).map((url, index) => (
                          <div
                            key={index}
                            className="relative w-20 h-20 rounded-lg overflow-hidden border"
                          >
                            <Image
                              src={url}
                              alt={`Evidence ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        {report.evidenceUrl.length > 3 && (
                          <div className="w-20 h-20 rounded-lg border flex items-center justify-center bg-accent">
                            <span className="text-sm font-medium">
                              +{report.evidenceUrl.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(report)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStartReview(report, "APPROVED")}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStartReview(report, "REJECTED")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {reports.length} of {pagination.total} reports
          </p>
          <div className="flex gap-2">
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
            <span className="flex items-center px-4 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                dispatch(setPagination({ page: pagination.page + 1 }))
              }
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Review complete information before making a decision
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              {/* Evidence Images/Videos */}
              {selectedReport.evidenceUrl &&
                selectedReport.evidenceUrl.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Evidence</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedReport.evidenceUrl.map((url, index) => (
                        <div
                          key={index}
                          className="relative aspect-video rounded-lg overflow-hidden border"
                        >
                          {url.includes("video") || url.includes(".mp4") ? (
                            <video
                              src={url}
                              controls
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={url}
                              alt={`Evidence ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Report Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Plate</p>
                  <p className="font-mono font-semibold text-lg">
                    {selectedReport.vehiclePlate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Violation Type
                  </p>
                  <p className="font-medium">
                    {selectedReport.violationType.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reported By</p>
                  <p className="font-medium">
                    {selectedReport.citizen?.firstName}{" "}
                    {selectedReport.citizen?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedReport.citizen?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">
                    {formatDate(selectedReport.createdAt)}
                  </p>
                </div>
              </div>

              {/* Location */}
              {selectedReport.location && (
                <div>
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedReport.location.address}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Coordinates: {selectedReport.location.latitude.toFixed(6)},{" "}
                    {selectedReport.location.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              {/* Description */}
              {selectedReport.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.description}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleStartReview(selectedReport, "APPROVED")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Report
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleStartReview(selectedReport, "REJECTED")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <AlertDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {reviewAction === "APPROVED" ? "Approve Report" : "Reject Report"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {reviewAction === "APPROVED"
                ? "This will file a case against the vehicle and reward the citizen with 5% of the fine amount."
                : "This will impose a 5% penalty on the citizen for submitting a false report."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reviewNotes">Review Notes *</Label>
              <Textarea
                id="reviewNotes"
                placeholder={
                  reviewAction === "APPROVED"
                    ? "Explain why this report is valid..."
                    : "Explain why this report is rejected..."
                }
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
                required
              />
            </div>

            {selectedReport && (
              <div className="p-3 bg-accent rounded-lg text-sm">
                <p className="font-medium mb-1">Report Summary:</p>
                <p className="text-muted-foreground">
                  Vehicle:{" "}
                  <span className="font-mono">
                    {selectedReport.vehiclePlate}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Violation: {selectedReport.violationType.replace("_", " ")}
                </p>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitReview}
              disabled={isSubmitting || !reviewNotes.trim()}
              className={
                reviewAction === "APPROVED"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {isSubmitting
                ? "Processing..."
                : `Confirm ${
                    reviewAction === "APPROVED" ? "Approval" : "Rejection"
                  }`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}
    </label>
  );
}
