"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Camera,
  FileText,
  Settings,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { DashboardWrapper } from "@/components/dashboard/DashboardWrapper";
import { useDashboardStats } from "@/lib/hooks/useDashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    data: dashboardData,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  const recentActivity = [
    {
      id: "1",
      type: "violation",
      description: "New traffic violation reported",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      type: "user",
      description: "New user registered",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      type: "complaint",
      description: "Complaint resolved",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  if (authLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
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

  if (statsError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard data. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            Please log in to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardWrapper
      title="Admin Dashboard"
      description={`Welcome back, ${user?.firstName}! Here's your system overview.`}
    >
      <div className="flex items-center justify-end mb-4">
        <Badge variant="secondary">
          {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.totalUsers || 0}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+12.5%</span>
              <span className="text-xs text-muted-foreground">
                vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.totalViolations || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {dashboardData?.pendingReports || 0} pending review
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{dashboardData?.totalRevenue?.toLocaleString() || 0}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+8.7%</span>
              <span className="text-xs text-muted-foreground">
                vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Cameras
            </CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.activeCameras || 0}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-600">98.5%</span>
              <span className="text-xs text-muted-foreground">uptime</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/admin/users">
              <Button
                variant="outline"
                className="w-full h-auto flex-col gap-2 py-4"
              >
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
            </Link>

            <Link href="/dashboard/admin/violations">
              <Button
                variant="outline"
                className="w-full h-auto flex-col gap-2 py-4"
              >
                <Shield className="h-6 w-6" />
                <span>Review Violations</span>
              </Button>
            </Link>

            <Link href="/dashboard/admin/analytics">
              <Button
                variant="outline"
                className="w-full h-auto flex-col gap-2 py-4"
              >
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </Link>

            {user?.role === "SUPER_ADMIN" && (
              <Link href="/dashboard/admin/system/config">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4"
                >
                  <Settings className="h-6 w-6" />
                  <span>System Config</span>
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Violations</span>
              <Badge variant="destructive">
                {dashboardData?.pendingReports || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Unresolved Complaints</span>
              <Badge variant="secondary">
                {dashboardData?.totalComplaints || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">System Alerts</span>
              <Badge variant="secondary">0</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Camera Network</span>
              <Badge variant="default" className="bg-green-500">
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="default" className="bg-green-500">
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Status</span>
              <Badge variant="default" className="bg-green-500">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Response Time</span>
              <Badge variant="default">&lt; 200ms</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <Badge variant="default">99.8%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Success Rate</span>
              <Badge variant="default">99.5%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardWrapper>
  );
}
