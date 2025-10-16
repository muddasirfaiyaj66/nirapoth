"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
  BarChart3,
  RefreshCw,
  Download,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Banknote,
  Receipt,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchRevenueAnalytics,
  refreshRevenueAnalytics,
  setTimeRange,
  setGranularity,
  clearError,
  selectRevenueAnalytics,
  selectRevenueAnalyticsLoading,
  selectRevenueAnalyticsError,
  selectRevenueTimeRange,
  selectRevenueGranularity,
  selectRevenueOverview,
  selectRevenueTimeSeriesData,
  selectRevenueDistributionData,
  selectRevenueGrowthMetrics,
  selectRevenueCollectionMetrics,
} from "@/lib/store/slices/revenueAnalyticsSlice";

const RevenueAnalyticsPage = () => {
  const dispatch = useAppDispatch();
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  // Redux state
  const revenueData = useAppSelector(selectRevenueAnalytics);
  const loading = useAppSelector(selectRevenueAnalyticsLoading);
  const error = useAppSelector(selectRevenueAnalyticsError);
  const selectedTimeRange = useAppSelector(selectRevenueTimeRange);
  const selectedGranularity = useAppSelector(selectRevenueGranularity);
  const revenueOverview = useAppSelector(selectRevenueOverview);
  const timeSeriesData = useAppSelector(selectRevenueTimeSeriesData);
  const distributionData = useAppSelector(selectRevenueDistributionData);
  const growthMetrics = useAppSelector(selectRevenueGrowthMetrics);
  const collectionMetrics = useAppSelector(selectRevenueCollectionMetrics);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(
      fetchRevenueAnalytics({
        range: selectedTimeRange,
        granularity: selectedGranularity,
      })
    );
  }, [dispatch, selectedTimeRange, selectedGranularity]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        dispatch(refreshRevenueAnalytics());
      }, 60000); // Refresh every minute for revenue data

      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh, dispatch]);

  const handleTimeRangeChange = (range: string) => {
    dispatch(setTimeRange(range));
  };

  const handleGranularityChange = (granularity: string) => {
    dispatch(setGranularity(granularity));
  };

  const handleRefresh = () => {
    dispatch(refreshRevenueAnalytics());
  };

  const handleExportData = () => {
    if (revenueData) {
      const dataStr = JSON.stringify(revenueData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `revenue-analytics-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("BDT", "৳");
  };

  if (loading && !revenueData) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error loading revenue analytics: {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => {
                dispatch(clearError());
                dispatch(
                  fetchRevenueAnalytics({
                    range: selectedTimeRange,
                    granularity: selectedGranularity,
                  })
                );
              }}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Revenue Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive revenue tracking and financial analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedTimeRange}
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedGranularity}
            onValueChange={handleGranularityChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-green-50 border-green-200" : ""}
          >
            <Activity
              className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-pulse" : ""}`}
            />
            Auto Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      {revenueOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(revenueOverview.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {revenueOverview.totalFines} fines
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Collection Rate
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {revenueOverview.collectionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Payment success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Fine
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(revenueOverview.avgFineAmount)}
              </div>
              <p className="text-xs text-muted-foreground">Per violation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Growth
              </CardTitle>
              {revenueOverview.revenueGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  revenueOverview.revenueGrowth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {revenueOverview.revenueGrowth >= 0 ? "+" : ""}
                {revenueOverview.revenueGrowth.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Compared to last month
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Collection Metrics */}
      {collectionMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Collected Revenue
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(collectionMetrics.collectedRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully collected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Revenue
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(collectionMetrics.pendingRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Collection Efficiency
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {collectionMetrics.collectionEfficiency.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Of total potential
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Revenue Trend Chart */}
      {timeSeriesData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Trend - {selectedGranularity}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={timeSeriesData.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={
                    selectedGranularity === "monthly" ? "monthLabel" : "date"
                  }
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue"
                      ? formatCurrency(value as number)
                      : value,
                    name === "revenue" ? "Revenue" : "Fines Count",
                  ]}
                />
                <Legend />
                <Bar
                  yAxisId="right"
                  dataKey="fines"
                  fill="#82ca9d"
                  name="Fines Count"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="Revenue (৳)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Distribution Charts */}
      {distributionData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Method Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Revenue by Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={distributionData.paymentMethodDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, percentage }) =>
                      `${method}: ${percentage.toFixed(1)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {distributionData.paymentMethodDistribution.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${index * 60}, 70%, 50%)`}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Violation Types by Revenue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Top Violations by Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distributionData.topViolationTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="type"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Bar dataKey="revenue" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fine Status and Violation Revenue Details */}
      {distributionData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fine Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Revenue by Fine Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {distributionData.finesByStatus.map((status) => (
                  <div
                    key={status.status}
                    className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          status.status === "PAID" ? "default" : "secondary"
                        }
                        className={
                          status.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {status.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ({status.count} fines)
                      </span>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(status.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Violation Revenue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Detailed Violation Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {distributionData.violationRevenueData
                  .slice(0, 10)
                  .map((violation, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{violation.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {violation.count} violations • Avg:{" "}
                          {formatCurrency(violation.avgFine)}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency(violation.revenue)}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated:{" "}
        {revenueData?.generatedAt
          ? new Date(revenueData.generatedAt).toLocaleString()
          : "Never"}
      </div>
    </div>
  );
};

export default RevenueAnalyticsPage;
