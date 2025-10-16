"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  FileText,
  Plus,
  Upload,
  X,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchMyReports } from "@/lib/store/slices/citizenReportsSlice";
import { citizenReportApi, CitizenReport } from "@/lib/api/citizenReports";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";
import { toast } from "sonner";
import Image from "next/image";

const STATUS_COLORS = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
};

export default function MyAppealsPage() {
  const dispatch = useAppDispatch();
  const { reports = [], loading } = useAppSelector(
    (state) => state.citizenReports
  );

  const [isAppealDialogOpen, setIsAppealDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(
    null
  );
  const [appealReason, setAppealReason] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [evidencePreviews, setEvidencePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMyReports({ status: "REJECTED" }));
  }, [dispatch]);

  const handleStartAppeal = (report: CitizenReport) => {
    setSelectedReport(report);
    setAppealReason("");
    setEvidenceFiles([]);
    setEvidencePreviews([]);
    setIsAppealDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      return isImage || isVideo;
    });

    if (validFiles.length !== files.length) {
      toast.error("Only image and video files are allowed");
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidencePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setEvidenceFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
    setEvidencePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAppeal = async () => {
    if (!selectedReport) {
      toast.error("No report selected");
      return;
    }

    if (!appealReason.trim()) {
      toast.error("Please provide a reason for your appeal");
      return;
    }

    if (evidenceFiles.length === 0) {
      toast.error("Please upload supporting evidence");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(
      "Uploading evidence and submitting appeal..."
    );

    try {
      // Upload evidence files to Cloudinary
      const uploadPromises = evidenceFiles.map((file) =>
        uploadToCloudinary(file, { folder: "appeal-evidence" })
      );
      const uploadResults = await Promise.all(uploadPromises);
      const uploadedUrls = uploadResults.map((result) => result.url);

      // Submit appeal with evidence URLs
      await citizenReportApi.submitAppeal(selectedReport.id, {
        appealReason: appealReason.trim(),
        evidenceUrls: uploadedUrls,
      });

      toast.dismiss(loadingToast);
      toast.success(
        "Appeal submitted successfully! You'll be notified of the decision within 7 days."
      );

      setIsAppealDialogOpen(false);
      setAppealReason("");
      setEvidenceFiles([]);
      setEvidencePreviews([]);
      setSelectedReport(null);

      // Refresh data
      dispatch(fetchMyReports({ status: "REJECTED" }));
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit appeal"
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
    });
  };

  // Filter rejected reports that haven't been appealed yet
  const reportsArray = Array.isArray(reports) ? reports : [];
  const rejectedReports = reportsArray.filter(
    (r) => r.status === "REJECTED" && !(r as any).appealSubmitted
  );

  return (
    <div className="container mx-auto py-6 pt-24 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Appeal Rejected Reports
        </h1>
        <p className="text-muted-foreground">
          Disagree with a rejection? Submit an appeal with supporting evidence
        </p>
      </div>

      {/* Info Alert */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Appeal Guidelines:
              </p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                <li>Provide clear evidence supporting your appeal</li>
                <li>Explain why you believe the rejection was incorrect</li>
                <li>Upload photos or videos that prove your case</li>
                <li>Appeals are reviewed by police within 7 days</li>
                <li>Approved appeals will waive the penalty</li>
                <li>
                  <strong>WARNING:</strong> Rejected appeals incur an additional
                  1.5% penalty
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rejected Reports - Eligible for Appeal */}
      <Card>
        <CardHeader>
          <CardTitle>Rejected Reports - Eligible for Appeal</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : rejectedReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <p>No rejected reports to appeal</p>
              <p className="text-sm mt-2">
                All your reports have been approved or are still pending review
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rejectedReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-accent rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono">
                        {report.vehiclePlate}
                      </Badge>
                      <Badge variant="secondary">
                        {report.violationType.replace("_", " ")}
                      </Badge>
                      <Badge variant="destructive">REJECTED</Badge>
                    </div>
                    {report.description && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {report.description}
                      </p>
                    )}
                    {report.reviewNotes && (
                      <p className="text-sm text-muted-foreground mb-2 italic">
                        <strong>Rejection Reason:</strong> {report.reviewNotes}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Reported: {formatDate(report.createdAt)}</span>
                      </div>
                      {report.penaltyAmount && (
                        <span className="font-semibold text-red-600">
                          Penalty: {formatCurrency(report.penaltyAmount)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button onClick={() => handleStartAppeal(report)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Appeal
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note about viewing appeal status */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> After submitting an appeal, you can track its
            status in the "My Reports" section. Appeals are reviewed within 7
            days.
          </p>
        </CardContent>
      </Card>

      {/* Appeal Submission Dialog */}
      <Dialog open={isAppealDialogOpen} onOpenChange={setIsAppealDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Appeal</DialogTitle>
            <DialogDescription>
              Provide evidence and explanation for why this report should be
              reconsidered
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              {/* Report Info */}
              <div className="p-4 bg-accent rounded-lg">
                <h4 className="font-semibold mb-2">Report Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Vehicle:</span>{" "}
                    <span className="font-mono font-semibold">
                      {selectedReport.vehiclePlate}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Violation:</span>{" "}
                    <span>
                      {selectedReport.violationType.replace("_", " ")}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">
                      Rejection Reason:
                    </span>{" "}
                    <span className="italic">{selectedReport.reviewNotes}</span>
                  </div>
                  {selectedReport.penaltyAmount && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Penalty:</span>{" "}
                      <span className="font-semibold text-red-600">
                        {formatCurrency(selectedReport.penaltyAmount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Appeal Reason */}
              <div className="space-y-2">
                <Label htmlFor="appealReason">
                  Explain why you believe this rejection is incorrect *
                </Label>
                <Textarea
                  id="appealReason"
                  placeholder="Provide a detailed explanation of why your report should be approved..."
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Evidence Upload */}
              <div className="space-y-2">
                <Label>Supporting Evidence * (Photos/Videos)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="evidence-upload"
                  />
                  <label
                    htmlFor="evidence-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Click to upload evidence
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Images and videos only. Upload clear evidence that proves
                      your case.
                    </span>
                  </label>
                </div>

                {/* Evidence Previews */}
                {evidencePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {evidencePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-video">
                        <Image
                          src={preview}
                          alt={`Evidence ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => handleRemoveEvidence(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Warning */}
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Warning:</strong> If your appeal is rejected, an
                  additional 1.5% penalty will be applied to your account. Only
                  submit an appeal if you have strong evidence.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAppealDialogOpen(false);
                setAppealReason("");
                setEvidenceFiles([]);
                setEvidencePreviews([]);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitAppeal} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Appeal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
