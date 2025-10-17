"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flame,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Activity,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { DashboardWrapper } from "@/components/dashboard/DashboardWrapper";
import { toast } from "sonner";
import {
  fireServiceApi,
  FireServiceStats,
  FireServiceAnalytics,
} from "@/lib/api/fireService";

export default function FireServiceDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<FireServiceStats | null>(null);
  const [analytics, setAnalytics] = useState<FireServiceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "FIRE_SERVICE") {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, analyticsResponse] = await Promise.all([
        fireServiceApi.getStats(),
        fireServiceApi.getAnalytics(),
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
        console.log("✅ Fire service stats loaded:", statsResponse.data);
      }

      if (analyticsResponse.success && analyticsResponse.data) {
        setAnalytics(analyticsResponse.data);
        console.log(
          "✅ Fire service analytics loaded:",
          analyticsResponse.data
        );
      }
    } catch (error) {
      console.error("Failed to load fire service dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
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

  if (!user || user.role !== "FIRE_SERVICE") {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            This dashboard is only accessible to fire service personnel.
          </p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "HIGH":
      case "CRITICAL":
        return "text-red-600";
      case "MEDIUM":
        return "text-orange-600";
      case "LOW":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <DashboardWrapper
      title="Fire Service Dashboard"
      description={`Welcome back, ${user?.firstName}! Monitor emergency incidents and response operations.`}
    >
      <div className="flex items-center justify-end mb-4">
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <Flame className="h-3 w-3 mr-1" />
          Fire Service
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Emergencies
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.activeEmergencies || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved Incidents
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.resolvedEmergencies || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully handled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Emergencies
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalEmergencies || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Emergencies */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Emergencies</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentEmergencies && stats.recentEmergencies.length > 0 ? (
            <div className="space-y-4">
              {stats.recentEmergencies.map((emergency) => (
                <div
                  key={emergency.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <Flame
                      className={`h-5 w-5 mt-0.5 ${getSeverityColor(
                        emergency.severity
                      )}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="font-semibold">{emergency.location}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {emergency.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(emergency.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge
                      className={
                        emergency.severity === "HIGH" ||
                        emergency.severity === "CRITICAL"
                          ? "bg-red-100 text-red-800"
                          : emergency.severity === "MEDIUM"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {emergency.severity}
                    </Badge>
                    <Badge
                      variant={
                        emergency.status === "RESOLVED"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {emergency.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent emergencies
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <AlertCircle className="h-6 w-6" />
              <span>Active Incidents</span>
            </Button>
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <Flame className="h-6 w-6" />
              <span>Report Incident</span>
            </Button>
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <MapPin className="h-6 w-6" />
              <span>Location Map</span>
            </Button>
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <Activity className="h-6 w-6" />
              <span>Response History</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardWrapper>
  );
}
