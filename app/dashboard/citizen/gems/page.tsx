"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Gem,
  Shield,
  AlertTriangle,
  TrendingDown,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function MyGemsPage() {
  const [gemBalance] = useState(7); // Out of 10
  const [isBlacklisted] = useState(false);
  const [gemTransactions] = useState<any[]>([]);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const RESTORATION_FEE = 50000; // BDT
  const MAX_GEMS = 10;

  const handleRestoreGems = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implement actual payment API call
      toast.success("Payment successful! Your gems have been restored.");
      setIsRestoreDialogOpen(false);
      // TODO: Refetch gem balance after implementation
    } catch (error: any) {
      const errorMessage =
        typeof error === "string" ? error : error?.message || "Payment failed";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
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

  const getGemColor = () => {
    if (gemBalance >= 7) return "text-green-600";
    if (gemBalance >= 4) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = () => {
    if (isBlacklisted) {
      return (
        <Badge variant="destructive" className="text-lg">
          <AlertTriangle className="h-4 w-4 mr-2" />
          BLACKLISTED
        </Badge>
      );
    }
    if (gemBalance === 0) {
      return (
        <Badge variant="destructive" className="text-lg">
          <AlertCircle className="h-4 w-4 mr-2" />
          AT RISK
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="text-lg bg-green-600">
        <CheckCircle2 className="h-4 w-4 mr-2" />
        ACTIVE
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-6 pt-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Gem className="h-8 w-8" />
            My Gems
          </h1>
          <p className="text-muted-foreground">
            Track your monthly gems and driving status
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Blacklist Warning */}
      {(isBlacklisted || gemBalance === 0) && (
        <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  {isBlacklisted
                    ? "Your Driver's License is BLACKLISTED"
                    : "WARNING: Zero Gems Remaining!"}
                </p>
                <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                  {isBlacklisted
                    ? "You cannot drive until you pay the restoration fee and restore your gems."
                    : "You are at risk of being blacklisted. One more violation will blacklist your license."}
                </p>
                {isBlacklisted && (
                  <Button
                    variant="destructive"
                    onClick={() => setIsRestoreDialogOpen(true)}
                  >
                    Pay Restoration Fee ({formatCurrency(RESTORATION_FEE)})
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gem Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Gem Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {Array.from({ length: MAX_GEMS }).map((_, i) => (
                    <Gem
                      key={i}
                      className={`h-10 w-10 ${
                        i < gemBalance ? getGemColor() : "text-gray-300"
                      } ${i < gemBalance ? "fill-current" : ""}`}
                    />
                  ))}
                </div>
              </div>
              <p className={`text-4xl font-bold ${getGemColor()}`}>
                {gemBalance} / {MAX_GEMS}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {gemBalance === MAX_GEMS
                  ? "Excellent! All gems intact."
                  : gemBalance >= 7
                  ? "Good standing. Keep driving safely."
                  : gemBalance >= 4
                  ? "Moderate violations. Drive carefully."
                  : "High risk. Avoid further violations."}
              </p>
            </div>
            <div className="text-right">
              <Shield className="h-20 w-20 text-blue-600 mb-2" />
              <p className="text-sm font-medium">Monthly Allowance</p>
              <p className="text-xs text-muted-foreground">Resets on 1st</p>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <AlertCircle className="inline h-4 w-4 mr-1" />
              You receive 10 gems each month. Each violation deducts gems based
              on severity. Reach zero gems to be blacklisted.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gem Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Gem Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {gemTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <p>No gem deductions yet. Keep driving safely!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {gemTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-accent rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">{transaction.reason}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      -{transaction.gems} gems
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Balance: {transaction.remainingGems}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How Gems Work */}
      <Card>
        <CardHeader>
          <CardTitle>How Gems Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">
                Gem Deduction by Violation:
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-accent rounded-lg">
                  <p className="font-medium">Minor Violations</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    (Parking, Seatbelt, Helmet)
                  </p>
                  <p className="text-red-600 font-bold">-1 gem</p>
                </div>
                <div className="p-3 bg-accent rounded-lg">
                  <p className="font-medium">Moderate Violations</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    (Over speeding, Signal breaking)
                  </p>
                  <p className="text-red-600 font-bold">-2 gems</p>
                </div>
                <div className="p-3 bg-accent rounded-lg">
                  <p className="font-medium">Major Violations</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    (Wrong side, Reckless driving)
                  </p>
                  <p className="text-red-600 font-bold">-3 gems</p>
                </div>
                <div className="p-3 bg-accent rounded-lg">
                  <p className="font-medium">Severe Violations</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    (Drunk driving, No license)
                  </p>
                  <p className="text-red-600 font-bold">-5 gems</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Restoration Process:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Reach zero gems → License automatically blacklisted</li>
                <li>
                  Pay restoration fee of {formatCurrency(RESTORATION_FEE)}
                </li>
                <li>Gems restored to full (10 gems)</li>
                <li>Driving privileges reinstated</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restoration Dialog */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Gems & Driving Rights</DialogTitle>
            <DialogDescription>
              Pay the restoration fee to reinstate your driver's license
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-accent rounded-lg">
              <p className="font-semibold mb-2">Restoration Fee</p>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(RESTORATION_FEE)}
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <CheckCircle2 className="inline h-4 w-4 mr-1" />
                Upon payment, you will:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>Receive 10 fresh gems</li>
                <li>Regain full driving privileges</li>
                <li>Have your blacklist status removed</li>
                <li>Get a clean monthly record</li>
              </ul>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <p className="text-sm text-red-900 dark:text-red-100">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                Please drive responsibly after restoration. Repeated
                blacklisting may result in permanent license suspension.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRestoreDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleRestoreGems} disabled={isProcessing}>
              {isProcessing ? "Processing Payment..." : "Pay & Restore"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
