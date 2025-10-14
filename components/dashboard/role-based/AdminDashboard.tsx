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
  XCircle,
  Clock,
  Award,
  Ban,
  Zap,
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
  LineChart,
  Line,
} from "recharts";
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

interface AdminDashboardProps {
  user: {
    firstName: string;
    role: string;
    designation?: string;
  };
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: violationData, isLoading: violationLoading } =
    useViolationData();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData();
  const { data: roadCongestionData, isLoading: congestionLoading } =
    useRoadCongestionData();
  const { data: policeStationData, isLoading: policeLoading } =
    usePoliceStationData();
  const { data: userSubmissionData, isLoading: submissionLoading } =
    useUserSubmissionData();
  const { data: userRoleData, isLoading: roleLoading } = useUserRoleData();
  const { data: violationTypeData, isLoading: violationTypeLoading } =
    useViolationTypeData();
  const { data: caseSourceData, isLoading: caseSourceLoading } =
    useCaseSourceData();
  const { data: complaintStatusData, isLoading: complaintLoading } =
    useComplaintStatusData();
  const { data: fineStatusData, isLoading: fineLoading } = useFineStatusData();
  const { data: emergencyResponseData, isLoading: emergencyLoading } =
    useEmergencyResponseData();
  const { data: topCitizensData, isLoading: citizensLoading } =
    useTopCitizensData();

  const getRoleStats = () => {
    if (!stats) return [];

    return [
      {
        id: "total-cases",
        title: "Total Cases Filed",
        value: stats.totalViolations.toString(),
        change: { value: 12, type: "increase" as const },
        icon: FileText,
        description: "Auto + Manual + Citizen",
        sparklineData: generateSparklineData(12, "cases"),
        trend: "up" as const,
      },
      {
        id: "active-emergencies",
        title: "Active Emergencies",
        value: stats.totalIncidents.toString(),
        change: { value: 2, type: "decrease" as const },
        icon: AlertTriangle,
        description: "Accidents & Fire incidents",
        sparklineData: generateSparklineData(12, "emergencies"),
        trend: "down" as const,
        badge: "Live",
      },
      {
        id: "fine-collection",
        title: "Fine Collection",
        value: `৳${stats.totalRevenue.toLocaleString()}`,
        change: { value: 8, type: "increase" as const },
        icon: DollarSign,
        description: "Total revenue this month",
        sparklineData: generateSparklineData(12, "revenue"),
        trend: "up" as const,
      },
      {
        id: "ai-cameras",
        title: "AI Cameras Active",
        value: stats.activeCameras.toString(),
        change: { value: 2, type: "increase" as const },
        icon: Camera,
        description: "Monitoring 24/7",
        sparklineData: generateSparklineData(12, "cameras"),
        trend: "up" as const,
      },
      {
        id: "citizen-complaints",
        title: "Citizen Complaints",
        value: stats.totalComplaints.toString(),
        change: { value: 15, type: "increase" as const },
        icon: Users,
        description: "Traffic + Infrastructure",
        sparklineData: generateSparklineData(12, "complaints"),
        trend: "up" as const,
      },
      {
        id: "restricted-citizens",
        title: "Restricted Citizens",
        value: stats.restrictedCitizens.toString(),
        change: { value: 3, type: "increase" as const },
        icon: Ban,
        description: "Driving restricted",
        sparklineData: generateSparklineData(12, "restricted"),
        trend: "up" as const,
        badge: "Alert",
      },
      {
        id: "pending-appeals",
        title: "Pending Appeals",
        value: stats.pendingAppeals.toString(),
        change: { value: 5, type: "decrease" as const },
        icon: Clock,
        description: "Fine removal requests",
        sparklineData: generateSparklineData(12, "appeals"),
        trend: "down" as const,
      },
      {
        id: "system-uptime",
        title: "System Uptime",
        value: `${stats.systemUptime}%`,
        change: { value: 0.2, type: "increase" as const },
        icon: Zap,
        description: "Last 30 days",
        sparklineData: generateSparklineData(12, "uptime"),
        trend: "up" as const,
        badge: "Excellent",
      },
    ];
  };

  const getQuickActions = () => [
    {
      title: "Manage Users",
      description: "View and manage all users",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "System Analytics",
      description: "View system-wide statistics",
      icon: BarChart3,
      href: "/admin/analytics",
    },
    {
      title: "Camera Network",
      description: "Monitor all cameras",
      icon: Camera,
      href: "/admin/cameras",
    },
  ];

  const generateSparklineData = (points = 12, prefix = "point") => {
    return Array.from({ length: points }, (_, index) => ({
      id: `${prefix}-${index}`,
      value: Math.floor(Math.random() * 100) + 50,
    }));
  };

  const roleStats = getRoleStats();
  const quickActions = getQuickActions();

  if (statsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleStats.map((stat, index) => (
          <Card
            key={stat.id}
            className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold tracking-tight">
                    {stat.value}
                  </h3>
                  {stat.badge && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      {stat.badge}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-12 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.sparklineData}>
                    <defs>
                      <linearGradient
                        id={`gradient-${stat.id}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.3}
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
                      fill={`url(#gradient-${stat.id})`}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : stat.trend === "down" ? (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.change.type === "increase"
                        ? "text-green-500"
                        : stat.change.type === "decrease"
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stat.change.value}%
                  </span>
                  <span className="text-sm text-muted-foreground">
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

      {/* Live Emergency Response */}
      {emergencyResponseData && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  Live Emergency Response
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  AI-detected accidents and fire incidents
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-xs bg-red-500/10 text-red-600 border-red-500/20 animate-pulse"
              >
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergencyResponseData.map((emergency) => (
                <div
                  key={emergency.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        emergency.type === "Fire"
                          ? "bg-orange-500/10"
                          : emergency.severity === "Critical"
                          ? "bg-red-500/10"
                          : emergency.severity === "High"
                          ? "bg-yellow-500/10"
                          : "bg-green-500/10"
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
                              ? "bg-red-500/10 text-red-600 border-red-500/20"
                              : emergency.severity === "High"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              : "bg-green-500/10 text-green-600 border-green-500/20"
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
                          ? "bg-red-500/10 text-red-600 border-red-500/20"
                          : emergency.status === "Dispatched"
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : "bg-green-500/10 text-green-600 border-green-500/20"
                      }`}
                    >
                      {emergency.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {emergency.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-4">
              View All Emergencies
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Filing Sources */}
        {caseSourceData && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Case Filing Sources</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Auto-detected vs Manual vs Citizen
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {caseSourceData.reduce((sum, item) => sum + item.count, 0)}{" "}
                  Total
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseSourceData.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0
                              ? "bg-chart-1"
                              : index === 1
                              ? "bg-chart-2"
                              : "bg-chart-3"
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {source.source}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">
                          {source.count}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {source.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          index === 0
                            ? "bg-chart-1"
                            : index === 1
                            ? "bg-chart-2"
                            : "bg-chart-3"
                        }`}
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">
                    AI Detection Efficiency
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {caseSourceData[0]?.percentage}% of cases are automatically
                  detected by AI cameras, reducing manual workload
                  significantly.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Violation Types */}
        {violationTypeData && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Violation Types</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Breakdown by offense category
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  This Month
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={violationTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {violationTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                      formatter={(value: number) => [
                        value.toLocaleString(),
                        "Cases",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {violationTypeData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground truncate">
                        {item.type}
                      </p>
                      <p className="text-sm font-semibold">{item.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Frequently used features
              </p>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-all group bg-transparent"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
    </div>
  );
}
