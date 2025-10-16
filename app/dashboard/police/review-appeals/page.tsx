"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { citizenReportApi, CitizenReport } from "@/lib/api/citizenReports";

export default function PoliceAppealsReviewPage() {
  const [appeals, setAppeals] = useState<CitizenReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppeal, setSelectedAppeal] = useState<CitizenReport | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"APPROVED" | "REJECTED">(
    "APPROVED"
  );
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch pending appeals
  useEffect(() => {
    fetchAppeals();
  }, []);

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const response = await citizenReportApi.getPendingAppeals({
        page: 1,
        limit: 100,
      });
      setAppeals(response.reports);
    } catch (error: any) {
      console.error("Error fetching appeals:", error);
      toast.error("Failed to load appeals");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (appeal: CitizenReport) => {
    setSelectedAppeal(appeal);
    setIsDetailsOpen(true);
  };

  const handleStartReview = (
    appeal: CitizenReport,
    action: "APPROVED" | "REJECTED"
  ) => {
    setSelectedAppeal(appeal);
    setReviewAction(action);
    setReviewNotes("");
    setIsDetailsOpen(false);
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedAppeal) {
      toast.error("No appeal selected");
      return;
    }

    if (!reviewNotes.trim()) {
      toast.error("Please provide review notes");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting review...");

    try {
      await citizenReportApi.reviewAppeal(selectedAppeal.id, {
        action: reviewAction,
        reviewNotes: reviewNotes.trim(),
      });

      toast.dismiss(loadingToast);
      const message =
        reviewAction === "APPROVED"
          ? "Appeal approved! Penalty has been waived."
          : "Appeal rejected. Additional penalty has been applied.";
      toast.success(message);

      setIsReviewDialogOpen(false);
      setReviewNotes("");
      setSelectedAppeal(null);

      // Refresh appeals list
      fetchAppeals();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit review"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Review Appeals
        </h1>
        <p className="text-muted-foreground">
          Review and process fine appeals submitted by citizens
        </p>
      </div>

      {/* Stats */}
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
              {appeals.filter((a) => a.status === "PENDING").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {appeals.filter((a) => a.status === "APPROVED").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {appeals.filter((a) => a.status === "REJECTED").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appeals List */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Appeals</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : appeals.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                No pending appeals to review at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appeals.map((appeal) => (
                <div
                  key={appeal.id}
                  className="flex items-start justify-between p-4 bg-accent rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono">
                        {appeal.vehiclePlate}
                      </Badge>
                      <Badge variant="secondary">
                        {appeal.violationType.replace("_", " ")}
                      </Badge>
                      {appeal.penaltyAmount && (
                        <span className="font-semibold text-red-600">
                          Penalty: {formatCurrency(appeal.penaltyAmount)}
                        </span>
                      )}
                    </div>
                    {appeal.appealReason && (
                      <p className="text-sm mb-2 italic">
                        <strong>Appeal Reason:</strong> {appeal.appealReason}
                      </p>
                    )}
                    {appeal.reviewNotes && (
                      <p className="text-sm mb-2 text-muted-foreground">
                        <strong>Original Rejection:</strong>{" "}
                        {appeal.reviewNotes}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Submitted: {formatDate(appeal.createdAt)}</span>
                      </div>
                      {appeal.citizen && (
                        <span>
                          by {appeal.citizen.firstName}{" "}
                          {appeal.citizen.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(appeal)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStartReview(appeal, "APPROVED")}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStartReview(appeal, "REJECTED")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
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
            <DialogTitle>Appeal Details</DialogTitle>
            <DialogDescription>
              Review complete information before making a decision
            </DialogDescription>
          </DialogHeader>

          {selectedAppeal && (
            <div className="space-y-4">
              {/* Evidence */}
              {selectedAppeal.evidenceUrl &&
                selectedAppeal.evidenceUrl.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Supporting Evidence</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedAppeal.evidenceUrl.map(
                        (url: string, index: number) => (
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
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Appeal Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Plate</p>
                  <p className="font-mono font-semibold">
                    {selectedAppeal.vehiclePlate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Violation Type
                  </p>
                  <p className="font-medium">
                    {selectedAppeal.violationType.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Penalty Amount
                  </p>
                  <p className="font-semibold text-red-600">
                    {selectedAppeal.penaltyAmount
                      ? formatCurrency(selectedAppeal.penaltyAmount)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">
                    {formatDate(selectedAppeal.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Citizen</p>
                  <p className="font-medium">
                    {selectedAppeal.citizen
                      ? `${selectedAppeal.citizen.firstName} ${selectedAppeal.citizen.lastName}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Original Rejection Reason */}
              {selectedAppeal.reviewNotes && (
                <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-700 dark:text-red-400">
                    Original Rejection Reason
                  </h4>
                  <p className="text-sm">{selectedAppeal.reviewNotes}</p>
                </div>
              )}

              {/* Appeal Reason */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">
                  Citizen's Appeal Reason
                </h4>
                <p className="text-sm">
                  {selectedAppeal.appealReason || "No reason provided"}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleStartReview(selectedAppeal, "APPROVED")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Appeal
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleStartReview(selectedAppeal, "REJECTED")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Appeal
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
              {reviewAction === "APPROVED" ? "Approve Appeal" : "Reject Appeal"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {reviewAction === "APPROVED"
                ? "This will dismiss the fine and remove it from the citizen's record."
                : "This will reject the appeal and the fine remains payable."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reviewNotes">Review Notes *</Label>
              <Textarea
                id="reviewNotes"
                placeholder={
                  reviewAction === "APPROVED"
                    ? "Explain why this appeal is valid..."
                    : "Explain why this appeal is rejected..."
                }
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
                required
              />
            </div>
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
