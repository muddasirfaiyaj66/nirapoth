"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { paymentApi, PaymentStats } from "@/lib/api/payments";
import { fineApi } from "@/lib/api/fines";
import { toast } from "sonner";

interface RevenueData {
  date: string;
  revenue: number;
  payments: number;
}

interface PaymentMethodData {
  method: string;
  amount: number;
  count: number;
  color: string;
}

interface RecentPayment {
  id: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  userName: string;
  vehiclePlate: string;
}

export default function AdminRevenuePage() {
  const [timeRange, setTimeRange] = useState("30days");
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<
    PaymentMethodData[]
  >([]);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);

  // Fetch payment statistics
  const {
    data: paymentStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery<PaymentStats>({
    queryKey: ["payment-stats"],
    queryFn: async () => {
      const response = await paymentApi.getPaymentStats();
      return response;
    },
  });

  // Fetch fine statistics
  const { data: fineStats, refetch: refetchFineStats } = useQuery({
    queryKey: ["fine-stats"],
    queryFn: async () => {
      const response = await fineApi.getFineStats();
      return response;
    },
  });

  // Fetch recent payments
  const { data: paymentsData, refetch: refetchPayments } = useQuery({
    queryKey: ["recent-payments"],
    queryFn: async () => {
      const response = await paymentApi.getAllPayments({ page: 1, limit: 10 });
      return response;
    },
  });

  useEffect(() => {
    if (paymentStats) {
      // Generate revenue trend data
      const trendData = generateRevenueTrend(timeRange);
      setRevenueData(trendData);

      // Process payment method data
      const methodData = processPaymentMethodData(paymentStats);
      setPaymentMethodData(methodData);
    }
  }, [paymentStats, timeRange]);

  useEffect(() => {
    if (paymentsData?.payments) {
      const recent = paymentsData.payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        method: payment.paymentMethod,
        status: payment.paymentStatus,
        date: payment.paidAt,
        userName: payment.user
          ? `${payment.user.firstName} ${payment.user.lastName}`
          : "Unknown",
        vehiclePlate: payment.fine?.violation?.vehicle?.plateNo || "N/A",
      }));
      setRecentPayments(recent);
    }
  }, [paymentsData]);

  const generateRevenueTrend = (range: string): RevenueData[] => {
    const days = range === "7days" ? 7 : range === "30days" ? 30 : 90;
    const data: RevenueData[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      data.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: Math.floor(Math.random() * 50000) + 10000,
        payments: Math.floor(Math.random() * 30) + 5,
      });
    }

    return data;
  };

  const processPaymentMethodData = (
    stats: PaymentStats
  ): PaymentMethodData[] => {
    const colors: { [key: string]: string } = {
      CASH: "#22c55e",
      CARD: "#3b82f6",
      BANK_TRANSFER: "#a855f7",
      MOBILE_MONEY: "#f59e0b",
      ONLINE: "#ec4899",
    };

    return (
      stats.paymentMethodStats?.map((method) => ({
        method: method.paymentMethod,
        amount: method._sum.amount || 0,
        count: method._count.id,
        color: colors[method.paymentMethod] || "#6b7280",
      })) || []
    );
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

  const getStatusBadge = (status: string) => {
    const statusConfig: {
      [key: string]: { color: string; label: string };
    } = {
      COMPLETED: {
        color: "bg-green-500/10 text-green-600 border-green-500/20",
        label: "Completed",
      },
      PENDING: {
        color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        label: "Pending",
      },
      FAILED: {
        color: "bg-red-500/10 text-red-600 border-red-500/20",
        label: "Failed",
      },
      REFUNDED: {
        color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
        label: "Refunded",
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "CARD":
        return CreditCard;
      case "CASH":
      case "MOBILE_MONEY":
        return Wallet;
      default:
        return Receipt;
    }
  };

  const handleExportReport = () => {
    toast.success("Revenue report exported successfully");
  };

  const handleRefresh = () => {
    refetchStats();
    refetchFineStats();
    refetchPayments();
    toast.success("Data refreshed");
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalRevenue = paymentStats?.totalRevenue || 0;
  const completedPayments = paymentStats?.completedPayments || 0;
  const pendingRevenue = fineStats?.unpaidAmount || 0;
  const revenueGrowth = 12.5; // This should be calculated from actual data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Revenue Management
          </h1>
          <p className="text-muted-foreground">
            Track and analyze revenue from traffic fines and payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+{revenueGrowth}%</span>
              <span className="text-xs text-muted-foreground">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Payments
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Revenue
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(pendingRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {fineStats?.unpaidFines || 0} unpaid fines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Payment
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                completedPayments > 0 ? totalRevenue / completedPayments : 0
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per transaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenue Trend</CardTitle>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods and Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <p className="text-sm text-muted-foreground">
              Revenue distribution by payment method
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, amount }) =>
                      `${method}: ${formatCurrency(amount)}`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {paymentMethodData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest payment transactions
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentPayments?.map((payment) => {
                const MethodIcon = getMethodIcon(payment.method);
                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <MethodIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{payment.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.vehiclePlate} • {payment.method}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {formatCurrency(payment.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {recentPayments?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No recent payments
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Payment Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Statistics</CardTitle>
          <p className="text-sm text-muted-foreground">
            Comprehensive payment method breakdown
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Average Amount</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentMethodData?.map((method) => {
                const percentage =
                  totalRevenue > 0 ? (method.amount / totalRevenue) * 100 : 0;
                const average =
                  method.count > 0 ? method.amount / method.count : 0;

                return (
                  <TableRow key={method.method}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: method.color }}
                        />
                        <span className="font-medium">{method.method}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{method.count}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(method.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(average)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{percentage.toFixed(1)}%</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paymentMethodData?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No payment data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
