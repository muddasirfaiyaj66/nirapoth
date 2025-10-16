"use client";

import React from "react";
import { AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface DebtWarningAlertProps {
  totalDebt: number;
  totalLateFees: number;
  debtCount: number;
  oldestDueDate: string | null;
  onPayNow?: () => void;
}

export function DebtWarningAlert({
  totalDebt,
  totalLateFees,
  debtCount,
  oldestDueDate,
  onPayNow,
}: DebtWarningAlertProps) {
  if (totalDebt <= 0) return null;

  const isUrgent = oldestDueDate && new Date(oldestDueDate) < new Date();

  return (
    <Card className="border-destructive bg-destructive/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-lg">Outstanding Debt</CardTitle>
            {isUrgent && (
              <Badge variant="destructive" className="ml-2">
                Overdue
              </Badge>
            )}
          </div>
          {onPayNow && (
            <Button size="sm" variant="destructive" onClick={onPayNow}>
              Pay Now
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Total Debt Amount */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Debt:</span>
            <span className="text-2xl font-bold text-destructive">
              {formatCurrency(totalDebt)}
            </span>
          </div>

          {/* Late Fees */}
          {totalLateFees > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Late Fees (2.5% per week):</span>
              </div>
              <span className="text-sm font-semibold text-destructive">
                {formatCurrency(totalLateFees)}
              </span>
            </div>
          )}

          {/* Number of Debts */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Outstanding Items:
            </span>
            <Badge variant="outline">{debtCount}</Badge>
          </div>

          {/* Oldest Due Date */}
          {oldestDueDate && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Oldest Due:</span>
              </div>
              <span className="text-sm font-medium">
                {formatDistanceToNow(new Date(oldestDueDate), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}

          {/* Warning Message */}
          <Alert variant="destructive" className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-bold">
              ⚠️ Payment Required - Penalties Apply!
            </AlertTitle>
            <AlertDescription className="text-xs space-y-2">
              <p className="font-semibold">
                Please clear your outstanding balance immediately to continue
                earning rewards.
              </p>
              <p className="bg-destructive/20 p-2 rounded border border-destructive/30">
                <strong>⏰ Late Payment Penalty:</strong> A late fee of{" "}
                <strong className="text-base">2.5% per week</strong> is
                automatically applied after the 7-day grace period. The longer
                you wait, the more you owe!
              </p>
              <p className="text-xs opacity-90">
                Example: A ৳1,000 debt becomes ৳1,025 after 1 week, ৳1,050 after
                2 weeks, ৳1,075 after 3 weeks, and continues to grow.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
