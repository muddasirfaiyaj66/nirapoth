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
  Ban,
  Search,
  Unlock,
  Eye,
  AlertTriangle,
  Clock,
  UserX,
} from "lucide-react";

export default function BlockedUsersPage() {
  return (
    <ProtectedRoute>
      <AdminProtectedRoute>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Blocked Users
              </h1>
              <p className="text-muted-foreground">
                Manage blocked and restricted user accounts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-sm">
                <Ban className="h-3 w-3 mr-1" />5 Blocked
              </Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search blocked users</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, email, or reason..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Filter by Reason
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blocked Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-500" />
                Blocked User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Blocked By</TableHead>
                    <TableHead>Blocked Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <UserX className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium">John Smith</div>
                          <div className="text-sm text-muted-foreground">
                            ID: 12345
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>john.smith@email.com</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Fraudulent Activity
                      </Badge>
                    </TableCell>
                    <TableCell>Admin User</TableCell>
                    <TableCell>3 days ago</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        <Ban className="h-3 w-3 mr-1" />
                        Permanently Blocked
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Unlock className="h-4 w-4 mr-1" />
                          Unblock
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <UserX className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium">Sarah Johnson</div>
                          <div className="text-sm text-muted-foreground">
                            ID: 12346
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>sarah.j@email.com</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Multiple Violations
                      </Badge>
                    </TableCell>
                    <TableCell>Police Officer</TableCell>
                    <TableCell>1 week ago</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Temporary Block
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Unlock className="h-4 w-4 mr-1" />
                          Unblock
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <UserX className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium">Mike Wilson</div>
                          <div className="text-sm text-muted-foreground">
                            ID: 12347
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>mike.w@email.com</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Spam Reports
                      </Badge>
                    </TableCell>
                    <TableCell>System Admin</TableCell>
                    <TableCell>2 weeks ago</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        <Ban className="h-3 w-3 mr-1" />
                        Permanently Blocked
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Unlock className="h-4 w-4 mr-1" />
                          Unblock
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
