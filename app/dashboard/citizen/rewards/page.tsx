"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowDownToLine,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchMyBalance,
  fetchMyTransactions,
  fetchMyWithdrawals,
  requestWithdrawal,
} from "@/lib/store/slices/rewardSlice";
import { fetchMyDebts } from "@/lib/store/slices/debtSlice";
import { DebtWarningAlert } from "@/components/citizen/DebtWarningAlert";
import { PayDebtModal } from "@/components/citizen/PayDebtModal";
import { toast } from "sonner";

export default function MyRewardsPage() {
  const dispatch = useAppDispatch();
  const {
    balance,
    transactions = [],
    withdrawals = [],
    loading,
  } = useAppSelector((state) => state.reward);

  const {
    debts,
    totalDebt,
    totalLateFees,
    debtCount,
    oldestDueDate,
    loading: debtLoading,
  } = useAppSelector((state) => state.debt);

  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isPayDebtDialogOpen, setIsPayDebtDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("MOBILE_BANKING");
  const [accountDetails, setAccountDetails] = useState({
    mobileNumber: "",
    accountNumber: "",
    accountName: "",
    bankName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load rewards data with error handling
    dispatch(fetchMyBalance()).catch((err) => {
      console.error("Failed to fetch balance:", err);
      toast.error(
        "Unable to load balance. Backend rewards API may not be implemented yet."
      );
    });

    dispatch(fetchMyTransactions({ page: 1, limit: 10 })).catch((err) => {
      console.error("Failed to fetch transactions:", err);
      toast.error(
        "Unable to load transactions. Backend rewards API may not be implemented yet."
      );
    });

    dispatch(fetchMyWithdrawals()).catch((err) => {
      console.error("Failed to fetch withdrawals:", err);
      toast.error(
        "Unable to load withdrawals. Backend rewards API may not be implemented yet."
      );
    });

    // Load debt data
    dispatch(fetchMyDebts()).catch((err) => {
      console.error("Failed to fetch debts:", err);
    });
  }, [dispatch]);

  const handleWithdrawRequest = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!balance || parseFloat(withdrawAmount) > balance.withdrawableAmount) {
      toast.error("Insufficient withdrawable balance");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        requestWithdrawal({
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod as any,
          accountDetails,
        })
      ).unwrap();

      toast.success("Withdrawal request submitted successfully");
      setIsWithdrawDialogOpen(false);
      setWithdrawAmount("");
      dispatch(fetchMyBalance());
      dispatch(fetchMyWithdrawals());
    } catch (error: any) {
      toast.error(error || "Failed to submit withdrawal request");
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

  const getTransactionIcon = (type: string) => {
    return type === "REWARD" || type === "BONUS" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-500",
      COMPLETED: "bg-green-500",
      APPROVED: "bg-blue-500",
      REJECTED: "bg-red-500",
      CANCELLED: "bg-gray-500",
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} text-white`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-6 pt-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="h-8 w-8" />
            My Rewards
          </h1>
          <p className="text-muted-foreground">
            Track your earnings and manage withdrawals
          </p>
        </div>
        <div className="flex gap-2">
          {balance && balance.currentBalance > 0 ? (
            <Button
              onClick={() => setIsWithdrawDialogOpen(true)}
              disabled={!balance || balance.withdrawableAmount <= 0}
            >
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          ) : balance && balance.currentBalance < 0 ? (
            <Button
              variant="destructive"
              onClick={() => setIsPayDebtDialogOpen(true)}
              disabled={false}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Debt
            </Button>
          ) : null}
        </div>
      </div>

      {/* Negative Balance Warning (when no debts exist yet) */}
      {balance && balance.currentBalance < 0 && debtCount === 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-lg">
                Negative Balance Detected
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current Balance:
                </span>
                <span className="text-2xl font-bold text-destructive">
                  {formatCurrency(balance.currentBalance)}
                </span>
              </div>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Payment Required:</strong> Your balance is negative.
                  Please clear your outstanding balance to continue earning
                  rewards.
                  <br />
                  <br />
                  <strong>⚠️ Late Payment Penalty:</strong> If not paid within 7
                  days, a late fee of <strong>2.5% per week</strong> will be
                  automatically applied to your outstanding balance.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debt Warning Alert (when debts are created) */}
      {totalDebt > 0 && (
        <DebtWarningAlert
          totalDebt={totalDebt}
          totalLateFees={totalLateFees}
          debtCount={debtCount}
          oldestDueDate={oldestDueDate}
          onPayNow={() => setIsPayDebtDialogOpen(true)}
        />
      )}

      {/* Balance Cards */}
      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earned
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(balance.totalEarned)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Penalties
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(balance.totalPenalties)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Current Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(balance.currentBalance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Withdrawable
              </CardTitle>
              <ArrowDownToLine className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(balance.withdrawableAmount)}
              </div>
              {balance.pendingRewards > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  +{formatCurrency(balance.pendingRewards)} pending
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-accent rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === "REWARD" ||
                        transaction.type === "BONUS"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "REWARD" ||
                      transaction.type === "BONUS"
                        ? "+"
                        : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Requests */}
      {withdrawals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex items-center justify-between p-3 bg-accent rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {formatCurrency(withdrawal.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {withdrawal.method} • {formatDate(withdrawal.requestedAt)}
                    </p>
                    {withdrawal.notes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {withdrawal.notes}
                      </p>
                    )}
                  </div>
                  {getStatusBadge(withdrawal.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Withdraw Dialog */}
      <Dialog
        open={isWithdrawDialogOpen}
        onOpenChange={setIsWithdrawDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Withdrawal</DialogTitle>
            <DialogDescription>
              Withdraw your earnings to your preferred payment method
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">
                {balance && formatCurrency(balance.withdrawableAmount)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Payment Method *</Label>
              <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MOBILE_BANKING">Mobile Banking</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {withdrawMethod === "MOBILE_BANKING" && (
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  placeholder="01XXXXXXXXX"
                  value={accountDetails.mobileNumber}
                  onChange={(e) =>
                    setAccountDetails({
                      ...accountDetails,
                      mobileNumber: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {withdrawMethod === "BANK_TRANSFER" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name *</Label>
                  <Input
                    id="accountName"
                    value={accountDetails.accountName}
                    onChange={(e) =>
                      setAccountDetails({
                        ...accountDetails,
                        accountName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={accountDetails.accountNumber}
                    onChange={(e) =>
                      setAccountDetails({
                        ...accountDetails,
                        accountNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    value={accountDetails.bankName}
                    onChange={(e) =>
                      setAccountDetails({
                        ...accountDetails,
                        bankName: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}

            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                Your request will be reviewed and processed within 3-5 business
                days.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsWithdrawDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleWithdrawRequest} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pay Debt Modal */}
      <PayDebtModal
        open={isPayDebtDialogOpen}
        onClose={() => setIsPayDebtDialogOpen(false)}
        debts={debts}
        onSuccess={() => {
          dispatch(fetchMyDebts());
          dispatch(fetchMyBalance());
          toast.success("Payment processed successfully!");
        }}
      />
    </div>
  );
}
