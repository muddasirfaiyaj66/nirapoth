"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Camera,
  FileText,
  Award,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Shield,
  Activity,
  Users,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import {
  useDashboardStats,
  useRoadCongestionData,
  useUserSubmissionData,
  useComplaintStatusData,
} from "@/lib/hooks/useDashboard";

interface CitizenDashboardProps {
  user: {
    firstName: string;
    role: string;
    designation?: string;
  };
}

export function CitizenDashboard({ user }: CitizenDashboardProps) {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: roadCongestionData, isLoading: congestionLoading } =
    useRoadCongestionData();
  const { data: userSubmissionData, isLoading: submissionLoading } =
    useUserSubmissionData();
  const { data: complaintStatusData, isLoading: complaintLoading } =
    useComplaintStatusData();

  const getRoleStats = () => {
    if (!stats) return [];

    return [
      {
        title: "My Reports",
        value: "12",
        change: { value: 3, type: "increase" as const },
        icon: FileText,
        description: "Submitted this month",
        sparklineData: generateSparklineData(),
        trend: "up" as const,
      },
      {
        title: "Rewards Earned",
        value: "৳1,250",
        change: { value: 15, type: "increase" as const },
        icon: Award,
        description: "From valid reports",
        sparklineData: generateSparklineData(),
        trend: "up" as const,
      },
      {
        title: "Report Accuracy",
        value: "92%",
        change: { value: 5, type: "increase" as const },
        icon: TrendingUp,
        description: "Approved reports",
        sparklineData: generateSparklineData(),
        trend: "up" as const,
      },
      {
        title: "Active Cameras",
        value: stats.activeCameras.toString(),
        change: { value: 2, type: "increase" as const },
        icon: Camera,
        description: "In your area",
        sparklineData: generateSparklineData(),
        trend: "up" as const,
      },
    ];
  };

  const getQuickActions = () => [
    {
      title: "Report Violation",
      description: "Report traffic violations",
      icon: AlertTriangle,
      href: "/citizen/report-violation",
    },
    {
      title: "Report Infrastructure",
      description: "Report road issues",
      icon: MapPin,
      href: "/citizen/report-infrastructure",
    },
    {
      title: "View Traffic Map",
      description: "Check real-time traffic",
      icon: MapPin,
      href: "/maps",
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
      {/* Welcome Message */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Welcome back, {user.firstName}!
              </h2>
              <p className="text-muted-foreground mt-1">
                Help make our roads safer by reporting violations and
                infrastructure issues.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Citizen Reporter
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">
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
        {/* Road Traffic Status */}
        {roadCongestionData && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Road Traffic Status</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Real-time congestion levels
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roadCongestionData.slice(0, 6).map((road, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{road.road}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          road.status === "High"
                            ? "bg-red-500/10 text-red-600 border-red-500/20"
                            : road.status === "Medium"
                            ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                            : "bg-green-500/10 text-green-600 border-green-500/20"
                        }`}
                      >
                        {road.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            road.status === "High"
                              ? "bg-red-500"
                              : road.status === "Medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${road.congestion}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {road.congestion}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">
                      {road.vehicles} vehicles detected
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4">
                View Full Traffic Map
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* My Report Status */}
        {complaintStatusData && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">My Report Status</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track your submitted reports
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Personal
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaintStatusData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.status === "Approved"
                            ? "bg-green-500/10"
                            : item.status === "Rejected"
                            ? "bg-red-500/10"
                            : "bg-yellow-500/10"
                        }`}
                      >
                        {item.status === "Approved" ? (
                          <Award className="h-5 w-5 text-green-500" />
                        ) : item.status === "Rejected" ? (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{item.status}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.status === "Approved"
                            ? "Reward earned"
                            : item.status === "Rejected"
                            ? "Under review"
                            : "Awaiting review"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{item.count}</p>
                      <p className="text-xs text-muted-foreground">reports</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold">Total Rewards</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    ৳1,250
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  5% reward for approved reports
                </p>
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
                Report issues and check traffic
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
                Your recent reports and activities
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
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold">Report approved</h4>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-600 border-green-500/20"
                  >
                    Reward: ৳250
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Speeding violation report on Gulshan Avenue approved
                </p>
                <span className="text-xs text-muted-foreground">
                  2 hours ago
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold">Report submitted</h4>
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                  >
                    Under Review
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Pothole report on Mirpur Road submitted for review
                </p>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold">Traffic checked</h4>
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                  >
                    Low Traffic
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Checked traffic conditions on your usual route
                </p>
                <span className="text-xs text-muted-foreground">
                  3 days ago
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
