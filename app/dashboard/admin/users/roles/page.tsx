"use client";

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
} from "lucide-react";

export default function RoleManagementPage() {
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Crown className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">SUPER_ADMIN</div>
                          <div className="text-sm text-muted-foreground">
                            System Administrator
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Full system access and control</TableCell>
                    <TableCell>
                      <Badge variant="outline">1</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">All Permissions</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">ADMIN</div>
                          <div className="text-sm text-muted-foreground">
                            Administrator
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Manage users and system settings</TableCell>
                    <TableCell>
                      <Badge variant="outline">3</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Admin Permissions</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium">POLICE</div>
                          <div className="text-sm text-muted-foreground">
                            Police Officer
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Handle violations and incidents</TableCell>
                    <TableCell>
                      <Badge variant="outline">25</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Police Permissions</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium">FIRE_SERVICE</div>
                          <div className="text-sm text-muted-foreground">
                            Fire Service
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Handle fire incidents and emergencies</TableCell>
                    <TableCell>
                      <Badge variant="outline">8</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        Fire Service Permissions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">CITIZEN</div>
                          <div className="text-sm text-muted-foreground">
                            Regular Citizen
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Basic citizen access and reporting</TableCell>
                    <TableCell>
                      <Badge variant="outline">1,234</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Citizen Permissions</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </AdminProtectedRoute>
    </ProtectedRoute>
  );
}
