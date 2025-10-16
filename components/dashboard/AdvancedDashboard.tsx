"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  AlertTriangle,
  Camera,
  BarChart3,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MapPin,
  TrendingUp,
  Flame,
  FileText,
  CheckCircle2,
  Clock,
  Ban,
  Zap,
  Car,
  Siren,
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Funnel,
  FunnelChart,
  LabelList,
} from "recharts";
import { useAuth } from "@/lib/hooks/useAuth";
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

// Mock user data - replace with actual auth
const generateSparklineData = (points = 12) => {
  return Array.from({ length: points }, () => ({
    value: Math.floor(Math.random() * 100) + 50,
  }));
};

const generateCaseResolutionFunnelData = () => {
  return [
    { stage: "Cases Filed", value: 942, fill: "hsl(var(--chart-1))" },
    { stage: "Under Review", value: 756, fill: "hsl(var(--chart-2))" },
    { stage: "Approved", value: 612, fill: "hsl(var(--chart-3))" },
    { stage: "Resolved", value: 489, fill: "hsl(var(--chart-4))" },
    { stage: "Paid", value: 423, fill: "hsl(var(--chart-5))" },
  ];
};

const generateSystemEfficiencyData = () => {
  return [
    { name: "AI Detection", value: 72, fill: "hsl(var(--chart-1))" },
    { name: "Response Time", value: 85, fill: "hsl(var(--chart-2))" },
    { name: "Case Resolution", value: 68, fill: "hsl(var(--chart-3))" },
    { name: "Payment Rate", value: 91, fill: "hsl(var(--chart-4))" },
  ];
};

const generateSystemHealthData = () => {
  return [
    { name: "System Load", value: 67, fill: "hsl(var(--chart-2))" },
    { name: "Available", value: 33, fill: "hsl(var(--muted))" },
  ];
};

const generateViolationHeatmapData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"];

  return hours.map((hour) => {
    const dataPoint: any = { hour };
    days.forEach((day) => {
      dataPoint[day] = Math.floor(Math.random() * 50) + 10;
    });
    return dataPoint;
  });
};

const generateEnhancedPoliceStationData = () => {
  const stations = [
    { name: "Gulshan", cases: 156, resolved: 142, pending: 14, efficiency: 91 },
    { name: "Mirpur", cases: 189, resolved: 165, pending: 24, efficiency: 87 },
    {
      name: "Dhanmondi",
      cases: 134,
      resolved: 118,
      pending: 16,
      efficiency: 88,
    },
    { name: "Uttara", cases: 145, resolved: 128, pending: 17, efficiency: 88 },
    {
      name: "Mohammadpur",
      cases: 112,
      resolved: 95,
      pending: 17,
      efficiency: 85,
    },
    { name: "Banani", cases: 98, resolved: 89, pending: 9, efficiency: 91 },
  ];

  return stations.map((station) => ({
    ...station,
    station: station.name,
    color:
      station.efficiency >= 90
        ? "hsl(var(--chart-2))"
        : station.efficiency >= 85
        ? "hsl(var(--chart-3))"
        : "hsl(var(--chart-4))",
  }));
};

export function AdvancedDashboard() {
  const { user } = useAuth();

  // Use real data hooks
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  const {
    data: violationData,
    isLoading: violationLoading,
    error: violationError,
  } = useViolationData();

  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError,
  } = useRevenueData();

  const {
    data: roadCongestionData,
    isLoading: congestionLoading,
    error: congestionError,
  } = useRoadCongestionData();

  const {
    data: policeStationData,
    isLoading: policeLoading,
    error: policeError,
  } = usePoliceStationData();

  const {
    data: userSubmissionData,
    isLoading: submissionLoading,
    error: submissionError,
  } = useUserSubmissionData();

  const {
    data: userRoleData,
    isLoading: roleLoading,
    error: roleError,
  } = useUserRoleData();

  const {
    data: violationTypeData,
    isLoading: violationTypeLoading,
    error: violationTypeError,
  } = useViolationTypeData();

  const {
    data: caseSourceData,
    isLoading: caseSourceLoading,
    error: caseSourceError,
  } = useCaseSourceData();

  const {
    data: complaintStatusData,
    isLoading: complaintLoading,
    error: complaintError,
  } = useComplaintStatusData();

  const {
    data: fineStatusData,
    isLoading: fineLoading,
    error: fineError,
  } = useFineStatusData();

  const {
    data: emergencyResponseData,
    isLoading: emergencyLoading,
    error: emergencyError,
  } = useEmergencyResponseData();

  const {
    data: topCitizensData,
    isLoading: topCitizensLoading,
    error: topCitizensError,
  } = useTopCitizensData();

  const caseResolutionFunnelData = generateCaseResolutionFunnelData();
  const systemEfficiencyData = generateSystemEfficiencyData();
  const systemHealthData = generateSystemHealthData();
  const violationHeatmapData = generateViolationHeatmapData();
  const enhancedPoliceStationData = generateEnhancedPoliceStationData();

  const getRoleStats = () => {
    if (!dashboardStats) return [];

    const baseStats = {
      totalUsers: dashboardStats.totalUsers || 0,
      totalViolations: dashboardStats.totalViolations || 0,
      totalIncidents: dashboardStats.totalIncidents || 0,
      totalComplaints: dashboardStats.totalComplaints || 0,
      totalFines: dashboardStats.totalFines || 0,
      totalRevenue: dashboardStats.totalRevenue || 0,
      activeCameras: dashboardStats.activeCameras || 0,
      pendingReports: dashboardStats.pendingReports || 0,
      resolvedReports: dashboardStats.resolvedReports || 0,
      driverGems: dashboardStats.driverGems || 0,
    };

    switch (user?.role) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return [
          {
            title: "Total Cases Filed",
            value: dashboardStats.totalViolations?.toString() || "0",
            change: { value: 12, type: "increase" as const },
            icon: FileText,
            description: "Auto + Manual + Citizen",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
          },
          {
            title: "Active Emergencies",
            value: "3",
            change: { value: 2, type: "decrease" as const },
            icon: AlertTriangle,
            description: "Accidents & Fire incidents",
            sparklineData: generateSparklineData(),
            trend: "down" as const,
            badge: "Live",
          },
          {
            title: "Fine Collection",
            value: `৳${baseStats.totalRevenue.toLocaleString()}`,
            change: { value: 8, type: "increase" as const },
            icon: DollarSign,
            description: "Total revenue this month",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
          },
          {
            title: "AI Cameras Active",
            value: baseStats.activeCameras.toString(),
            change: { value: 2, type: "increase" as const },
            icon: Camera,
            description: "Monitoring 24/7",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
          },
          {
            title: "Citizen Complaints",
            value: baseStats.totalComplaints.toString(),
            change: { value: 15, type: "increase" as const },
            icon: Users,
            description: "Traffic + Infrastructure",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
          },
          {
            title: "Blacklisted Drivers",
            value: "47",
            change: { value: 3, type: "increase" as const },
            icon: Ban,
            description: "Gems depleted",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
            badge: "Alert",
          },
          {
            title: "Pending Appeals",
            value: "28",
            change: { value: 5, type: "decrease" as const },
            icon: Clock,
            description: "Fine removal requests",
            sparklineData: generateSparklineData(),
            trend: "down" as const,
          },
          {
            title: "System Uptime",
            value: "99.8%",
            change: { value: 0.2, type: "increase" as const },
            icon: Zap,
            description: "Last 30 days",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
            badge: "Excellent",
          },
        ];

      case "POLICE":
        return [
          {
            title: "Pending Violations",
            value: baseStats.totalViolations.toString(),
            change: { value: 15, type: "increase" as const },
            icon: Shield,
            description: "Awaiting review",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
          },
          {
            title: "Active Incidents",
            value: baseStats.totalIncidents.toString(),
            change: { value: 3, type: "decrease" as const },
            icon: AlertTriangle,
            description: "Being handled",
            sparklineData: generateSparklineData(),
            trend: "down" as const,
          },
          {
            title: "Resolved Cases",
            value: baseStats.resolvedReports.toString(),
            change: { value: 22, type: "increase" as const },
            icon: Activity,
            description: "This month",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
          },
          {
            title: "Camera Coverage",
            value: baseStats.activeCameras.toString(),
            change: { value: 1, type: "increase" as const },
            icon: Camera,
            description: "Active cameras",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
          },
        ];

      case "CITIZEN":
        return [
          {
            title: "My Reports",
            value: baseStats.totalComplaints.toString(),
            change: { value: 5, type: "increase" as const },
            icon: FileText,
            description: "Total submitted",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
          },
          {
            title: "Pending Review",
            value: baseStats.pendingReports.toString(),
            change: { value: 2, type: "decrease" as const },
            icon: Clock,
            description: "Awaiting approval",
            sparklineData: generateSparklineData(),
            trend: "down" as const,
          },
          {
            title: "Total Rewards",
            value: `৳${baseStats.totalRevenue.toLocaleString()}`,
            change: { value: 12, type: "increase" as const },
            icon: DollarSign,
            description: "Earned from reports",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
          },
          {
            title: "Gem Balance",
            value: baseStats.driverGems.toString(),
            change: { value: 0, type: "stable" as const },
            icon: Activity,
            description: "Monthly allocation",
            sparklineData: generateSparklineData(),
            trend: "stable" as const,
          },
        ];

      case "CITY_CORPORATION":
        return [
          {
            title: "Infrastructure Complaints",
            value: baseStats.totalComplaints.toString(),
            change: { value: 8, type: "increase" as const },
            icon: AlertTriangle,
            description: "Total received",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
          },
          {
            title: "Pending",
            value: baseStats.pendingReports.toString(),
            change: { value: 3, type: "decrease" as const },
            icon: Clock,
            description: "Awaiting resolution",
            sparklineData: generateSparklineData(),
            trend: "down" as const,
          },
          {
            title: "Resolved",
            value: baseStats.resolvedReports.toString(),
            change: { value: 15, type: "increase" as const },
            icon: CheckCircle2,
            description: "This month",
            sparklineData: generateSparklineData(),
            trend: "up" as const,
          },
          {
            title: "Response Time",
            value: "24h",
            change: { value: 10, type: "decrease" as const },
            icon: Activity,
            description: "Average resolution",
            sparklineData: generateSparklineData(),
            trend: "down" as const,
          },
        ];

      default:
        return [];
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return [
          {
            title: "Manage Users",
            description: "View and manage all users",
            icon: Users,
            href: "/dashboard/admin/users",
          },
          {
            title: "System Analytics",
            description: "View system-wide statistics",
            icon: BarChart3,
            href: "/dashboard/admin/analytics",
          },
          {
            title: "Revenue Management",
            description: "Track payments and revenue",
            icon: DollarSign,
            href: "/dashboard/admin/finances/revenue",
          },
          {
            title: "Disputes",
            description: "Manage disputed fines",
            icon: AlertTriangle,
            href: "/dashboard/admin/finances/disputes",
          },
          {
            title: "Create Notification",
            description: "Send notifications to users",
            icon: Activity,
            href: "/dashboard/admin/notifications",
          },
          {
            title: "Camera Network",
            description: "Monitor all cameras",
            icon: Camera,
            href: "/dashboard/admin/system/cameras",
          },
        ];

      case "POLICE":
        return [
          {
            title: "Review Violations",
            description: "Review pending traffic violations",
            icon: Shield,
            href: "/dashboard/police/violations",
          },
          {
            title: "Review Reports",
            description: "Review citizen violation reports",
            icon: FileText,
            href: "/dashboard/police/review-reports",
          },
          {
            title: "Review Appeals",
            description: "Process fine appeals",
            icon: CheckCircle2,
            href: "/dashboard/police/review-appeals",
          },
          {
            title: "Manual Cases",
            description: "Log manual traffic cases",
            icon: Activity,
            href: "/dashboard/police/manual-cases",
          },
          {
            title: "Accidents",
            description: "Monitor accidents",
            icon: AlertTriangle,
            href: "/dashboard/police/accidents",
          },
          {
            title: "Speed Monitoring",
            description: "Track speed violations",
            icon: Zap,
            href: "/dashboard/police/speed-monitoring",
          },
        ];

      case "CITIZEN":
        return [
          {
            title: "Report Violation",
            description: "Submit traffic violation reports",
            icon: Camera,
            href: "/citizen/report-violation",
          },
          {
            title: "My Reports",
            description: "Track your submitted reports",
            icon: FileText,
            href: "/citizen/my-reports",
          },
          {
            title: "My Rewards",
            description: "View earnings and withdraw",
            icon: DollarSign,
            href: "/citizen/rewards",
          },
          {
            title: "Submit Appeal",
            description: "Appeal against fines",
            icon: Shield,
            href: "/citizen/appeals",
          },
          {
            title: "My Gems",
            description: "View gem balance",
            icon: Activity,
            href: "/citizen/gems",
          },
          {
            title: "Report Infrastructure",
            description: "Report infrastructure issues",
            icon: AlertTriangle,
            href: "/citizen/report-infrastructure",
          },
        ];

      case "CITY_CORPORATION":
        return [
          {
            title: "Infrastructure",
            description: "Manage infrastructure complaints",
            icon: AlertTriangle,
            href: "/dashboard/city-corporation/infrastructure",
          },
        ];

      default:
        return [];
    }
  };

  const stats = getRoleStats();
  const quickActions = getQuickActions();

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-border/50">
        <div className="space-y-2">
          <p className="text-muted-foreground text-base lg:text-lg">
            Welcome back,{" "}
            <span className="text-foreground font-semibold">
              {user?.firstName}
            </span>
            . Real-time traffic monitoring system.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className="capitalize px-4 py-2 text-sm font-medium border border-primary/20"
          >
            <Activity className="h-3 w-3 mr-2" />
            {user?.role?.replace("_", " ")}
          </Badge>
          {user?.designation && (
            <Badge variant="outline" className="px-4 py-2 text-sm">
              {user?.designation}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border border-border/50 bg-card/80 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
              <div className="space-y-1 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl lg:text-3xl font-bold tracking-tight">
                    {stat.value}
                  </h3>
                  {stat.badge && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary border-primary/20 animate-pulse"
                    >
                      {stat.badge}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
                <stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
              </div>
            </CardHeader>

            <CardContent className="space-y-3 relative z-10">
              <div className="h-12 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.sparklineData}>
                    <defs>
                      <linearGradient
                        id={`sparkline-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill={`url(#sparkline-${index})`}
                      isAnimationActive={true}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-2">
                  {stat.trend === "up" ? (
                    <div className="flex items-center gap-1 text-green-500">
                      <ArrowUpRight className="h-3 w-3" />
                      <span className="text-sm font-semibold">
                        {stat.change.value}%
                      </span>
                    </div>
                  ) : stat.trend === "down" ? (
                    <div className="flex items-center gap-1 text-red-500">
                      <ArrowDownRight className="h-3 w-3" />
                      <span className="text-sm font-semibold">
                        {stat.change.value}%
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Minus className="h-3 w-3" />
                      <span className="text-sm font-semibold">
                        {stat.change.value}%
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">
                    vs last month
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
        <>
          <Card className="border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden relative group hover:border-red-500/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl lg:text-2xl flex items-center gap-3">
                    <Siren className="h-6 w-6 text-red-500 animate-pulse" />
                    Live Emergency Response
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    AI-detected accidents and fire incidents
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs bg-red-500/10 text-red-600 border-red-500/30 animate-pulse px-3 py-1"
                >
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3">
                {emergencyResponseData?.map((emergency: any) => (
                  <div
                    key={emergency.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 transition-all duration-300 group/item"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          emergency.type === "Fire"
                            ? "bg-orange-500/10 group-hover/item:bg-orange-500/20"
                            : emergency.severity === "Critical"
                            ? "bg-red-500/10 group-hover/item:bg-red-500/20"
                            : emergency.severity === "High"
                            ? "bg-yellow-500/10 group-hover/item:bg-yellow-500/20"
                            : "bg-green-500/10 group-hover/item:bg-green-500/20"
                        }`}
                      >
                        {emergency.type === "Fire" ? (
                          <Flame className="h-6 w-6 text-orange-500" />
                        ) : (
                          <AlertTriangle
                            className={`h-6 w-6 ${
                              emergency.severity === "Critical"
                                ? "text-red-500"
                                : emergency.severity === "High"
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold">
                            {emergency.type} Detected
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              emergency.severity === "Critical"
                                ? "bg-red-500/10 text-red-600 border-red-500/30"
                                : emergency.severity === "High"
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                                : "bg-green-500/10 text-green-600 border-green-500/30"
                            }`}
                          >
                            {emergency.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {emergency.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={`mb-2 ${
                          emergency.status === "Active"
                            ? "bg-red-500/10 text-red-600 border-red-500/30"
                            : emergency.status === "Dispatched"
                            ? "bg-green-500/10 text-green-600 border-green-500/30"
                            : "bg-green-500/10 text-green-600 border-green-500/30"
                        }`}
                      >
                        {emergency.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {emergency.time}
                      </p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-muted-foreground">
                    <Siren className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active emergencies</p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-4 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                View All Emergencies
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tank/Funnel Chart */}
            <Card className="lg:col-span-2 border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden relative group hover:border-primary/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl lg:text-2xl">
                      Case Resolution Funnel
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      End-to-end case processing flow
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs bg-primary/10 border-primary/30 px-3 py-1"
                  >
                    Tank View
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          backdropFilter: "blur(12px)",
                        }}
                        formatter={(value: number) => [
                          value.toLocaleString(),
                          "Cases",
                        ]}
                      />
                      <Funnel
                        dataKey="value"
                        data={caseResolutionFunnelData}
                        isAnimationActive
                      >
                        <LabelList
                          position="right"
                          fill="hsl(var(--foreground))"
                          stroke="none"
                          dataKey="stage"
                        />
                        <LabelList
                          position="center"
                          fill="hsl(var(--card-foreground))"
                          stroke="none"
                          dataKey="value"
                          style={{ fontWeight: "bold" }}
                        />
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-5 gap-3 mt-6">
                  {caseResolutionFunnelData.map((item, index) => (
                    <div
                      key={index}
                      className="text-center p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300"
                    >
                      <div
                        className="w-4 h-4 rounded-full mx-auto mb-2 shadow-lg"
                        style={{
                          backgroundColor: item.fill,
                          boxShadow: `0 0 10px ${item.fill}`,
                        }}
                      />
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.stage}
                      </p>
                      <p className="text-lg font-bold">{item.value}</p>
                      {index > 0 && (
                        <p className="text-xs text-red-500 mt-1">
                          -
                          {Math.round(
                            ((caseResolutionFunnelData[index - 1].value -
                              item.value) /
                              caseResolutionFunnelData[index - 1].value) *
                              100
                          )}
                          %
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Health Gauge */}
            <Card className="border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden relative group hover:border-green-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-primary/5" />
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">System Health</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Real-time monitoring
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-500/10 text-green-600 border-green-500/30"
                  >
                    Healthy
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="h-[280px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="100%"
                      barSize={20}
                      data={systemHealthData}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar background dataKey="value" cornerRadius={10} />
                      <text
                        x="50%"
                        y="45%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground text-4xl font-bold"
                      >
                        67%
                      </text>
                      <text
                        x="50%"
                        y="60%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-muted-foreground text-sm"
                      >
                        System Load
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden relative group hover:border-primary/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl lg:text-2xl">
                    System Efficiency Metrics
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Performance indicators across key areas
                  </p>
                </div>
                <Badge variant="outline" className="text-xs px-3 py-1">
                  Real-time
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {systemEfficiencyData.map((metric, index) => (
                  <div key={index} className="relative group/metric">
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="70%"
                          outerRadius="100%"
                          barSize={12}
                          data={[metric]}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <RadialBar
                            background={{ fill: "hsl(var(--muted))" }}
                            dataKey="value"
                            cornerRadius={10}
                            fill={metric.fill}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">
                          {metric.value}%
                        </span>
                        <span className="text-xs text-muted-foreground mt-1 text-center px-2">
                          {metric.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Violations Trend Chart */}
        <Card className="border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden relative group hover:border-primary/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Violations Overview</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Last 24 hours activity
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-xs bg-primary/10 border-primary/30 animate-pulse px-3 py-1"
              >
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={violationData}>
                  <defs>
                    <linearGradient
                      id="violationsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.5}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      backdropFilter: "blur(12px)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="violations"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    fill="url(#violationsGradient)"
                    name="Violations"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden relative group hover:border-accent/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Revenue Analytics</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Monthly fine collection
                </p>
              </div>
              <Badge variant="outline" className="text-xs px-3 py-1">
                6 Months
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `৳${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      backdropFilter: "blur(12px)",
                    }}
                    formatter={(value: number) => [
                      `৳${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="url(#revenueGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Road Traffic Congestion */}
            <Card className="border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden relative group hover:border-primary/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      Road Traffic Status
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Real-time congestion levels
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs bg-primary/10 border-primary/30 animate-pulse px-3 py-1"
                  >
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  {roadCongestionData
                    ?.slice(0, 6)
                    .map((road: any, index: number) => (
                      <div
                        key={index}
                        className="space-y-2 p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {road.road}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              road.status === "High"
                                ? "bg-red-500/10 text-red-600 border-red-500/30"
                                : road.status === "Medium"
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                                : "bg-green-500/10 text-green-600 border-green-500/30"
                            }`}
                          >
                            {road.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                road.status === "High"
                                  ? "bg-gradient-to-r from-red-500 to-red-600"
                                  : road.status === "Medium"
                                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                                  : "bg-gradient-to-r from-green-500 to-green-600"
                              }`}
                              style={{
                                width: `${road.congestion}%`,
                                boxShadow:
                                  road.status === "High"
                                    ? "0 0 10px rgba(239, 68, 68, 0.5)"
                                    : road.status === "Medium"
                                    ? "0 0 10px rgba(234, 179, 8, 0.5)"
                                    : "0 0 10px rgba(34, 197, 94, 0.5)",
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-12 text-right font-semibold">
                            {road.congestion}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">
                          {road.vehicles} vehicles detected
                        </p>
                      </div>
                    )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No traffic data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Role Distribution */}
            <Card className="border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden relative group hover:border-primary/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      User Distribution
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total users by role
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs px-3 py-1">
                    {userRoleData
                      ?.reduce((sum: number, item: any) => sum + item.count, 0)
                      ?.toLocaleString() || 0}{" "}
                    Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userRoleData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="count"
                      >
                        {userRoleData?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          backdropFilter: "blur(12px)",
                        }}
                        formatter={(value: number) => [
                          value.toLocaleString(),
                          "Users",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Police Station Performance */}
            <Card className="border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden relative group hover:border-primary/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      Police Station Performance
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cases filed by station
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs px-3 py-1">
                    This Month
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={policeStationData} layout="vertical">
                      <defs>
                        <linearGradient
                          id="casesGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(var(--chart-1))"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(var(--chart-1))"
                            stopOpacity={1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="resolvedGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(var(--chart-2))"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(var(--chart-2))"
                            stopOpacity={1}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        type="number"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="station"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        width={120}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          backdropFilter: "blur(12px)",
                        }}
                      />
                      <Bar
                        dataKey="cases"
                        fill="url(#casesGradient)"
                        radius={[0, 4, 4, 0]}
                        name="Total Cases"
                      />
                      <Bar
                        dataKey="resolved"
                        fill="url(#resolvedGradient)"
                        radius={[0, 4, 4, 0]}
                        name="Resolved"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Submissions Tracking */}
            <Card className="border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden relative group hover:border-primary/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      Citizen Submissions
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Weekly complaint trends
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs flex items-center gap-1 px-3 py-1"
                  >
                    <TrendingUp className="h-3 w-3" />
                    +18%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userSubmissionData}>
                      <defs>
                        <linearGradient
                          id="trafficGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(var(--chart-3))"
                            stopOpacity={0.5}
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(var(--chart-3))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="infrastructureGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(var(--chart-5))"
                            stopOpacity={0.5}
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(var(--chart-5))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          backdropFilter: "blur(12px)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="traffic"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        fill="url(#trafficGradient)"
                        name="Traffic Violations"
                      />
                      <Area
                        type="monotone"
                        dataKey="infrastructure"
                        stroke="hsl(var(--chart-5))"
                        strokeWidth={2}
                        fill="url(#infrastructureGradient)"
                        name="Infrastructure"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card className="border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden relative group hover:border-primary/30 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Frequently used features
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto p-6 flex flex-col items-start gap-3 hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 hover:border-primary/50 transition-all duration-300 group/action bg-card/50 backdrop-blur-sm border-border/50"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover/action:from-primary/20 group-hover/action:to-accent/20 transition-all duration-300">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover/action:text-primary transition-colors" />
                  </div>
                  <div className="text-left space-y-1">
                    <h4 className="font-semibold text-base">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden relative group hover:border-primary/30 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Latest system events
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-4">
            {user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? (
              <>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 group/activity">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 group-hover/activity:from-primary/20 group-hover/activity:to-accent/20 transition-all duration-300">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold">
                        New user registered
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-600 border-green-500/30"
                      >
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      John Doe registered as a driver in Dhaka region
                    </p>
                    <span className="text-xs text-muted-foreground">
                      2 minutes ago
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 group/activity">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover/activity:from-accent/20 group-hover/activity:to-primary/20 transition-all duration-300">
                    <BarChart3 className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold">
                        System maintenance completed
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-600 border-green-500/30"
                      >
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Database optimization completed successfully
                    </p>
                    <span className="text-xs text-muted-foreground">
                      1 hour ago
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 group/activity">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chart-4/10 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover/activity:from-chart-4/20 group-hover/activity:to-primary/20 transition-all duration-300">
                    <Camera className="h-5 w-5 text-chart-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold">
                        New camera activated
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-600 border-green-500/30"
                      >
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Camera #68 installed at Gulshan intersection
                    </p>
                    <span className="text-xs text-muted-foreground">
                      3 hours ago
                    </span>
                  </div>
                </div>
              </>
            ) : user?.role === "POLICE" ? (
              <>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 group/activity">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chart-4/10 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover/activity:from-chart-4/20 group-hover/activity:to-primary/20 transition-all duration-300">
                    <Shield className="h-5 w-5 text-chart-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold">
                        New traffic violation detected
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                      >
                        Pending
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Speeding violation on Dhaka-Mymensingh highway
                    </p>
                    <span className="text-xs text-muted-foreground">
                      5 minutes ago
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 group/activity">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-destructive/10 to-red-500/10 flex items-center justify-center flex-shrink-0 group-hover/activity:from-destructive/20 group-hover/activity:to-red-500/20 transition-all duration-300">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold">
                        Accident report filed
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-600 border-green-500/30"
                      >
                        In Progress
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Minor collision at Farmgate intersection
                    </p>
                    <span className="text-xs text-muted-foreground">
                      30 minutes ago
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
