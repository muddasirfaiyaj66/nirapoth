"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  Search,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  CreditCard,
  Loader2,
} from "lucide-react";
import { paymentApi } from "@/lib/api/payments";
import { fineApi, Fine } from "@/lib/api/fines";
import { toast } from "sonner";

// Violation data type based on API response
interface Violation {
  id: string;
  type: string;
  description: string;
  vehicle: string;
  date: string;
  location: string;
  fineAmount: number;
  status: "UNPAID" | "PAID" | "APPEALED";
  fineId: string;
}

export default function MyViolationsPage() {
  const [selectedViolations, setSelectedViolations] = useState<string[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      return;
    }

    const fetchViolations = async () => {
      try {
        setIsLoading(true);
        const response = await fineApi.getMyFines();

        // Check if response has data
        if (!response.success || !response.data) {
          console.error("API response error:", response);
          throw new Error(response.error?.message || "Failed to fetch fines");
        }

        // Transform API response to Violation format
        const transformedViolations: Violation[] = response.data.map(
          (fine: Fine) => ({
            id: fine.id,
            fineId: fine.id,
            type: fine.violation?.rule?.title || "Unknown Violation",
            description:
              fine.violation?.rule?.description || "No description available",
            vehicle: fine.violation?.vehicle?.plateNo || "Unknown",
            date: new Date(fine.issuedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            location: fine.violation?.location?.address || "Unknown Location",
            fineAmount: fine.amount,
            status:
              fine.status === "PAID"
                ? "PAID"
                : fine.status === "DISPUTED"
                ? "APPEALED"
                : "UNPAID",
          })
        );

        setViolations(transformedViolations);
      } catch (error: any) {
        console.error("Failed to fetch violations:", error);
        toast.error(error?.message || "Failed to load violations");
        // Set violations to empty array on error so UI can render
        setViolations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViolations();
  }, []);

  const activeViolations = violations.filter((v) => v.status === "UNPAID");

  const handleSelectViolation = (violationId: string) => {
    setSelectedViolations((prev) =>
      prev.includes(violationId)
        ? prev.filter((id) => id !== violationId)
        : [...prev, violationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedViolations.length === activeViolations.length) {
      setSelectedViolations([]);
    } else {
      setSelectedViolations(activeViolations.map((v) => v.id));
    }
  };

  const getSelectedViolationsData = () => {
    return activeViolations.filter((v) => selectedViolations.includes(v.id));
  };

  const getTotalAmount = () => {
    return getSelectedViolationsData().reduce(
      (sum, v) => sum + v.fineAmount,
      0
    );
  };

  const handlePayNow = () => {
    if (selectedViolations.length === 0) {
      toast.error("Please select at least one violation to pay");
      return;
    }
    setIsPaymentDialogOpen(true);
  };

  const handleConfirmPayment = async () => {
    try {
      setIsProcessing(true);

      const selectedFines = getSelectedViolationsData();
      const fineIds = selectedFines
        .map((v) => v.fineId)
        .filter((id): id is string => id !== undefined);

      if (fineIds.length === 0) {
        toast.error("No valid fines selected");
        return;
      }

      // Initialize SSLCommerz payment
      const response = await paymentApi.initOnlinePayment({
        fineIds: fineIds,
        amount: getTotalAmount(),
      });

      // Redirect to SSLCommerz payment gateway
      if (response.data?.gatewayPageURL) {
        window.location.href = response.data.gatewayPageURL;
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Violations</h1>
            <p className="text-muted-foreground">
              View and manage your traffic violations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-sm">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {activeViolations.length} Active
            </Badge>
          </div>
        </div>

        {/* Payment Summary */}
        {selectedViolations.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {selectedViolations.length} violation(s) selected
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    Total: ৳{getTotalAmount().toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={handlePayNow}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now with SSLCommerz
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search violations</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by violation type, date, or fine amount..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Violations Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">
              Active Violations
              <Badge variant="destructive" className="ml-2">
                {activeViolations.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="paid">
              Paid
              <Badge variant="secondary" className="ml-2">
                5
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="appealed">
              Under Appeal
              <Badge variant="secondary" className="ml-2">
                1
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Active Violations
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedViolations.length === activeViolations.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={
                            selectedViolations.length ===
                            activeViolations.length
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Violation</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Fine Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Loading violations...
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : activeViolations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <Shield className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-lg font-medium mb-1">
                            No active violations
                          </p>
                          <p className="text-sm text-muted-foreground">
                            You have no unpaid traffic violations
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeViolations.map((violation) => (
                        <TableRow key={violation.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedViolations.includes(
                                violation.id
                              )}
                              onCheckedChange={() =>
                                handleSelectViolation(violation.id)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-red-600" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {violation.type}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {violation.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{violation.vehicle}</Badge>
                          </TableCell>
                          <TableCell>{violation.date}</TableCell>
                          <TableCell>{violation.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant="destructive"
                              className="bg-red-100 text-red-800"
                            >
                              <DollarSign className="h-3 w-3 mr-1" />৳
                              {violation.fineAmount.toLocaleString()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive">
                              <Clock className="h-3 w-3 mr-1" />
                              Unpaid
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setSelectedViolations([violation.id]);
                                  setIsPaymentDialogOpen(true);
                                }}
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                Pay Now
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <FileText className="h-4 w-4 mr-1" />
                                Appeal
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paid" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Paid Violations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Paid violations will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appealed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Under Appeal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Appealed violations will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Confirmation Dialog */}
        <Dialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Confirm Payment
              </DialogTitle>
              <DialogDescription>
                You are about to pay for {selectedViolations.length}{" "}
                violation(s) using SSLCommerz secure payment gateway.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Selected Violations */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">Selected Violations:</h4>
                {getSelectedViolationsData().map((violation) => (
                  <div
                    key={violation.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-muted-foreground">
                      {violation.type} - {violation.vehicle}
                    </span>
                    <span className="font-medium">
                      ৳{violation.fineAmount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between items-center font-bold">
                  <span>Total Amount:</span>
                  <span className="text-lg">
                    ৳{getTotalAmount().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-blue-900">
                      SSLCommerz Secure Payment
                    </h4>
                    <p className="text-xs text-blue-700 mt-1">
                      You will be redirected to SSLCommerz secure payment
                      gateway. You can pay using credit/debit card, mobile
                      banking, or internet banking.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPaymentDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
