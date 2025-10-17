"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { DashboardWrapper } from "@/components/dashboard/DashboardWrapper";
import { toast } from "sonner";
import { policeApi, PoliceStats, PoliceAnalytics } from "@/lib/api/police";

export default function PoliceDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<PoliceStats | null>(null);
  const [analytics, setAnalytics] = useState<PoliceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "POLICE") {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, analyticsResponse] = await Promise.all([
        policeApi.getStats(),
        policeApi.getAnalytics(),
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
        console.log("✅ Police stats loaded:", statsResponse.data);
      }

      if (analyticsResponse.success && analyticsResponse.data) {
        setAnalytics(analyticsResponse.data);
        console.log("✅ Police analytics loaded:", analyticsResponse.data);
      }
    } catch (error) {
      console.error("Failed to load police dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
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

  if (!user || user.role !== "POLICE") {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            This dashboard is only accessible to police officers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardWrapper
      title="Police Dashboard"
      description={`Welcome back, Officer ${user?.firstName}! Monitor violations and manage fines.`}
    >
      <div className="flex items-center justify-end mb-4">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Shield className="h-3 w-3 mr-1" />
          Police Officer
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Violations
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.pendingViolations || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved Violations
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.resolvedViolations || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Verified cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fines Issued</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalFinesIssued || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.paidFines || 0} paid • {stats?.unpaidFines || 0} unpaid
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Citizen Reports
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pendingReports || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.approvedReports || 0} approved
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Violations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Violations</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentViolations && stats.recentViolations.length > 0 ? (
            <div className="space-y-4">
              {stats.recentViolations.map((violation) => (
                <div
                  key={violation.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-semibold">{violation.plateNo}</p>
                      <p className="text-sm text-muted-foreground">
                        {violation.vehicleInfo}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{violation.violation}</p>
                    <p className="text-sm text-muted-foreground">
                      ৳{violation.penalty}
                    </p>
                  </div>
                  <Badge
                    variant={
                      violation.status === "VERIFIED" ? "default" : "secondary"
                    }
                  >
                    {violation.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent violations
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
              <AlertTriangle className="h-6 w-6" />
              <span>View Violations</span>
            </Button>
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <DollarSign className="h-6 w-6" />
              <span>Issue Fine</span>
            </Button>
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Review Reports</span>
            </Button>
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <AlertCircle className="h-6 w-6" />
              <span>Emergency Response</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardWrapper>
  );
}
