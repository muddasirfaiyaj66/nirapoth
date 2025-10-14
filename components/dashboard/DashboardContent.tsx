"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { UserRole } from "@/lib/store/slices/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  AlertTriangle,
  FileText,
  Camera,
  BarChart3,
  DollarSign,
  Activity,
  TrendingUp,
  Car,
  CreditCard,
  MapPin,
  Bell,
  Phone,
  Building2,
} from "lucide-react";
import Link from "next/link";

interface DashboardStat {
  title: string;
  value: string | number;
  change: { value: number; type: "increase" | "decrease" | "neutral" };
  icon: any;
  description: string;
  color: string;
  badge?: string;
}

export function DashboardContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-8">
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  const getRoleStats = (): DashboardStat[] => {
    const baseStats = {
      totalUsers: 1247,
      totalViolations: 89,
      totalIncidents: 23,
      totalComplaints: 156,
      totalFines: 45,
      totalRevenue: 125000,
      activeCameras: 67,
      pendingReports: 12,
      resolvedReports: 144,
      driverGems: 850,
    };

    switch (user.role) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return [
          {
            title: "Total Users",
            value: baseStats.totalUsers,
            change: { value: 12, type: "increase" as const },
            icon: Users,
            description: "Registered users in the system",
            color: "text-green-600",
          },
          {
            title: "System Revenue",
            value: `৳${baseStats.totalRevenue.toLocaleString()}`,
            change: { value: 8, type: "increase" as const },
            icon: DollarSign,
            description: "Total revenue from fines",
            color: "text-green-600",
          },
          {
            title: "Active Cameras",
            value: baseStats.activeCameras,
            change: { value: 2, type: "increase" as const },
            icon: Camera,
            description: "Currently active monitoring cameras",
            color: "text-purple-600",
          },
          {
            title: "System Health",
            value: "98.5%",
            change: { value: 0.5, type: "increase" as const },
            icon: BarChart3,
            description: "Overall system performance",
            color: "text-emerald-600",
            badge: "Excellent",
          },
        ];

      case UserRole.POLICE:
        return [
          {
            title: "Pending Violations",
            value: baseStats.totalViolations,
            change: { value: 15, type: "increase" as const },
            icon: Shield,
            description: "Violations awaiting review",
            color: "text-orange-600",
          },
          {
            title: "Active Incidents",
            value: baseStats.totalIncidents,
            change: { value: 3, type: "decrease" as const },
            icon: AlertTriangle,
            description: "Incidents being handled",
            color: "text-red-600",
          },
          {
            title: "Resolved Cases",
            value: baseStats.resolvedReports,
            change: { value: 22, type: "increase" as const },
            icon: Activity,
            description: "Cases resolved this month",
            color: "text-green-600",
          },
          {
            title: "Camera Coverage",
            value: `${baseStats.activeCameras} cameras`,
            change: { value: 1, type: "increase" as const },
            icon: Camera,
            description: "Active monitoring cameras",
            color: "text-green-600",
          },
        ];

      case UserRole.CITIZEN:
        return [
          {
            title: "My Complaints",
            value: 5,
            change: { value: 2, type: "increase" as const },
            icon: FileText,
            description: "Complaints you've submitted",
            color: "text-green-600",
          },
          {
            title: "Resolved Issues",
            value: 3,
            change: { value: 1, type: "increase" as const },
            icon: Activity,
            description: "Issues resolved by authorities",
            color: "text-green-600",
          },
          {
            title: "Community Score",
            value: "4.8/5",
            change: { value: 0.2, type: "increase" as const },
            icon: TrendingUp,
            description: "Your community participation score",
            color: "text-purple-600",
            badge: "Excellent",
          },
          {
            title: "Response Rate",
            value: "85%",
            change: { value: 5, type: "increase" as const },
            icon: BarChart3,
            description: "Authorities' response to your reports",
            color: "text-emerald-600",
          },
        ];

      default:
        return [];
    }
  };

  const getQuickActions = () => {
    switch (user.role) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return [
          {
            title: "Manage Users",
            description: "View and manage all users",
            icon: Users,
            href: "/admin/users",
            color: "bg-green-100 text-green-600",
          },
          {
            title: "System Analytics",
            description: "View system-wide statistics",
            icon: BarChart3,
            href: "/admin/analytics",
            color: "bg-purple-100 text-purple-600",
          },
          {
            title: "Camera Network",
            description: "Monitor all cameras",
            icon: Camera,
            href: "/admin/cameras",
            color: "bg-green-100 text-green-600",
          },
        ];

      case UserRole.POLICE:
        return [
          {
            title: "Review Violations",
            description: "Review pending traffic violations",
            icon: Shield,
            href: "/police/violations",
            color: "bg-orange-100 text-orange-600",
          },
          {
            title: "Handle Incidents",
            description: "Manage incident reports",
            icon: AlertTriangle,
            href: "/police/incidents",
            color: "bg-red-100 text-red-600",
          },
          {
            title: "Camera Monitoring",
            description: "Monitor traffic cameras",
            icon: Camera,
            href: "/police/cameras",
            color: "bg-green-100 text-green-600",
          },
        ];

      case UserRole.CITIZEN:
        return [
          {
            title: "File Complaint",
            description: "Report traffic issues",
            icon: FileText,
            href: "/citizen/complaints/new",
            color: "bg-green-100 text-green-600",
          },
          {
            title: "Traffic Maps",
            description: "View traffic conditions",
            icon: MapPin,
            href: "/citizen/maps",
            color: "bg-green-100 text-green-600",
          },
          {
            title: "Emergency Contacts",
            description: "Quick access to emergency services",
            icon: Phone,
            href: "/citizen/emergency",
            color: "bg-red-100 text-red-600",
          },
        ];

      default:
        return [];
    }
  };

  const stats = getRoleStats();
  const quickActions = getQuickActions();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.firstName}! Here's what's happening in your
            area.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {user.role.replace("_", " ")}
          </Badge>
          {user.designation && (
            <Badge variant="outline">{user.designation}</Badge>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs ${
                      stat.change.type === "increase"
                        ? "text-green-600"
                        : stat.change.type === "decrease"
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stat.change.type === "increase"
                      ? "↗"
                      : stat.change.type === "decrease"
                      ? "↘"
                      : "→"}{" "}
                    {Math.abs(stat.change.value)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    from last month
                  </span>
                </div>
                {stat.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {stat.badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">{action.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    {action.description}
                  </p>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.role === UserRole.ADMIN ||
            user.role === UserRole.SUPER_ADMIN ? (
              <>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">
                        New user registered
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        completed
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      John Doe registered as a driver
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>2 minutes ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">
                        System maintenance completed
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        completed
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Database optimization completed successfully
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>1 hour ago</span>
                    </div>
                  </div>
                </div>
              </>
            ) : user.role === UserRole.POLICE ? (
              <>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">
                        New traffic violation detected
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 border-yellow-200"
                      >
                        pending
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Speeding violation on Dhaka-Mymensingh highway
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>5 minutes ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">
                        Accident report filed
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        in progress
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Minor collision at Farmgate intersection
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>30 minutes ago</span>
                    </div>
                  </div>
                </div>
              </>
            ) : user.role === UserRole.CITIZEN ? (
              <>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">
                        Traffic violation issued
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 border-yellow-200"
                      >
                        pending
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Parking violation in Dhanmondi area
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>1 hour ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">
                        Driver gems updated
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        completed
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Your driver gems: 850 points
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // For Citizens and other roles
              <>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">Complaint filed</h4>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        submitted
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Traffic light malfunction at Gulshan-2 circle
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">
                        Community score updated
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        improved
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Your community participation score increased
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>1 day ago</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
