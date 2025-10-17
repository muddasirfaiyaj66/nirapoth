"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car,
  AlertTriangle,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  Plus,
  Eye,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { DashboardWrapper } from "@/components/dashboard/DashboardWrapper";
import { citizenApi, type CitizenStats } from "@/lib/api/citizen";
import { toast } from "sonner";

export default function CitizenDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<CitizenStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await citizenApi.getStats();
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          toast.error("Failed to load dashboard statistics");
        }
      } catch (error) {
        console.error("Error fetching citizen stats:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      description={`Welcome back, ${user?.firstName}! Manage your vehicles and track violations.`}
    >
      <div className="flex items-center justify-end mb-4">
        <Badge variant="secondary">Citizen</Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalVehicles || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.activeVehicles || 0} active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalViolations || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.pendingViolations || 0} pending
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{(stats?.totalFines || 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ৳{(stats?.paidFines || 0).toLocaleString()} paid
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ৳{(stats?.totalRewards || 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              From citizen reports
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.submittedComplaints || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.resolvedComplaints || 0} approved
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Vehicles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Vehicles</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Vehicle
            </Button>
          </CardHeader>
          <CardContent>
            {stats?.myVehicles && stats.myVehicles.length > 0 ? (
              <div className="space-y-3">
                {stats.myVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{vehicle.plateNo}</span>
                        <Badge
                          variant={vehicle.isActive ? "default" : "secondary"}
                        >
                          {vehicle.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No vehicles registered yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Violations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Violations</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentViolations && stats.recentViolations.length > 0 ? (
              <div className="space-y-3">
                {stats.recentViolations.map((violation) => (
                  <div
                    key={violation.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{violation.plateNo}</span>
                        <Badge
                          variant={
                            violation.status === "PENDING"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {violation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {violation.violation} - ৳
                        {violation.fineAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(violation.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent violations
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <Car className="h-6 w-6" />
              <span>Register Vehicle</span>
            </Button>
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <AlertTriangle className="h-6 w-6" />
              <span>Report Violation</span>
            </Button>
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Submit Complaint</span>
            </Button>
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <DollarSign className="h-6 w-6" />
              <span>Pay Fines</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Outstanding Fines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Due</span>
              <Badge variant="destructive">
                ৳{(stats?.unpaidFines || 0).toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Paid Amount</span>
              <Badge variant="default">
                ৳{(stats?.paidFines || 0).toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment Status</span>
              <Badge variant="secondary">
                {(stats?.unpaidFines || 0) === 0 ? "Up to date" : "Pending"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Vehicle Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Vehicles</span>
              <Badge variant="default">{stats?.activeVehicles || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Inactive Vehicles</span>
              <Badge variant="secondary">
                {(stats?.totalVehicles || 0) - (stats?.activeVehicles || 0)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Registration Status</span>
              <Badge variant="default" className="bg-green-500">
                Valid
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Complaints Submitted</span>
              <Badge variant="default">{stats?.submittedComplaints || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Complaints Resolved</span>
              <Badge variant="default">{stats?.resolvedComplaints || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Response Time</span>
              <Badge variant="default">&lt; 24 hours</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardWrapper>
  );
}
