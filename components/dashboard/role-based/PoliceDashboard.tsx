"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  Activity,
  Camera,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MapPin,
  TrendingUp,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
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
  usePoliceStationData,
  useViolationTypeData,
  useComplaintStatusData,
} from "@/lib/hooks/useDashboard";

interface PoliceDashboardProps {
  user: {
    firstName: string;
    role: string;
    designation?: string;
  };
}

export function PoliceDashboard({ user }: PoliceDashboardProps) {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: violationData, isLoading: violationLoading } =
    useViolationData();
  const { data: policeStationData, isLoading: policeLoading } =
    usePoliceStationData();
  const { data: violationTypeData, isLoading: violationTypeLoading } =
    useViolationTypeData();
  const { data: complaintStatusData, isLoading: complaintLoading } =
    useComplaintStatusData();

  const getRoleStats = () => {
    if (!stats) return [];

    return [
      {
        title: "Pending Violations",
        value: stats.totalViolations.toString(),
        change: { value: 15, type: "increase" as const },
        icon: Shield,
        description: "Awaiting review",
        sparklineData: generateSparklineData(),
        trend: "up" as const,
      },
      {
        title: "Active Incidents",
        value: stats.totalIncidents.toString(),
        change: { value: 3, type: "decrease" as const },
        icon: AlertTriangle,
        description: "Being handled",
        sparklineData: generateSparklineData(),
        trend: "down" as const,
      },
      {
        title: "Resolved Cases",
        value: stats.resolvedReports.toString(),
        change: { value: 22, type: "increase" as const },
        icon: Activity,
        description: "This month",
        sparklineData: generateSparklineData(),
        trend: "up" as const,
      },
      {
        title: "Camera Coverage",
        value: stats.activeCameras.toString(),
        change: { value: 1, type: "increase" as const },
        icon: Camera,
        description: "Active cameras",
        sparklineData: generateSparklineData(),
        trend: "up" as const,
      },
    ];
  };

  const getQuickActions = () => [
    {
      title: "Review Violations",
      description: "Review pending traffic violations",
      icon: Shield,
      href: "/police/violations",
    },
    {
      title: "Handle Incidents",
      description: "Manage incident reports",
      icon: AlertTriangle,
      href: "/police/incidents",
    },
    {
      title: "Camera Monitoring",
      description: "Monitor traffic cameras",
      icon: Camera,
      href: "/police/cameras",
    },
  ];

  const generateSparklineData = (points = 12) => {
    return Array.from({ length: points }, () => ({
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
            key={index}
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
                        id={`gradient-${index}`}
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
                      fill={`url(#gradient-${index})`}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Violations Trend Chart */}
        {violationData && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Violations Overview</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Last 24 hours activity
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
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
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="incidentsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--chart-4))"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--chart-4))"
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
                    <Area
                      type="monotone"
                      dataKey="incidents"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={2}
                      fill="url(#incidentsGradient)"
                      name="Incidents"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-1" />
                  <span className="text-sm text-muted-foreground">
                    Violations
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-4" />
                  <span className="text-sm text-muted-foreground">
                    Incidents
                  </span>
                </div>
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

      {/* Police Station Performance */}
      {policeStationData && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Station Performance</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Cases filed by station
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                This Month
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={policeStationData} layout="vertical">
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
                    }}
                  />
                  <Bar
                    dataKey="cases"
                    fill="hsl(var(--chart-1))"
                    radius={[0, 4, 4, 0]}
                    name="Total Cases"
                  />
                  <Bar
                    dataKey="resolved"
                    fill="hsl(var(--chart-2))"
                    radius={[0, 4, 4, 0]}
                    name="Resolved"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-1" />
                <span className="text-sm text-muted-foreground">
                  Total Cases
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-2" />
                <span className="text-sm text-muted-foreground">Resolved</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Recent Activity */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Latest system events
              </p>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-chart-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold">
                    New traffic violation detected
                  </h4>
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
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
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold">
                    Accident report filed
                  </h4>
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-600 border-blue-500/20"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
