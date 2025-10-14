"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Crown,
  UserCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchRoleManagement } from "@/lib/store/slices/adminUsersSlice";

export default function RoleManagementPage() {
  const dispatch = useAppDispatch();
  const { roles, loading } = useAppSelector((state) => state.adminUsers);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchRoleManagement());
  }, [dispatch]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Crown className="h-4 w-4 text-purple-600" />;
      case "ADMIN":
        return <Users className="h-4 w-4 text-blue-600" />;
      case "POLICE":
        return <Shield className="h-4 w-4 text-orange-600" />;
      case "FIRE_SERVICE":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "CITIZEN":
        return <UserCheck className="h-4 w-4 text-green-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100";
      case "ADMIN":
        return "bg-blue-100";
      case "POLICE":
        return "bg-orange-100";
      case "FIRE_SERVICE":
        return "bg-red-100";
      case "CITIZEN":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  const filteredRoles = Array.isArray(roles)
    ? roles.filter(
        (role) =>
          role.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <ProtectedRoute>
      <AdminProtectedRoute>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Role Management
              </h1>
              <p className="text-muted-foreground">
                Manage user roles and permissions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <Shield className="h-3 w-3 mr-1" />
                {roles.length} Roles
              </Badge>
            </div>
          </div>

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search roles</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by role name or description..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roles Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredRoles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No roles found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users Count</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow key={role.role}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full ${getRoleColor(
                                role.role
                              )} flex items-center justify-center`}
                            >
                              {getRoleIcon(role.role)}
                            </div>
                            <div>
                              <div className="font-medium">{role.role}</div>
                              <div className="text-sm text-muted-foreground">
                                System Role
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{role.count}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 3).map((permission) => (
                              <Badge
                                key={permission}
                                variant="secondary"
                                className="text-xs"
                              >
                                {permission}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{role.permissions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800"
                          >
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminProtectedRoute>
    </ProtectedRoute>
  );
}
