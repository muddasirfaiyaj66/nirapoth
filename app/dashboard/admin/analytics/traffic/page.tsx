"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Filter,
  X,
  Calendar,
  BarChart3,
  Activity,
  Users,
  Target,
  Timer,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchTrafficAnalytics,
  refreshTrafficAnalytics,
  setTimeRange,
  setLocationFilter,
  setViolationTypeFilter,
  clearFilters,
  selectTrafficAnalytics,
  selectTrafficAnalyticsLoading,
  selectTrafficAnalyticsError,
  selectTrafficTimeRange,
  selectTrafficLocationFilter,
  selectTrafficViolationTypeFilter,
  selectTrafficOverview,
  selectTrafficTimeAnalysis,
  selectTrafficLocationAnalysis,
  selectTrafficViolationAnalysis,
  selectTrafficPeakInsights,
  selectTrafficEfficiencyMetrics,
  selectActiveFilters,
} from "@/lib/store/slices/trafficAnalyticsSlice";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#8dd1e1",
  "#d084d0",
  "#ffb347",
  "#87ceeb",
  "#dda0dd",
  "#98fb98",
];

const TIME_RANGE_OPTIONS = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "3months", label: "Last 3 Months" },
  { value: "6months", label: "Last 6 Months" },
  { value: "1year", label: "Last Year" },
];

export default function TrafficAnalyticsPage() {
  const dispatch = useAppDispatch();

  // Redux selectors
  const data = useAppSelector(selectTrafficAnalytics);
  const loading = useAppSelector(selectTrafficAnalyticsLoading);
  const error = useAppSelector(selectTrafficAnalyticsError);
  const timeRange = useAppSelector(selectTrafficTimeRange);
  const locationFilter = useAppSelector(selectTrafficLocationFilter);
  const violationTypeFilter = useAppSelector(selectTrafficViolationTypeFilter);
  const overview = useAppSelector(selectTrafficOverview);
  const timeAnalysis = useAppSelector(selectTrafficTimeAnalysis);
  const locationAnalysis = useAppSelector(selectTrafficLocationAnalysis);
  const violationAnalysis = useAppSelector(selectTrafficViolationAnalysis);
  const peakInsights = useAppSelector(selectTrafficPeakInsights);
  const efficiencyMetrics = useAppSelector(selectTrafficEfficiencyMetrics);
  const activeFilters = useAppSelector(selectActiveFilters);

  // Local state
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data on mount and when filters change
  useEffect(() => {
    dispatch(
      fetchTrafficAnalytics({
        range: timeRange,
        location: locationFilter || undefined,
        violationType: violationTypeFilter || undefined,
      })
    );
  }, [dispatch, timeRange, locationFilter, violationTypeFilter]);

  // Handle time range change
  const handleTimeRangeChange = (newRange: string) => {
    dispatch(setTimeRange(newRange));
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(refreshTrafficAnalytics()).unwrap();
    } catch (error) {
      console.error("Failed to refresh traffic analytics:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle export
  const handleExport = () => {
    if (!data) return;

    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      filters: {
        timeRange,
        location: locationFilter,
        violationType: violationTypeFilter,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `traffic-analytics-${timeRange}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Loading skeleton
  if (loading && !data) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load traffic analytics: {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() =>
                dispatch(fetchTrafficAnalytics({ range: timeRange }))
              }
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data || !overview) return null;

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Traffic Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive traffic violation analysis and insights
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.hasFilters && (
        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Active filters:</span>
          {locationFilter && (
            <Badge variant="secondary" className="gap-1">
              Location: {locationFilter}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => dispatch(setLocationFilter(null))}
              />
            </Badge>
          )}
          {violationTypeFilter && (
            <Badge variant="secondary" className="gap-1">
              Violation: {violationTypeFilter}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => dispatch(setViolationTypeFilter(null))}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearFilters())}
            className="ml-2"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Violations
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(overview.totalViolations || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.dateRange.range} period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Resolution Rate
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(overview.overallResolutionRate || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {overview.totalResolved?.toLocaleString() || 0} resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(overview.totalPending || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting resolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Resolution Time
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(overview.avgResolutionTimeHours || 0) < 24
                ? `${(overview.avgResolutionTimeHours || 0).toFixed(1)}h`
                : `${((overview.avgResolutionTimeHours || 0) / 24).toFixed(
                    1
                  )}d`}
            </div>
            <p className="text-xs text-muted-foreground">
              Average processing time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Peak Insights */}
      {peakInsights && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {peakInsights.peakHour && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {peakInsights.peakHour.timeLabel}
                </div>
                <p className="text-sm text-muted-foreground">
                  {peakInsights.peakHour.count} violations (
                  {(peakInsights.peakHour.percentage || 0).toFixed(1)}%)
                </p>
              </CardContent>
            </Card>
          )}

          {peakInsights.peakDay && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Peak Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {peakInsights.peakDay.day}
                </div>
                <p className="text-sm text-muted-foreground">
                  {peakInsights.peakDay.count} violations
                </p>
              </CardContent>
            </Card>
          )}

          {peakInsights.topViolationType && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Violation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {peakInsights.topViolationType.type}
                </div>
                <p className="text-sm text-muted-foreground">
                  {peakInsights.topViolationType.count} cases
                </p>
              </CardContent>
            </Card>
          )}

          {peakInsights.topLocation && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Hotspot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {peakInsights.topLocation.district}
                </div>
                <p className="text-sm text-muted-foreground">
                  {peakInsights.topLocation.totalViolations} violations
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="patterns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patterns">Time Patterns</TabsTrigger>
          <TabsTrigger value="locations">Location Analysis</TabsTrigger>
          <TabsTrigger value="violations">Violation Types</TabsTrigger>
          <TabsTrigger value="efficiency">Performance</TabsTrigger>
        </TabsList>

        {/* Time Patterns Tab */}
        <TabsContent value="patterns" className="space-y-6">
          {timeAnalysis && (
            <>
              {/* Hourly Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Hourly Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timeAnalysis.hourlyDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Weekly Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timeAnalysis.weeklyDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeAnalysis.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="monthLabel" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="violations"
                        stroke="#8884d8"
                        strokeWidth={2}
                        name="Total Violations"
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Resolved"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Location Analysis Tab */}
        <TabsContent value="locations" className="space-y-6">
          {locationAnalysis && (
            <>
              {/* Location Hotspots */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Hotspots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {locationAnalysis.locationHotspots
                      .slice(0, 10)
                      .map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{index + 1}</Badge>
                            <div>
                              <div className="font-medium">
                                {location.address}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {location.district}, {location.thana}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {location.totalViolations}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {(location.resolutionRate || 0).toFixed(1)}%
                              resolved
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Violations by Location Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Violations by District</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={locationAnalysis.violationsByLocation.slice(0, 15)}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="district" width={100} />
                      <Tooltip />
                      <Bar dataKey="violationCount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Violation Types Tab */}
        <TabsContent value="violations" className="space-y-6">
          {violationAnalysis && (
            <>
              {/* Violation Types Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Violation Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={violationAnalysis.violationsByType.slice(0, 8)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, percentage }) =>
                          `${type} (${(percentage || 0).toFixed(1)}%)`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {violationAnalysis.violationsByType
                          .slice(0, 8)
                          .map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Violation Types Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Violation Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 p-2 text-left">
                            Type
                          </th>
                          <th className="border border-gray-200 p-2 text-left">
                            Code
                          </th>
                          <th className="border border-gray-200 p-2 text-right">
                            Count
                          </th>
                          <th className="border border-gray-200 p-2 text-right">
                            Penalty (BDT)
                          </th>
                          <th className="border border-gray-200 p-2 text-right">
                            Total Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {violationAnalysis.violationsByType.map(
                          (violation, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-200 p-2">
                                {violation.type}
                              </td>
                              <td className="border border-gray-200 p-2">
                                {violation.code}
                              </td>
                              <td className="border border-gray-200 p-2 text-right">
                                {(violation.count || 0).toLocaleString()}
                              </td>
                              <td className="border border-gray-200 p-2 text-right">
                                ৳{(violation.penalty || 0).toLocaleString()}
                              </td>
                              <td className="border border-gray-200 p-2 text-right">
                                ৳
                                {(violation.totalPenalty || 0).toLocaleString()}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {violationAnalysis.violationsByStatus.map(
                      (status, index) => (
                        <div
                          key={index}
                          className="text-center p-4 border rounded-lg"
                        >
                          <div className="text-2xl font-bold mb-2">
                            {status.count?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {status.status || "Unknown"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(status.percentage || 0).toFixed(1)}%
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="efficiency" className="space-y-6">
          {efficiencyMetrics && (
            <>
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Performance Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">
                      {efficiencyMetrics.performanceLevel}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Score:{" "}
                      {(efficiencyMetrics.efficiencyScore || 0).toFixed(0)}/100
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Resolution Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">
                      {(efficiencyMetrics.resolutionRate || 0).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Overall completion rate
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg Resolution Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">
                      {(efficiencyMetrics.avgResolutionTimeDays || 0).toFixed(
                        1
                      )}{" "}
                      days
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(efficiencyMetrics.avgResolutionTimeHours || 0).toFixed(
                        1
                      )}{" "}
                      hours
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Chart */}
              {timeAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resolution Rate Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={timeAnalysis.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="monthLabel" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="resolutionRate"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
