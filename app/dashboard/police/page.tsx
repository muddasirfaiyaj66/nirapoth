"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  AlertTriangle,
  Camera,
  FileText,
  Activity,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { DashboardWrapper } from "@/components/dashboard/DashboardWrapper";

interface PoliceStats {
  totalViolations: number;
  pendingViolations: number;
  resolvedViolations: number;
  activePatrols: number;
  emergencyCalls: number;
  completedReports: number;
}

export default function PoliceDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();

  // Mock data for now - replace with actual API calls
  const stats: PoliceStats = {
    totalViolations: 156,
    pendingViolations: 23,
    resolvedViolations: 133,
    activePatrols: 8,
    emergencyCalls: 5,
    completedReports: 89,
  };

  const recentViolations = [
    {
      id: "1",
      plateNo: "DHA-1234",
      violation: "Speeding",
      location: "Dhanmondi 27",
      time: new Date().toISOString(),
      status: "PENDING",
    },
    {
      id: "2",
      plateNo: "DHA-5678",
      violation: "Red light violation",
      location: "Gulshan 1",
      time: new Date(Date.now() - 3600000).toISOString(),
      status: "CONFIRMED",
    },
  ];

  if (authLoading) {
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            Please log in to access the police dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardWrapper
      title="Police Dashboard"
      description={`Welcome back, Officer ${user?.firstName}! Monitor traffic violations and manage patrols.`}
    >
      <div className="flex items-center justify-end mb-4">
        <Badge variant="secondary">Police Officer</Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Violations
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViolations}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.pendingViolations} pending review
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedViolations}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(
                (stats.resolvedViolations / stats.totalViolations) * 100
              )}
              % success rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Patrols
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePatrols}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Currently on duty
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Emergency Calls
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.emergencyCalls}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Today's calls
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Violations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentViolations.map((violation) => (
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
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {violation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {violation.violation} - {violation.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(violation.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Report New Violation
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Camera className="mr-2 h-4 w-4" />
              View Camera Feeds
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Start Patrol
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Violations Reported</span>
              <Badge variant="default">{stats.totalViolations}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Review</span>
              <Badge variant="destructive">{stats.pendingViolations}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed Reports</span>
              <Badge variant="default">{stats.completedReports}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">System Status</CardTitle>
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
              <span className="text-sm">Emergency Line</span>
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
              <Badge variant="default">&lt; 2 min</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Accuracy Rate</span>
              <Badge variant="default">94.2%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <Badge variant="default">99.1%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardWrapper>
  );
}
