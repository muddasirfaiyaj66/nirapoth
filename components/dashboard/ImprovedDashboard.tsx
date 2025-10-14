"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import {
  DashboardSkeleton,
  LoadingSpinner,
} from "@/components/ui/loading-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Car,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Activity,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

// Import the new API hooks
import {
  useDashboardStats,
  useViolationData,
  useRevenueData,
  useRoadCongestionData,
  usePoliceStationData,
  useUserSubmissionData,
  useUserRoleData,
  useViolationTypeData,
  useCaseSourceData,
  useComplaintStatusData,
  useFineStatusData,
  useEmergencyResponseData,
  useTopCitizensData,
} from "@/lib/hooks/useDashboard";

// Use the same interface as the hook
import type { DashboardStats } from "@/lib/hooks/useDashboard";

export function ImprovedDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Use React Query hooks for data fetching
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStats();

  const {
    data: violationData,
    isLoading: violationLoading,
    error: violationError,
    refetch: refetchViolations,
  } = useViolationData();

  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError,
    refetch: refetchRevenue,
  } = useRevenueData();

  // Calculate loading state
  const isLoading = statsLoading || violationLoading || revenueLoading;

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchStats(),
        refetchViolations(),
        refetchRevenue(),
      ]);
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
    }
  };

  // Check for errors
  const hasError = statsError || violationError || revenueError;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your account today.
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Error Alert */}
        {hasError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some data couldn't be loaded. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Vehicles"
            value={dashboardStats?.totalVehicles || 0}
            icon={Car}
            description="Registered vehicles"
            error={!!statsError}
          />
          <StatsCard
            title="Violations"
            value={dashboardStats?.totalViolations || 0}
            icon={AlertTriangle}
            description="Traffic violations"
            error={!!statsError}
          />
          <StatsCard
            title="Complaints"
            value={dashboardStats?.totalComplaints || 0}
            icon={Users}
            description="Submitted complaints"
            error={!!statsError}
          />
          <StatsCard
            title="Total Fines"
            value={`৳${dashboardStats?.totalFines?.toLocaleString() || 0}`}
            icon={DollarSign}
            description="Outstanding fines"
            error={!!statsError}
          />
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest actions and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          Vehicle registered
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          Violation reported
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Car className="mr-2 h-4 w-4" />
                    Register New Vehicle
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report Violation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Submit Complaint
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Make Payment
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Violation Trends</CardTitle>
                  <CardDescription>Violations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {violationLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <LoadingSpinner />
                    </div>
                  ) : violationError ? (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Failed to load violation data
                    </div>
                  ) : violationData ? (
                    <div className="h-64 flex items-end justify-between space-x-2">
                      {violationData.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className="bg-green-500 rounded-t w-full"
                            style={{
                              height: `${
                                (item.violations /
                                  Math.max(
                                    ...violationData.map((d) => d.violations)
                                  )) *
                                100
                              }%`,
                              minHeight: "4px",
                            }}
                          />
                          <div className="text-xs text-muted-foreground mt-2">
                            {item.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Revenue and fines over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {revenueLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <LoadingSpinner />
                    </div>
                  ) : revenueError ? (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Failed to load revenue data
                    </div>
                  ) : revenueData ? (
                    <div className="h-64 flex items-end justify-between space-x-2">
                      {revenueData.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className="bg-green-500 rounded-t w-full"
                            style={{
                              height: `${
                                (item.revenue /
                                  Math.max(
                                    ...revenueData.map((d) => d.revenue)
                                  )) *
                                100
                              }%`,
                              minHeight: "4px",
                            }}
                          />
                          <div className="text-xs text-muted-foreground mt-2">
                            {item.month}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <CardTitle>Vehicles</CardTitle>
                <CardDescription>Your registered vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vehicle management coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="violations">
            <Card>
              <CardHeader>
                <CardTitle>Violations</CardTitle>
                <CardDescription>Your traffic violations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Violation management coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle>Complaints</CardTitle>
                <CardDescription>Your submitted complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Complaint management coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>Your payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Payment management coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  error,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  error?: boolean;
}) {
  return (
    <Card className={error ? "border-destructive" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {error && (
          <Badge variant="destructive" className="mt-2">
            Error loading
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

// Tab Components
function VehiclesTab({ data, loading, error }: any) {
  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading vehicles</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Vehicles</h3>
      {data?.data?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No vehicles registered yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data?.data?.map((vehicle: any) => (
            <Card key={vehicle.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{vehicle.plateNo}</h4>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </p>
                  </div>
                  <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                    {vehicle.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ViolationsTab({ data, loading, error }: any) {
  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading violations</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Traffic Violations</h3>
      {data?.data?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No violations found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data?.data?.map((violation: any) => (
            <Card key={violation.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">
                      {violation.rule?.title || "Unknown Rule"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {violation.vehicle?.plateNo} - {violation.description}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ComplaintsTab({ data, loading, error }: any) {
  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading complaints</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Complaints</h3>
      {data?.data?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No complaints submitted yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data?.data?.map((complaint: any) => (
            <Card key={complaint.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{complaint.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {complaint.description}
                    </p>
                  </div>
                  <Badge
                    variant={
                      complaint.status === "PENDING"
                        ? "secondary"
                        : complaint.status === "IN_PROGRESS"
                        ? "default"
                        : complaint.status === "RESOLVED"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {complaint.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentsTab({ data, loading, error }: any) {
  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading payments</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment History</h3>
      {data?.data?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No payments made yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data?.data?.map((payment: any) => (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">৳{payment.amount}</h4>
                    <p className="text-sm text-muted-foreground">
                      {payment.paymentMethod} -{" "}
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      payment.paymentStatus === "COMPLETED"
                        ? "default"
                        : payment.paymentStatus === "PENDING"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {payment.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
