"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  AlertTriangle,
  DollarSign,
  Camera,
  MessageSquare,
  UserX,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DashboardStats as StatsType } from "@/lib/store/slices/dashboardSlice";

interface DashboardStatsProps {
  stats: StatsType | null;
  loading: boolean;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              No Data Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground">Unable to load data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Cases Filed",
      value: stats.totalUsers || 0,
      icon: Users,
      change: "+12%",
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Active Emergencies",
      value: stats.pendingComplaints || 0,
      icon: AlertTriangle,
      change: "-2%",
      trend: "down",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900",
      badge: "Live",
      badgeColor: "bg-red-500",
    },
    {
      title: "Fine Collection",
      value: `৳${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      change: "+8%",
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "AI Cameras Active",
      value: stats.activeCameras || 0,
      icon: Camera,
      change: "+2%",
      trend: "up",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "Citizen Complaints",
      value: stats.pendingComplaints || 0,
      icon: MessageSquare,
      change: "+15%",
      trend: "up",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    },
    {
      title: "Restricted Citizens",
      value: stats.restrictedCitizens || 0,
      icon: UserX,
      change: "+3%",
      trend: "up",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900",
      badge: "Alert",
      badgeColor: "bg-yellow-500",
    },
    {
      title: "Pending Appeals",
      value: Math.floor((stats.pendingComplaints || 0) * 0.3),
      icon: Clock,
      change: "-5%",
      trend: "down",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      title: "System Uptime",
      value: `${stats.systemUptime || 99.9}%`,
      icon: Zap,
      change: "+0.2%",
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      badge: "Excellent",
      badgeColor: "bg-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
        const trendColor =
          stat.trend === "up" ? "text-green-600" : "text-red-600";

        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                {stat.badge && (
                  <Badge className={`text-white ${stat.badgeColor}`}>
                    {stat.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendIcon className={`h-3 w-3 mr-1 ${trendColor}`} />
                <span className={trendColor}>{stat.change}</span>
                <span className="ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
