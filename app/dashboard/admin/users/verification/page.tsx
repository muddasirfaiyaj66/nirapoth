"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Shield,
  Loader2,
} from "lucide-react";
import { adminApi, UserVerification } from "@/lib/api/admin";
import { toast } from "sonner";
import { fetchVerifications, verifyUser } from "@/lib/store/slices/userSlice";
import {
  RootState,
  AppDispatch,
  useAppDispatch,
  useAppSelector,
} from "@/lib/store";

export default function UserVerificationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { verifications, loading, error } = useAppSelector(
    (state: RootState) =>
      state.user || { verifications: [], loading: false, error: null }
  );

  useEffect(() => {
    dispatch(
      fetchVerifications({ page, limit: 10, status: activeTab.toUpperCase() })
    );
  }, [dispatch, page, activeTab]);

  const handleReviewUser = (user: any) => {
    setSelectedUser(user);
    setIsReviewDialogOpen(true);
  };

  const handleVerify = async (userId: string, verified: boolean) => {
    try {
      await dispatch(verifyUser({ userId, verified })).unwrap();
      toast.success("User verification updated successfully");
      setIsReviewDialogOpen(false);
      // Refresh the data
      dispatch(
        fetchVerifications({ page, limit: 10, status: activeTab.toUpperCase() })
      );
    } catch (error: any) {
      toast.error(error || "Failed to update verification");
    }
  };

  const currentData = {
    users: verifications || [],
    pagination: {
      page,
      limit: 10,
      total: verifications?.length || 0,
      pages: Math.ceil((verifications?.length || 0) / 10),
    },
  };

  return (
    <ProtectedRoute>
      <AdminProtectedRoute>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                User Verification
              </h1>
              <p className="text-muted-foreground">
                Review and verify user account applications
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <Clock className="h-3 w-3 mr-1" />
                {currentData.pagination.total} Pending
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
                  <Label htmlFor="search">Search users</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, email, or NID..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="pending">
                Pending Review
                <Badge variant="secondary" className="ml-2">
                  {currentData.pagination.total}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="verified">
                Verified
                <Badge variant="secondary" className="ml-2">
                  0
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                <Badge variant="secondary" className="ml-2">
                  0
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>NID</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData?.users?.map((user: UserVerification) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <UserCheck className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    ID: {user.id.slice(0, 8)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.nidNo || "N/A"}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReviewUser(user)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVerify(user.id, true)}
                                  disabled={loading}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVerify(user.id, false)}
                                  disabled={loading}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {currentData?.users?.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              <div className="flex flex-col items-center gap-2">
                                <Shield className="h-12 w-12 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                  No pending verifications found
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verified" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Verified Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : currentData?.users?.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No verified users found
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Verified Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData?.users?.map((user: UserVerification) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    ID: {user.id.slice(0, 8)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.updatedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="default"
                                className="bg-green-100 text-green-800"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    Rejected Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : currentData?.users?.length === 0 ? (
                    <div className="text-center py-8">
                      <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No rejected applications found
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Rejected Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData?.users?.map((user: UserVerification) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    ID: {user.id.slice(0, 8)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.updatedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                Rejected
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Review User Dialog */}
          <Dialog
            open={isReviewDialogOpen}
            onOpenChange={setIsReviewDialogOpen}
          >
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Review User Details</DialogTitle>
                <DialogDescription>
                  Carefully review the user's information before approving or
                  rejecting
                </DialogDescription>
              </DialogHeader>

              {selectedUser && (
                <div className="space-y-4">
                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">
                          Full Name
                        </Label>
                        <p className="font-medium">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="font-medium">
                          {selectedUser.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Role</Label>
                        <Badge variant="outline">{selectedUser.role}</Badge>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">NID No</Label>
                        <p className="font-medium">
                          {selectedUser.nidNo || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Birth Certificate No
                        </Label>
                        <p className="font-medium">
                          {selectedUser.birthCertificateNo || "N/A"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Account Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Account Status</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">
                          Email Verified
                        </Label>
                        <div>
                          {selectedUser.isEmailVerified ? (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Account Status
                        </Label>
                        <div>
                          {selectedUser.isBlocked ? (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Blocked
                            </Badge>
                          ) : (
                            <Badge variant="default">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Registration Date
                        </Label>
                        <p className="font-medium">
                          {new Date(
                            selectedUser.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Last Updated
                        </Label>
                        <p className="font-medium">
                          {new Date(
                            selectedUser.updatedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsReviewDialogOpen(false)}
                    >
                      Close
                    </Button>
                    {!selectedUser.isEmailVerified && (
                      <>
                        <Button
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50"
                          onClick={() => handleVerify(selectedUser.id, false)}
                          disabled={loading}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleVerify(selectedUser.id, true)}
                          disabled={loading}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </>
                    )}
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminProtectedRoute>
    </ProtectedRoute>
  );
}
