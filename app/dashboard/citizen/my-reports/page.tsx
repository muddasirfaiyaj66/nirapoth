"use client";

import { useEffect, useState, useMemo } from "react";
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
  FileText,
  Calendar,
  MapPin,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Map as MapIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchMyReports,
  fetchMyStats,
  setFilters,
  clearFilters,
  setPagination,
} from "@/lib/store/slices/citizenReportsSlice";
import { CitizenReport } from "@/lib/api/citizenReports";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import CitizenReportsMapView, {
  CitizenReportLocation,
} from "@/components/maps/CitizenReportsMapView";

const STATUS_COLORS = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
};

const STATUS_ICONS = {
  PENDING: Clock,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
};

export default function MyReportsPage() {
  const dispatch = useAppDispatch();
  const {
    reports = [],
    stats,
    loading,
    pagination,
    filters,
  } = useAppSelector((state) => state.citizenReports);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Load reports and stats on mount
  useEffect(() => {
    dispatch(fetchMyStats());
  }, [dispatch]);

  // Load reports when filters/pagination change
  useEffect(() => {
    if (pagination) {
      loadReports();
    }
  }, [filters, pagination?.page]);

  const loadReports = () => {
    if (!pagination) return;
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...filters,
    };
    dispatch(fetchMyReports(params));
  };

  const handleSearch = () => {
    dispatch(setFilters({ search: searchQuery }));
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    if (status === "all") {
      dispatch(setFilters({ status: undefined }));
    } else {
      dispatch(setFilters({ status }));
    }
  };

  const handleViewDetails = (report: CitizenReport) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    dispatch(clearFilters());
  };

  // Convert reports to map locations
  const mapLocations: CitizenReportLocation[] = useMemo(() => {
    return reports
      .filter(
        (report) => report.location?.latitude && report.location?.longitude
      )
      .map((report) => ({
        id: report.id,
        latitude: report.location.latitude,
        longitude: report.location.longitude,
        address: report.location.address,
        vehiclePlate: report.vehiclePlate,
        violationType: report.violationType,
        status: report.status,
        createdAt: report.createdAt,
      }));
  }, [reports]);

  const getStatusIcon = (status: string) => {
    const Icon = STATUS_ICONS[status as keyof typeof STATUS_ICONS] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 pt-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            My Reports
          </h1>
          <p className="text-muted-foreground">
            Track your submitted violation reports and earnings
          </p>
        </div>
        <Link href="/dashboard/citizen/report-violation">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card key="total-reports">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reports
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalReports || 0}
              </div>
            </CardContent>
          </Card>

          <Card key="pending-review">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingReports || 0}
              </div>
            </CardContent>
          </Card>

          <Card key="approved">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.approvedReports || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.approvalRate?.toFixed(1) || "0"}% approval rate
              </p>
            </CardContent>
          </Card>

          <Card key="total-earnings">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Net Earnings
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {(() => {
                const netEarnings =
                  (stats.totalRewardsEarned || 0) -
                  (stats.totalPenaltiesPaid || 0);
                const isNegative = netEarnings < 0;
                return (
                  <>
                    <div
                      className={`text-2xl font-bold ${
                        isNegative ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {formatCurrency(netEarnings)}
                    </div>
                    {stats.totalRewardsEarned > 0 &&
                      stats.totalPenaltiesPaid > 0 && (
                        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          <p className="text-green-600">
                            +{formatCurrency(stats.totalRewardsEarned)} rewards
                          </p>
                          <p className="text-red-600">
                            -{formatCurrency(stats.totalPenaltiesPaid)}{" "}
                            penalties
                          </p>
                        </div>
                      )}
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map View Toggle */}
      {reports.length > 0 && mapLocations.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant={showMap ? "default" : "outline"}
            onClick={() => setShowMap(!showMap)}
          >
            <MapIcon className="h-4 w-4 mr-2" />
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
        </div>
      )}

      {/* Map View */}
      {showMap && mapLocations.length > 0 && (
        <CitizenReportsMapView
          reports={mapLocations}
          title="My Reports Map"
          height="500px"
          showStats={true}
        />
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
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

            <Select value={selectedStatus} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || selectedStatus !== "all") && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
            <p className="text-muted-foreground mb-4">
              Start reporting traffic violations and earn rewards!
            </p>
            <Link href="/dashboard/citizen/report-violation">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit First Report
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const StatusIcon = STATUS_ICONS[report.status] || Clock;
            return (
              <Card
                key={report.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="outline" className="text-lg font-mono">
                          {report.vehiclePlate}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`${
                            STATUS_COLORS[report.status] || "bg-gray-500"
                          } text-white`}
                        >
                          {StatusIcon && (
                            <StatusIcon className="h-3 w-3 mr-1" />
                          )}
                          {report.status}
                        </Badge>
                        <Badge variant="outline">
                          {report.violationType?.replace("_", " ") || "N/A"}
                        </Badge>
                      </div>

                      {report.description && (
                        <p className="text-sm text-muted-foreground">
                          {report.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                        {report.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate max-w-[200px]">
                              {report.location.city || report.location.address}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Reward/Penalty Info */}
                      {report.status === "APPROVED" && report.rewardAmount && (
                        <div className="flex items-center gap-2 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-medium">
                            Earned: {formatCurrency(report.rewardAmount)}
                          </span>
                        </div>
                      )}

                      {report.status === "REJECTED" && report.penaltyAmount && (
                        <div className="flex items-center gap-2 text-red-600">
                          <TrendingDown className="h-4 w-4" />
                          <span className="font-medium">
                            Penalty: {formatCurrency(report.penaltyAmount)}
                          </span>
                        </div>
                      )}

                      {/* Appeal Status */}
                      {report.status === "REJECTED" &&
                        (report as any).appealSubmitted && (
                          <div
                            className={`p-3 rounded-lg ${
                              (report as any).appealStatus === "APPROVED"
                                ? "bg-green-50 dark:bg-green-950"
                                : (report as any).appealStatus === "REJECTED"
                                ? "bg-red-50 dark:bg-red-950"
                                : "bg-yellow-50 dark:bg-yellow-950"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className={
                                  (report as any).appealStatus === "APPROVED"
                                    ? "border-green-600 text-green-600"
                                    : (report as any).appealStatus ===
                                      "REJECTED"
                                    ? "border-red-600 text-red-600"
                                    : "border-yellow-600 text-yellow-600"
                                }
                              >
                                Appeal {(report as any).appealStatus}
                              </Badge>
                            </div>
                            {(report as any).appealStatus === "REJECTED" &&
                              (report as any).additionalPenaltyAmount && (
                                <p className="text-sm text-red-600 font-medium">
                                  Additional Penalty:{" "}
                                  {formatCurrency(
                                    (report as any).additionalPenaltyAmount
                                  )}
                                </p>
                              )}
                            {(report as any).appealNotes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {(report as any).appealNotes}
                              </p>
                            )}
                          </div>
                        )}

                      {report.reviewNotes && (
                        <div className="bg-accent p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">
                            Review Notes:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {report.reviewNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {/* Show Appeal Button for rejected reports that haven't been appealed */}
                      {report.status === "REJECTED" &&
                        !(report as any).appealSubmitted && (
                          <Link href="/dashboard/citizen/appeals">
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Appeal
                            </Button>
                          </Link>
                        )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(report)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
            <div className="flex items-center gap-1">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => dispatch(setPagination({ page }))}
                >
                  {page}
                </Button>
              ))}
            </div>
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

      {/* Report Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Complete information about this violation report
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
                          key={url || index}
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
                  <p className="font-mono font-semibold">
                    {selectedReport.vehiclePlate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Violation Type
                  </p>
                  <p className="font-medium">
                    {selectedReport.violationType?.replace("_", " ") || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={`${
                      STATUS_COLORS[selectedReport.status]
                    } text-white`}
                  >
                    {selectedReport.status}
                  </Badge>
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
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.location.address}
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

              {/* Review Info */}
              {selectedReport.reviewNotes && (
                <div className="p-4 bg-accent rounded-lg">
                  <h4 className="font-semibold mb-2">Police Review</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedReport.reviewNotes}
                  </p>
                  {selectedReport.reviewedAt && (
                    <p className="text-xs text-muted-foreground">
                      Reviewed on {formatDate(selectedReport.reviewedAt)}
                    </p>
                  )}
                </div>
              )}

              {/* Appeal Info */}
              {selectedReport.status === "REJECTED" &&
                (selectedReport as any).appealSubmitted && (
                  <div
                    className={`p-4 rounded-lg border ${
                      (selectedReport as any).appealStatus === "APPROVED"
                        ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                        : (selectedReport as any).appealStatus === "REJECTED"
                        ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                        : "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                    }`}
                  >
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      Appeal Status
                      <Badge
                        variant="outline"
                        className={
                          (selectedReport as any).appealStatus === "APPROVED"
                            ? "border-green-600 text-green-600"
                            : (selectedReport as any).appealStatus ===
                              "REJECTED"
                            ? "border-red-600 text-red-600"
                            : "border-yellow-600 text-yellow-600"
                        }
                      >
                        {(selectedReport as any).appealStatus}
                      </Badge>
                    </h4>

                    {(selectedReport as any).appealReason && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">
                          Your Appeal Reason:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedReport as any).appealReason}
                        </p>
                      </div>
                    )}

                    {(selectedReport as any).appealNotes && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">
                          Review Response:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedReport as any).appealNotes}
                        </p>
                      </div>
                    )}

                    {(selectedReport as any).appealStatus === "REJECTED" &&
                      (selectedReport as any).additionalPenaltyAmount && (
                        <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg mt-2">
                          <p className="text-sm font-medium text-red-600 dark:text-red-400">
                            Additional Penalty Applied:{" "}
                            {formatCurrency(
                              (selectedReport as any).additionalPenaltyAmount
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            1.5% additional penalty for unsuccessful appeal
                          </p>
                        </div>
                      )}

                    {(selectedReport as any).appealReviewedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Appeal reviewed on{" "}
                        {formatDate((selectedReport as any).appealReviewedAt)}
                      </p>
                    )}
                  </div>
                )}

              {/* Appeal Action Button */}
              {selectedReport.status === "REJECTED" &&
                !(selectedReport as any).appealSubmitted && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                          Disagree with this decision?
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                          You can submit an appeal with supporting evidence.
                          Appeals are reviewed by police within 7 days.
                        </p>
                        <Link href="/dashboard/citizen/appeals">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <FileText className="h-4 w-4 mr-2" />
                            Submit Appeal
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
