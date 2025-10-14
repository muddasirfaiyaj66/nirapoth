"use client";

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
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { DashboardWrapper } from "@/components/dashboard/DashboardWrapper";

interface CitizenStats {
  totalVehicles: number;
  activeVehicles: number;
  totalViolations: number;
  pendingViolations: number;
  totalFines: number;
  paidFines: number;
  submittedComplaints: number;
  resolvedComplaints: number;
}

export default function CitizenDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();

  // Mock data for now - replace with actual API calls
  const stats: CitizenStats = {
    totalVehicles: 3,
    activeVehicles: 2,
    totalViolations: 5,
    pendingViolations: 2,
    totalFines: 15000,
    paidFines: 8000,
    submittedComplaints: 2,
    resolvedComplaints: 1,
  };

  const recentViolations = [
    {
      id: "1",
      plateNo: "DHA-1234",
      violation: "Speeding",
      fineAmount: 5000,
      date: new Date().toISOString(),
      status: "PENDING",
    },
    {
      id: "2",
      plateNo: "DHA-1234",
      violation: "Red light violation",
      fineAmount: 3000,
      date: new Date(Date.now() - 86400000).toISOString(),
      status: "PAID",
    },
  ];

  const myVehicles = [
    {
      id: "1",
      plateNo: "DHA-1234",
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      isActive: true,
    },
    {
      id: "2",
      plateNo: "DHA-5678",
      brand: "Honda",
      model: "Civic",
      year: 2019,
      isActive: false,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.activeVehicles} active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViolations}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.pendingViolations} pending
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
              ৳{stats.totalFines.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ৳{stats.paidFines.toLocaleString()} paid
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Complaints</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.submittedComplaints}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.resolvedComplaints} resolved
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
            <div className="space-y-3">
              {myVehicles.map((vehicle) => (
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
          </CardContent>
        </Card>

        {/* Recent Violations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
                ৳{(stats.totalFines - stats.paidFines).toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Paid Amount</span>
              <Badge variant="default">
                ৳{stats.paidFines.toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment Status</span>
              <Badge variant="secondary">
                {stats.paidFines >= stats.totalFines ? "Up to date" : "Pending"}
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
              <Badge variant="default">{stats.activeVehicles}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Inactive Vehicles</span>
              <Badge variant="secondary">
                {stats.totalVehicles - stats.activeVehicles}
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
              <Badge variant="default">{stats.submittedComplaints}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Complaints Resolved</span>
              <Badge variant="default">{stats.resolvedComplaints}</Badge>
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
