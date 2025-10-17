"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  AlertTriangle,
  Download,
  CreditCard,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  rewardApi,
  type RewardBalance,
  type RewardTransaction,
  type WithdrawalRequest,
} from "@/lib/api/rewards";
import { debtApi, type OutstandingDebt } from "@/lib/api/debt";
import { apiCache } from "@/lib/utils/apiCache";

export default function RewardsPage() {
  const [balance, setBalance] = useState<RewardBalance | null>(null);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [debts, setDebts] = useState<OutstandingDebt[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Prevent duplicate API calls
  const hasLoadedRef = useRef(false);

  // Get query params to detect payment success redirect
  const searchParams = useSearchParams();
  const isRefreshing = searchParams?.get("refresh") === "true";

  // Withdraw Dialog
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState<
    "BANK_TRANSFER" | "MOBILE_BANKING" | "CASH"
  >("BANK_TRANSFER");
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    accountName: "",
    bankName: "",
    mobileNumber: "",
  });

  // Pay Debt Dialog
  const [payDebtDialogOpen, setPayDebtDialogOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<OutstandingDebt | null>(
    null
  );

  useEffect(() => {
    // Load data on mount or when refresh parameter is present (after payment)
    if (!hasLoadedRef.current || isRefreshing) {
      if (!isRefreshing) {
        // Only set flag to true on initial load, not on refresh
        hasLoadedRef.current = true;
      }
      loadAllData();
    }
  }, [isRefreshing]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading rewards & debt data...");

      // Check cache first
      const cachedBalance = apiCache.get<RewardBalance>(
        "rewards:balance",
        30000
      );
      const cachedTransactions = apiCache.get<{
        transactions: RewardTransaction[];
      }>("rewards:transactions", 60000);
      const cachedDebts = apiCache.get<OutstandingDebt[]>(
        "rewards:debts",
        30000
      );
      const cachedWithdrawals = apiCache.get<WithdrawalRequest[]>(
        "rewards:withdrawals",
        60000
      );

      if (
        cachedBalance &&
        cachedTransactions &&
        cachedDebts &&
        cachedWithdrawals
      ) {
        console.log("✅ Using cached data - NO API CALLS!");
        setBalance(cachedBalance);
        setTransactions(cachedTransactions.transactions);
        setDebts(cachedDebts);
        setWithdrawals(cachedWithdrawals);
        setLoading(false);
        return;
      }

      // Fetch only missing data
      const fetchBalance = cachedBalance
        ? Promise.resolve(cachedBalance)
        : rewardApi.getMyBalance().catch(() => null);
      const fetchTransactions = cachedTransactions
        ? Promise.resolve(cachedTransactions)
        : rewardApi.getMyTransactions({ page: 1, limit: 50 }).catch(() => ({
            transactions: [],
            pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
          }));
      const fetchDebts = cachedDebts
        ? Promise.resolve(cachedDebts)
        : debtApi.getMyDebts().catch(() => []);
      const fetchWithdrawals = cachedWithdrawals
        ? Promise.resolve(cachedWithdrawals)
        : rewardApi.getMyWithdrawals().catch(() => []);

      const [balanceRes, transactionsRes, debtsRes, withdrawalsRes] =
        await Promise.all([
          fetchBalance,
          fetchTransactions,
          fetchDebts,
          fetchWithdrawals,
        ]);

      console.log("📦 Balance:", balanceRes);
      console.log("📦 Transactions:", transactionsRes);
      console.log("📦 Debts:", debtsRes);
      console.log("📦 Withdrawals:", withdrawalsRes);

      // Cache the results
      if (balanceRes) {
        setBalance(balanceRes);
        apiCache.set("rewards:balance", balanceRes);
      }

      if (transactionsRes) {
        const txData = (transactionsRes as any).transactions || transactionsRes;
        setTransactions(Array.isArray(txData) ? txData : []);
        apiCache.set("rewards:transactions", {
          transactions: Array.isArray(txData) ? txData : [],
        });
      }

      if (Array.isArray(debtsRes)) {
        setDebts(debtsRes);
        apiCache.set("rewards:debts", debtsRes);
      } else if (
        debtsRes &&
        (debtsRes as any).success &&
        (debtsRes as any).data
      ) {
        const debtsList = (debtsRes as any).data.debts || [];
        setDebts(debtsList);
        apiCache.set("rewards:debts", debtsList);
      }

      if (Array.isArray(withdrawalsRes)) {
        setWithdrawals(withdrawalsRes);
        apiCache.set("rewards:withdrawals", withdrawalsRes);
      }
    } catch (error) {
      console.error("❌ Error loading data:", error);
      toast.error("Failed to load rewards data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Clear cache on manual refresh
    apiCache.invalidatePattern("rewards:");
    await loadAllData();
    setRefreshing(false);
    toast.success("Data refreshed successfully");
  };

  const handleWithdraw = async () => {
    try {
      const amount = parseFloat(withdrawAmount);

      if (!amount || amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      if (!balance || amount > balance.withdrawableAmount) {
        toast.error("Insufficient balance");
        return;
      }

      console.log("💰 Requesting withdrawal:", {
        amount,
        method: withdrawMethod,
        accountDetails,
      });

      await rewardApi.requestWithdrawal({
        amount,
        method: withdrawMethod,
        accountDetails,
      });

      toast.success("Withdrawal request submitted successfully!");
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setAccountDetails({
        accountNumber: "",
        accountName: "",
        bankName: "",
        mobileNumber: "",
      });
      loadAllData();
    } catch (error: any) {
      console.error("❌ Withdrawal error:", error);
      toast.error(error.message || "Failed to request withdrawal");
    }
  };

  const handlePayDebt = async () => {
    if (!selectedDebt) return;

    try {
      console.log("💳 Initiating debt payment:", selectedDebt.id);

      const response = await debtApi.payDebt({
        debtId: selectedDebt.id,
        amount: selectedDebt.currentAmount,
        paymentMethod: "ONLINE",
      });

      if (response.success && response.data) {
        // Check if response contains payment URL (SSLCommerz integration)
        const paymentData = response.data as any;
        if (paymentData.paymentUrl) {
          toast.success("Redirecting to payment gateway...");
          window.location.href = paymentData.paymentUrl;
        } else {
          toast.success("Debt payment initiated successfully");
          setPayDebtDialogOpen(false);
          loadAllData();
        }
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error: any) {
      console.error("❌ Payment error:", error);
      toast.error(error.message || "Failed to initiate debt payment");
    }
  };

  const openPayDebtDialog = (debt: OutstandingDebt) => {
    setSelectedDebt(debt);
    setPayDebtDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Loading rewards...</p>
        </div>
      </div>
    );
  }

  const hasDebts =
    debts.length > 0 && debts.some((d) => d.status === "OUTSTANDING");
  const totalDebt = debts
    .filter((d) => d.status === "OUTSTANDING")
    .reduce((sum, d) => sum + d.currentAmount, 0);
  const isOverdue = debts.some(
    (d) => d.status === "OUTSTANDING" && new Date(d.dueDate) < new Date()
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rewards & Balance</h1>
          <p className="text-gray-600 mt-1">
            Manage your rewards, withdrawals, and outstanding debts
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      {/* Alert for Outstanding Debts */}
      {hasDebts && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900">
                  Outstanding Debt: ৳{totalDebt.toLocaleString()}
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {isOverdue
                    ? "⚠️ You have overdue debts! Late payment penalties of 2.5% per week are being applied."
                    : "You must pay your debt within 1 week to avoid late payment penalties (2.5% per week)."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Balance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                (balance?.currentBalance || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              )}
            >
              ৳{(balance?.currentBalance || 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {(balance?.currentBalance || 0) >= 0
                ? "Available for withdrawal"
                : "Negative balance - debt created"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ৳{(balance?.totalEarned || 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Rewards & bonuses</p>
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
              ৳{(balance?.totalPenalties || 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Penalties & deductions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fine Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ৳{(balance?.totalFinePayments || 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Traffic violation fines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {(balance?.totalOutstandingDebt || 0) > 0
                ? "Outstanding Debt"
                : "Debt Payments"}
            </CardTitle>
            <DollarSign
              className={cn(
                "h-4 w-4",
                (balance?.totalOutstandingDebt || 0) > 0
                  ? "text-red-600"
                  : "text-purple-600"
              )}
            />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                (balance?.totalOutstandingDebt || 0) > 0
                  ? "text-red-600"
                  : "text-purple-600"
              )}
            >
              ৳
              {(balance?.totalOutstandingDebt || 0) > 0
                ? (balance?.totalOutstandingDebt || 0).toLocaleString()
                : (balance?.totalDebtPayments || 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {(balance?.totalOutstandingDebt || 0) > 0
                ? "Unpaid debt amount"
                : "Payments made"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        {(balance?.currentBalance || 0) > 0 && (
          <Button
            onClick={() => setWithdrawDialogOpen(true)}
            disabled={(balance?.withdrawableAmount || 0) <= 0}
            className="flex-1 md:flex-none"
          >
            <Download className="h-4 w-4 mr-2" />
            Withdraw Money
          </Button>
        )}

        {hasDebts && (
          <Button
            onClick={() => {
              const firstDebt = debts.find((d) => d.status === "OUTSTANDING");
              if (firstDebt) openPayDebtDialog(firstDebt);
            }}
            variant="destructive"
            className="flex-1 md:flex-none"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Pay Debt (৳{totalDebt.toLocaleString()})
          </Button>
        )}
      </div>

      {/* Outstanding Debts */}
      {hasDebts && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Outstanding Debts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {debts
                .filter((d) => d.status === "OUTSTANDING")
                .map((debt) => {
                  const dueDate = new Date(debt.dueDate);
                  const isDebtOverdue = dueDate < new Date();
                  const daysUntilDue = Math.ceil(
                    (dueDate.getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={debt.id}
                      className="border rounded-lg p-4 bg-red-50 border-red-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                isDebtOverdue ? "destructive" : "secondary"
                              }
                            >
                              {isDebtOverdue ? "OVERDUE" : "DUE SOON"}
                            </Badge>
                            {debt.weeksPastDue > 0 && (
                              <Badge variant="destructive">
                                {debt.weeksPastDue} weeks overdue
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Original Amount</p>
                              <p className="font-semibold text-red-900">
                                ৳{debt.originalAmount.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">
                                Late Fees (2.5%/week)
                              </p>
                              <p className="font-semibold text-red-900">
                                ৳{debt.lateFees.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Amount</p>
                              <p className="font-bold text-red-900 text-lg">
                                ৳{debt.currentAmount.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Due Date</p>
                              <p className="font-semibold">
                                {format(dueDate, "PPP")}
                                {!isDebtOverdue && daysUntilDue > 0 && (
                                  <span className="text-xs text-gray-500 block">
                                    ({daysUntilDue} days left)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => openPayDebtDialog(debt)}
                          variant="destructive"
                          size="sm"
                        >
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Withdrawals */}
      {withdrawals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-semibold">
                        ৳{withdrawal.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {withdrawal.method} •{" "}
                        {format(new Date(withdrawal.requestedAt), "PPP")}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      withdrawal.status === "APPROVED"
                        ? "default"
                        : withdrawal.status === "PENDING"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {withdrawal.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm mt-1">Submit reports to earn rewards</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const isPositive =
                    tx.type === "REWARD" || tx.type === "BONUS";
                  const isDebtPayment = tx.type === "DEBT_PAYMENT";

                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm">
                        {format(new Date(tx.createdAt), "PPp")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isPositive ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          ) : isDebtPayment ? (
                            <CreditCard className="h-4 w-4 text-purple-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                          )}
                          <Badge
                            variant={
                              isPositive
                                ? "default"
                                : isDebtPayment
                                ? "secondary"
                                : "destructive"
                            }
                            className={cn(
                              isDebtPayment &&
                                "bg-purple-100 text-purple-800 hover:bg-purple-200"
                            )}
                          >
                            {tx.type === "DEBT_PAYMENT"
                              ? "DEBT PAYMENT"
                              : tx.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {tx.description}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-semibold",
                          isPositive
                            ? "text-green-600"
                            : isDebtPayment
                            ? "text-purple-600"
                            : "text-red-600"
                        )}
                      >
                        {isPositive ? "+" : "-"}৳
                        {Math.abs(tx.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.status === "COMPLETED"
                              ? "default"
                              : tx.status === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Money</DialogTitle>
            <DialogDescription>
              Request a withdrawal from your reward balance
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (৳)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={balance?.withdrawableAmount || 0}
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: ৳
                {(balance?.withdrawableAmount || 0).toLocaleString()}
              </p>
            </div>

            <div>
              <Label htmlFor="method">Withdrawal Method</Label>
              <Select
                value={withdrawMethod}
                onValueChange={(value: any) => setWithdrawMethod(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="MOBILE_BANKING">Mobile Banking</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {withdrawMethod === "BANK_TRANSFER" && (
              <>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Enter account number"
                    value={accountDetails.accountNumber}
                    onChange={(e) =>
                      setAccountDetails({
                        ...accountDetails,
                        accountNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="Enter account name"
                    value={accountDetails.accountName}
                    onChange={(e) =>
                      setAccountDetails({
                        ...accountDetails,
                        accountName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="Enter bank name"
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

            {withdrawMethod === "MOBILE_BANKING" && (
              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  placeholder="Enter mobile number"
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
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWithdrawDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleWithdraw}>Request Withdrawal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pay Debt Dialog */}
      <Dialog open={payDebtDialogOpen} onOpenChange={setPayDebtDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pay Debt via SSLCommerz</DialogTitle>
            <DialogDescription>
              You will be redirected to SSLCommerz payment gateway
            </DialogDescription>
          </DialogHeader>

          {selectedDebt && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Original Amount:
                    </span>
                    <span className="font-semibold">
                      ৳{selectedDebt.originalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Late Fees:</span>
                    <span className="font-semibold text-red-600">
                      ৳{selectedDebt.lateFees.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total to Pay:</span>
                    <span className="font-bold text-lg text-red-900">
                      ৳{selectedDebt.currentAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>• Payment will be processed through SSLCommerz</p>
                <p>
                  • You can pay using Card, Mobile Banking, or Internet Banking
                </p>
                <p>• After successful payment, your debt will be cleared</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPayDebtDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handlePayDebt}>
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
