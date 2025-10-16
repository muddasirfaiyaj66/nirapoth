"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { makeDebtPayment } from "@/lib/store/slices/debtSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Wallet,
  Building,
  Smartphone,
  Globe,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { OutstandingDebt } from "@/lib/api/debt";

// Payment form validation schema
const paymentSchema = z.object({
  debtId: z.string().uuid("Please select a debt"),
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .min(1, "Minimum payment is ৳1"),
  paymentMethod: z.enum(
    ["CASH", "CARD", "BANK_TRANSFER", "MOBILE_MONEY", "ONLINE"],
    {
      required_error: "Please select a payment method",
    }
  ),
  paymentReference: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PayDebtModalProps {
  open: boolean;
  onClose: () => void;
  debts: OutstandingDebt[];
  preselectedDebtId?: string;
  onSuccess?: () => void;
}

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash", icon: Wallet },
  { value: "CARD", label: "Credit/Debit Card", icon: CreditCard },
  { value: "BANK_TRANSFER", label: "Bank Transfer", icon: Building },
  {
    value: "MOBILE_MONEY",
    label: "Mobile Money (bKash/Nagad)",
    icon: Smartphone,
  },
  { value: "ONLINE", label: "Online Payment", icon: Globe },
];

export function PayDebtModal({
  open,
  onClose,
  debts,
  preselectedDebtId,
  onSuccess,
}: PayDebtModalProps) {
  const dispatch = useAppDispatch();
  const { paymentLoading, paymentError } = useAppSelector(
    (state) => state.debt
  );
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Debug: Log debts when modal opens
  React.useEffect(() => {
    if (open) {
      console.log("PayDebtModal opened with debts:", debts);
      console.log("Number of debts:", debts?.length || 0);
    }
  }, [open, debts]);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      debtId: preselectedDebtId || "",
      amount: 0,
      paymentMethod: undefined,
      paymentReference: "",
    },
  });

  const selectedDebtId = form.watch("debtId");
  const selectedDebt = debts.find((debt) => debt.id === selectedDebtId);
  const remainingBalance = selectedDebt
    ? selectedDebt.currentAmount - selectedDebt.paidAmount
    : 0;

  // Automatically set amount to full remaining balance when debt is selected
  React.useEffect(() => {
    if (selectedDebt && remainingBalance > 0) {
      form.setValue("amount", remainingBalance);
    }
  }, [selectedDebt, remainingBalance, form]);

  const handleSubmit = async (data: PaymentFormData) => {
    try {
      // Validate amount equals remaining balance (full payment only)
      if (data.amount !== remainingBalance) {
        form.setError("amount", {
          message: `You must pay the full amount of ${formatCurrency(
            remainingBalance
          )}. Partial payments are not allowed.`,
        });
        return;
      }

      const result = await dispatch(makeDebtPayment(data)).unwrap();

      setPaymentSuccess(true);

      // Close modal after 2 seconds and call onSuccess callback
      setTimeout(() => {
        setPaymentSuccess(false);
        form.reset();
        onClose();
        onSuccess?.();
      }, 2000);
    } catch (error) {
      // Error is handled by Redux slice
      console.error("Payment failed:", error);
    }
  };

  const handleClose = () => {
    if (!paymentLoading) {
      form.reset();
      setPaymentSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pay Outstanding Debt</DialogTitle>
          <DialogDescription>
            Pay your outstanding debt in full. Partial payments are not allowed.
          </DialogDescription>
        </DialogHeader>

        {/* Penalty Warning */}
        <Alert variant="destructive" className="border-2">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            <p className="font-semibold text-base mb-2">
              ⚠️ Late Payment Penalty Active
            </p>
            <p className="text-sm">
              Your debt is increasing by{" "}
              <strong className="text-lg">2.5% per week</strong> until fully
              paid. Pay now to stop penalties from growing!
            </p>
          </AlertDescription>
        </Alert>

        {paymentSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-semibold text-green-700">
              Payment Successful!
            </h3>
            <p className="text-sm text-muted-foreground">
              Your payment has been recorded.
            </p>
          </div>
        ) : debts.length === 0 ? (
          // Show message when no debt records exist yet
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">No Debt Records Found</p>
                <p className="text-sm text-muted-foreground">
                  Your negative balance has been detected, but debt records
                  haven't been created yet. This typically happens automatically
                  within a few moments.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please try refreshing the page or contact support if this
                  persists.
                </p>
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button type="button" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Debt Selection */}
              <FormField
                control={form.control}
                name="debtId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Debt</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a debt to pay" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {debts.map((debt) => (
                          <SelectItem key={debt.id} value={debt.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>Debt #{debt.id.slice(0, 8)}...</span>
                              <span className="ml-4 font-medium">
                                {formatCurrency(
                                  debt.currentAmount - debt.paidAmount
                                )}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Debt Details */}
              {selectedDebt && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="text-sm space-y-1">
                      <p>
                        Original Amount:{" "}
                        <strong>
                          {formatCurrency(selectedDebt.originalAmount)}
                        </strong>
                      </p>
                      <p>
                        Late Fees:{" "}
                        <strong className="text-destructive">
                          {formatCurrency(selectedDebt.lateFees)}
                        </strong>
                      </p>
                      <p>
                        Paid So Far:{" "}
                        <strong>
                          {formatCurrency(selectedDebt.paidAmount)}
                        </strong>
                      </p>
                      <p>
                        Remaining Balance:{" "}
                        <strong className="text-lg">
                          {formatCurrency(remainingBalance)}
                        </strong>
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Payment Amount - FULL PAYMENT ONLY (Read-only) */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount (BDT)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Full payment amount"
                        {...field}
                        value={field.value}
                        readOnly
                        disabled={!selectedDebt}
                        className="bg-muted cursor-not-allowed"
                      />
                    </FormControl>
                    <FormDescription className="text-destructive font-medium">
                      ⚠️ Full payment required - Partial payments are not
                      allowed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => {
                          const Icon = method.icon;
                          return (
                            <SelectItem key={method.value} value={method.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{method.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Reference */}
              <FormField
                control={form.control}
                name="paymentReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Reference (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Transaction ID, Receipt Number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter any reference number for your records
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Display */}
              {paymentError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{paymentError}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={paymentLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={paymentLoading || !selectedDebt}
                >
                  {paymentLoading ? "Processing..." : "Submit Payment"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
