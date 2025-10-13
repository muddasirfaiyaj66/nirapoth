"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  CreditCard,
  User,
  Shield,
  Building2,
  Users,
  ChevronRight,
  Settings,
  FileText,
  Activity,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

interface FeatureCard {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: string[];
  badge?: string;
}

export function ManagementOverview() {
  const { user } = useAuth();

  const features: FeatureCard[] = [
    {
      title: "Driving License Management",
      description:
        "Apply for, renew, and manage driving licenses with automatic validation",
      href: "/dashboard/licenses",
      icon: CreditCard,
      roles: ["CITIZEN", "ADMIN", "POLICE"],
    },
    {
      title: "Vehicle Assignment",
      description:
        "Assign drivers to vehicles with license verification and gem requirements",
      href: "/dashboard/vehicles",
      icon: Car,
      roles: ["CITIZEN", "ADMIN", "POLICE"],
    },
    {
      title: "Profile Management",
      description:
        "Complete user profile with addresses, professional info, and emergency contacts",
      href: "/profile",
      icon: User,
      roles: ["CITIZEN", "ADMIN", "POLICE"],
    },
    {
      title: "Police Management",
      description:
        "Manage police stations, officers, ranks, and hierarchical assignments",
      href: "/dashboard/police",
      icon: Building2,
      roles: ["ADMIN", "POLICE"],
    },
  ];

  const availableFeatures = features.filter(
    (feature) => user?.role && feature.roles.includes(user.role)
  );

  const getStats = () => {
    return [
      {
        title: "Active Licenses",
        value: "2,847",
        icon: CreditCard,
        color: "text-green-600",
      },
      {
        title: "Vehicle Assignments",
        value: "1,523",
        icon: Car,
        color: "text-blue-600",
      },
      {
        title: "Police Stations",
        value: "89",
        icon: Building2,
        color: "text-purple-600",
      },
      {
        title: "Active Officers",
        value: "3,421",
        icon: Shield,
        color: "text-orange-600",
      },
    ];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Management Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive system for managing driving licenses, vehicle
          assignments, user profiles, and police operations
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStats().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  {feature.title}
                  {feature.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={feature.href}>
                  <Button className="w-full group-hover:bg-primary/90 transition-colors">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Frequently used actions for efficient management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {user?.role === "CITIZEN" && (
              <>
                <Link href="/dashboard/licenses">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Apply for License
                  </Button>
                </Link>
                <Link href="/dashboard/vehicles">
                  <Button variant="outline" className="w-full justify-start">
                    <Car className="mr-2 h-4 w-4" />
                    Assign Driver
                  </Button>
                </Link>
              </>
            )}

            {(user?.role === "ADMIN" || user?.role === "POLICE") && (
              <>
                <Link href="/dashboard/police">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="mr-2 h-4 w-4" />
                    Create Station
                  </Button>
                </Link>
                <Link href="/dashboard/police">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Add Officer
                  </Button>
                </Link>
              </>
            )}

            <Link href="/profile">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </Link>

            <Link href="/dashboard/management">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                View All Features
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system health and operational status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">License Validation System: Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Vehicle Assignment System: Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Police Management System: Online</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
