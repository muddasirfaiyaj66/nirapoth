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
  BarChart3,
  Users,
  Shield,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Camera,
  AlertTriangle,
  FileText,
  Download,
  RefreshCw,
  Server,
  Cpu,
  HardDrive,
  Clock,
  Zap,
  Eye,
  Settings,
  Database,
  Wifi,
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
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchSystemAnalytics,
  selectSystemAnalytics,
  selectSystemAnalyticsLoading,
  selectSystemAnalyticsError,
  selectSystemOverview,
  selectViolationMetrics,
  selectUserMetrics,
  selectRevenueMetrics,
  selectTimeSeriesData,
  selectSystemHealthMetrics,
} from "@/lib/store/slices/systemAnalyticsSlice";

export default function SystemDashboard() {
  const dispatch = useAppDispatch();
  const [timeRange, setTimeRange] = useState("6months");
  const [refreshing, setRefreshing] = useState(false);

  // Redux selectors
  const data = useAppSelector(selectSystemAnalytics);
  const loading = useAppSelector(selectSystemAnalyticsLoading);
  const error = useAppSelector(selectSystemAnalyticsError);
  const overview = useAppSelector(selectSystemOverview);
  const violationMetrics = useAppSelector(selectViolationMetrics);
  const userMetrics = useAppSelector(selectUserMetrics);
  const revenueMetrics = useAppSelector(selectRevenueMetrics);
  const timeSeriesData = useAppSelector(selectTimeSeriesData);
  const systemHealth = useAppSelector(selectSystemHealthMetrics);

  useEffect(() => {
    dispatch(fetchSystemAnalytics(timeRange));
  }, [dispatch, timeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchSystemAnalytics(timeRange));
    setRefreshing(false);
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  // Loading skeleton
  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error loading system dashboard: {error}
          </AlertDescription>
        </Alert>
        <Button onClick={handleRefresh} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">System Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            System overview, performance metrics, and health monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
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

          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            size="sm"
            variant="outline"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Status */}
      {systemHealth && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-green-600" />
              System Health Status
              <Badge
                variant="secondary"
                className="ml-auto bg-green-100 text-green-800"
              >
                Operational
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Cpu className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">CPU Usage</div>
                <div className="text-lg font-bold">
                  {systemHealth.cpuUsage}%
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <HardDrive className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">Memory</div>
                <div className="text-lg font-bold">
                  {systemHealth.memoryUsage}%
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-sm font-medium">Uptime</div>
                <div className="text-lg font-bold">{systemHealth.uptime}h</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                <div className="text-sm font-medium">Response</div>
                <div className="text-lg font-bold">
                  {systemHealth.responseTime}ms
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Wifi className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium">Connections</div>
                <div className="text-lg font-bold">
                  {systemHealth.activeConnections}
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Database className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                <div className="text-sm font-medium">Total Memory</div>
                <div className="text-lg font-bold">
                  {(systemHealth.totalMemory / 1024).toFixed(1)}GB
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Overview */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.totalUsers?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Active system users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Violations
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.totalViolations?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Recorded violations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ৳{overview.totalRevenue?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">Generated revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Complaints
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.totalComplaints?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">Filed complaints</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        {timeSeriesData?.userGrowth && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                User Growth Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData.userGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Violation Trends */}
        {timeSeriesData?.violationTrend && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Violation Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData.violationTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* User Role Distribution */}
        {userMetrics?.byRole && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Role Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userMetrics.byRole || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ role, count }) => `${role}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {userMetrics.byRole?.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || `hsl(${index * 45}, 70%, 60%)`}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Monthly Performance */}
        {timeSeriesData?.monthlyPerformance && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeSeriesData.monthlyPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="violations" fill="#8884d8" name="Violations" />
                  <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Violation Status Breakdown */}
        {violationMetrics?.byStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Violation Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {violationMetrics?.byStatus?.map((status: any) => (
                  <div
                    key={status.status}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="capitalize text-sm">
                        {status.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {status.count?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(status.percentage || 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Revenue Breakdown */}
        {revenueMetrics?.byStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenue Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {revenueMetrics?.byStatus?.map((status: any) => (
                  <div
                    key={status.status}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="capitalize text-sm">
                        {status.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {status.count?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(status.percentage || 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export System Report
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                View System Logs
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Camera className="h-4 w-4 mr-2" />
                Camera Status
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                System Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      {overview?.lastUpdated && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Last updated: {new Date(overview.lastUpdated).toLocaleString()}
              </span>
              <Badge variant="outline">Live Data</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
