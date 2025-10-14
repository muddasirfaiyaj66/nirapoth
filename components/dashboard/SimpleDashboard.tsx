"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/loading-skeleton";
import {
  Car,
  AlertTriangle,
  Users,
  DollarSign,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardData {
  vehicles: any[];
  violations: any[];
  complaints: any[];
  payments: any[];
}

export function SimpleDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData>({
    vehicles: [],
    violations: [],
    complaints: [],
    payments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API calls - replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for now
      setData({
        vehicles: [
          {
            id: 1,
            plateNo: "DHA-1234",
            brand: "Toyota",
            model: "Corolla",
            year: 2020,
            isActive: true,
          },
          {
            id: 2,
            plateNo: "DHA-5678",
            brand: "Honda",
            model: "Civic",
            year: 2019,
            isActive: false,
          },
        ],
        violations: [
          {
            id: 1,
            description: "Speeding",
            status: "PENDING",
            fineAmount: 5000,
          },
          {
            id: 2,
            description: "Red light violation",
            status: "CONFIRMED",
            fineAmount: 3000,
          },
        ],
        complaints: [
          {
            id: 1,
            title: "Traffic jam",
            description: "Heavy traffic on main road",
            status: "PENDING",
          },
        ],
        payments: [
          {
            id: 1,
            amount: 5000,
            paymentMethod: "bKash",
            paymentStatus: "COMPLETED",
            paidAt: new Date(),
          },
        ],
      });
    } catch (err) {
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    toast.success("Data refreshed");
  };

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please log in to access the dashboard.
        </AlertDescription>
      </Alert>
    );
  }

  const stats = {
    totalVehicles: data.vehicles.length,
    totalViolations: data.violations.length,
    totalComplaints: data.complaints.length,
    totalPayments: data.payments.length,
    totalFines: data.violations.reduce(
      (sum, v) => sum + (v.fineAmount || 0),
      0
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your account today.
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Vehicles"
          value={stats.totalVehicles}
          icon={Car}
          description="Registered vehicles"
        />
        <StatsCard
          title="Violations"
          value={stats.totalViolations}
          icon={AlertTriangle}
          description="Traffic violations"
        />
        <StatsCard
          title="Complaints"
          value={stats.totalComplaints}
          icon={Users}
          description="Submitted complaints"
        />
        <StatsCard
          title="Total Fines"
          value={`৳${stats.totalFines.toLocaleString()}`}
          icon={DollarSign}
          description="Outstanding fines"
        />
      </div>

      {/* Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle>Your Vehicles</CardTitle>
            <CardDescription>
              Registered vehicles in your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : data.vehicles.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No vehicles registered
              </p>
            ) : (
              <div className="space-y-2">
                {data.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <p className="font-medium">{vehicle.plateNo}</p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                      </p>
                    </div>
                    <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                      {vehicle.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Violations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Violations</CardTitle>
            <CardDescription>Your traffic violations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : data.violations.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No violations found
              </p>
            ) : (
              <div className="space-y-2">
                {data.violations.map((violation) => (
                  <div
                    key={violation.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <p className="font-medium">{violation.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Fine: ৳{violation.fineAmount?.toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        violation.status === "PENDING"
                          ? "secondary"
                          : violation.status === "CONFIRMED"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {violation.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
