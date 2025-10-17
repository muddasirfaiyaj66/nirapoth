"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  Wallet,
  Award,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { DashboardWrapper } from "@/components/dashboard/DashboardWrapper";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchCitizenAnalytics } from "@/lib/store/slices/citizenAnalyticsSlice";
import { ViolationsChart } from "@/components/dashboard/citizen/ViolationsChart";
import { FinesChart } from "@/components/dashboard/citizen/FinesChart";
import { RewardsChart } from "@/components/dashboard/citizen/RewardsChart";
import { RecentActivityList } from "@/components/dashboard/citizen/RecentActivityList";

export default function CitizenDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const dispatch = useAppDispatch();

  // Get analytics from Redux store
  const { analytics, loading, error } = useAppSelector(
    (state) => state.citizenAnalytics
  );

  useEffect(() => {
    if (user && !analytics) {
      console.log(
        "🔄 Citizen Dashboard: Fetching analytics for user:",
        user.id
      );
      dispatch(fetchCitizenAnalytics());
    }
  }, [user, dispatch, analytics]);

  // Log analytics data whenever it changes
  useEffect(() => {
    if (analytics) {
      console.log("====== DASHBOARD: DISPLAYING DATA ======");
      console.log("📈 Displaying Current Balance:", analytics.currentBalance);
      console.log("💰 Displaying Total Rewards:", analytics.totalRewards);
      console.log("⚠️ Displaying Total Penalties:", analytics.totalPenalties);
      console.log("📝 Displaying Total Reports:", analytics.totalReports);
      console.log("✅ Displaying Approved Reports:", analytics.approvedReports);
      console.log(
        "🔴 Violations chart data points:",
        analytics.violationsOverview?.length || 0
      );
      console.log(
        "💵 Fines chart data points:",
        analytics.finesAnalytics?.length || 0
      );
      console.log(
        "📊 Rewards chart data points:",
        analytics.rewardsOverTime?.length || 0
      );
      console.log("⏰ Activity items:", analytics.recentActivity?.length || 0);
      console.log("========================================");
    }
  }, [analytics]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            Please log in to access your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardWrapper
      title="My Dashboard"
      description={`Welcome back, ${user?.firstName}! Track your violations, fines, and rewards.`}
    >
      <div className="flex items-center justify-between mb-6">
        <Badge variant="secondary" className="text-sm">
          Citizen Dashboard
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(fetchCitizenAnalytics())}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                (analytics?.currentBalance || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              ৳{(analytics?.currentBalance || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ৳{(analytics?.totalRewards || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From citizen reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Penalties</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ৳{(analytics?.totalPenalties || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total deductions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.totalReports || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics?.approvedReports || 0} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.violationsOverview?.reduce(
                (sum, v) => sum + v.count,
                0
              ) || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ViolationsChart data={analytics?.violationsOverview || []} />
        <FinesChart data={analytics?.finesAnalytics || []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RewardsChart data={analytics?.rewardsOverTime || []} />
        <RecentActivityList data={analytics?.recentActivity || []} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              className="h-auto flex-col gap-2 py-4"
              variant="outline"
              onClick={() =>
                (window.location.href = "/dashboard/citizen/vehicles")
              }
            >
              <Car className="h-6 w-6" />
              <span>My Vehicles</span>
            </Button>
            <Button
              className="h-auto flex-col gap-2 py-4"
              variant="outline"
              onClick={() =>
                (window.location.href = "/dashboard/citizen/report-violation")
              }
            >
              <AlertTriangle className="h-6 w-6" />
              <span>Report Violation</span>
            </Button>
            <Button
              className="h-auto flex-col gap-2 py-4"
              variant="outline"
              onClick={() =>
                (window.location.href = "/dashboard/citizen/fines")
              }
            >
              <DollarSign className="h-6 w-6" />
              <span>Pay Fines</span>
            </Button>
            <Button
              className="h-auto flex-col gap-2 py-4"
              variant="outline"
              onClick={() =>
                (window.location.href = "/dashboard/citizen/rewards")
              }
            >
              <TrendingUp className="h-6 w-6" />
              <span>My Rewards</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardWrapper>
  );
}
