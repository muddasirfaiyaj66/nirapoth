"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Users, Info } from "lucide-react";
import Link from "next/link";

export default function AdminVehiclesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Vehicle Management
          </h1>
          <p className="text-muted-foreground">
            Vehicle management for administrators
          </p>
        </div>
      </div>

      {/* Notice Card */}
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-amber-800 dark:text-amber-200">
                Vehicle Management Notice
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-amber-700 dark:text-amber-300">
            <p className="mb-3">
              <strong>Important:</strong> As an administrator, you should manage
              your personal vehicles through your citizen account, not through
              the admin panel.
            </p>
            <p className="mb-3">
              The admin vehicle management system is designed for:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Viewing system-wide vehicle statistics</li>
              <li>Managing vehicle registration policies</li>
              <li>Overseeing vehicle-related violations</li>
              <li>Administrative oversight of the vehicle system</li>
            </ul>
            <p className="mb-4">
              To add or manage your personal vehicles, please use your citizen
              account dashboard.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/citizen/vehicles">
              <Button
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <Users className="h-4 w-4 mr-2" />
                Go to Citizen Vehicles
              </Button>
            </Link>
            <Link href="/dashboard/admin/analytics">
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Shield className="h-4 w-4 mr-2" />
                View System Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
              Total Registered Vehicles
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              12,847
            </div>
            <p className="text-xs text-green-600 dark:text-blue-400 mt-1">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
              Active Vehicles
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              11,923
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              92.8% of total
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Pending Registrations
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              156
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">
              Suspended Vehicles
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              768
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Due to violations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Administrative Actions</CardTitle>
          <p className="text-sm text-muted-foreground">
            System-wide vehicle management tools
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/admin/analytics">
              <Button
                variant="outline"
                className="w-full h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
              >
                <Shield className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <h4 className="font-semibold">System Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    View comprehensive vehicle statistics
                  </p>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/admin/violations">
              <Button
                variant="outline"
                className="w-full h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
              >
                <AlertTriangle className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <h4 className="font-semibold">Violation Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Review and manage vehicle violations
                  </p>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/admin/users">
              <Button
                variant="outline"
                className="w-full h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
              >
                <Users className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <h4 className="font-semibold">User Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage vehicle owners and drivers
                  </p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Information Section */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">
            System Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
            <div>
              <h4 className="font-semibold mb-2">For Personal Vehicles:</h4>
              <ul className="space-y-1">
                <li>• Use your citizen account dashboard</li>
                <li>• Access via /citizen/vehicles</li>
                <li>• Add, edit, and manage your vehicles</li>
                <li>• View your violation history</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For System Administration:</h4>
              <ul className="space-y-1">
                <li>• Monitor system-wide vehicle data</li>
                <li>• Manage registration policies</li>
                <li>• Review violation patterns</li>
                <li>• Generate comprehensive reports</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
