"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  UserCheck,
  Ban,
  Eye,
  Trash2,
  Lock,
  Plus,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  fetchUsers,
  blockUser,
  deleteUser,
  setSearchTerm as setSearchTermAction,
  setRoleFilter as setRoleFilterAction,
  setStatusFilter as setStatusFilterAction,
  setCurrentPage as setCurrentPageAction,
  type User,
} from "@/lib/store/slices/adminUsersSlice";
import {
  canManageUser,
  canDeleteUser,
  canBlockUser,
  getRoleCapabilities,
  type UserRole,
} from "@/lib/utils/roleHierarchy";
import { CreateUserDialog } from "@/components/admin/CreateUserDialog";
import { UpdateUserRoleDialog } from "@/components/admin/UpdateUserRoleDialog";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const {
    users,
    loading,
    error,
    totalUsers,
    currentPage,
    totalPages,
    searchTerm,
    roleFilter,
    statusFilter,
  } = useAppSelector((state) => state.adminUsers);

  // Get current user
  const { user: currentUser } = useAuth();

  // Check user authorization
  if (!currentUser || !["ADMIN", "SUPER_ADMIN"].includes(currentUser.role)) {
    return <div className="text-red-500">Access denied</div>;
  }

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isUpdateRoleDialogOpen, setIsUpdateRoleDialogOpen] = useState(false);
  const [userToUpdateRole, setUserToUpdateRole] = useState<User | null>(null);

  // Fetch users on component mount and when filters change
  useEffect(() => {
    // Only fetch if user has admin privileges
    if (currentUser && ["ADMIN", "SUPER_ADMIN"].includes(currentUser.role)) {
      dispatch(
        fetchUsers({
          page: currentPage,
          limit: 10,
          search: searchTerm,
          role: roleFilter,
          status: statusFilter,
        })
      );
    }
  }, [
    dispatch,
    currentPage,
    searchTerm,
    roleFilter,
    statusFilter,
    currentUser,
  ]);

  // Handle search input with debounce
  const handleSearchChange = (value: string) => {
    dispatch(setSearchTermAction(value));
    dispatch(setCurrentPageAction(1)); // Reset to first page on search
  };

  const handleRoleFilterChange = (value: string) => {
    dispatch(setRoleFilterAction(value));
    dispatch(setCurrentPageAction(1)); // Reset to first page on filter change
  };

  const handleStatusFilterChange = (value: string) => {
    dispatch(setStatusFilterAction(value));
    dispatch(setCurrentPageAction(1)); // Reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPageAction(page));
  };

  const handleBlockUser = async (targetUser: User) => {
    // Check if current user can block/unblock the target user
    if (
      !canBlockUser(currentUser?.role as UserRole, targetUser.role as UserRole)
    ) {
      toast.error("You don't have permission to manage this user");
      return;
    }

    try {
      await dispatch(
        blockUser({
          userId: targetUser.id,
          blocked: !targetUser.isBlocked,
        })
      ).unwrap();

      toast.success(
        `User ${!targetUser.isBlocked ? "blocked" : "unblocked"} successfully`
      );

      // Refetch users to update the list
      dispatch(
        fetchUsers({
          page: currentPage,
          limit: 10,
          search: searchTerm,
          role: roleFilter,
          status: statusFilter,
        })
      );
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId: string, targetUserRole: UserRole) => {
    // Check if current user can delete the target user
    if (!canDeleteUser(currentUser?.role as UserRole, targetUserRole)) {
      toast.error("You don't have permission to delete this user");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success("User deleted successfully");

        // Refetch users to update the list
        dispatch(
          fetchUsers({
            page: currentPage,
            limit: 10,
            search: searchTerm,
            role: roleFilter,
            status: statusFilter,
          })
        );
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "ADMIN":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "POLICE":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "FIRE_SERVICE":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "DRIVER":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "CITIZEN":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  // Temporarily bypass UI role check - let backend handle authorization
  // if (user && !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
  //   return (
  //     <div className="flex items-center justify-center h-96">
  //       <div className="text-center space-y-4">
  //         <div className="text-6xl">🚫</div>
  //         <h2 className="text-2xl font-bold">Access Denied</h2>
  //         <p className="text-muted-foreground">
  //           You need admin privileges to access this page.
  //         </p>
  //         <p className="text-sm text-muted-foreground">
  //           Current role: <strong>{user?.role || "Unknown"}</strong>
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users in the system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateUserDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Users
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.emailVerified && u.phoneVerified).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.isBlocked).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => !u.isBlocked && !u.isDeleted).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="POLICE">Police</SelectItem>
                <SelectItem value="FIRE_SERVICE">Fire Service</SelectItem>
                <SelectItem value="DRIVER">Driver</SelectItem>
                <SelectItem value="CITIZEN">Citizen</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              Failed to load users. Please try again.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.profileImage}
                              alt={user.firstName}
                            />
                            <AvatarFallback>
                              {user.firstName.charAt(0)}
                              {user.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {user.firstName} {user.lastName}
                              {!canManageUser(
                                currentUser?.role as UserRole,
                                user.role as UserRole
                              ) && (
                                <span title="Cannot manage this user due to role hierarchy">
                                  <Lock className="h-3 w-3 text-amber-600" />
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getRoleBadgeColor(user.role)}
                        >
                          {user.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.isBlocked
                              ? "destructive"
                              : user.isDeleted
                              ? "secondary"
                              : "default"
                          }
                        >
                          {user.isDeleted
                            ? "Deleted"
                            : user.isBlocked
                            ? "Blocked"
                            : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge
                            variant={
                              user.emailVerified ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            Email {user.emailVerified ? "✓" : "✗"}
                          </Badge>
                          <Badge
                            variant={
                              user.phoneVerified ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            Phone {user.phoneVerified ? "✓" : "✗"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canManageUser(
                            currentUser?.role as UserRole,
                            user.role as UserRole
                          ) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setUserToUpdateRole(user);
                                setIsUpdateRoleDialogOpen(true);
                              }}
                              disabled={loading}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          )}
                          {!user.isDeleted && (
                            <>
                              {canBlockUser(
                                currentUser?.role as UserRole,
                                user.role as UserRole
                              ) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleBlockUser(user)}
                                  disabled={loading}
                                >
                                  {user.isBlocked ? (
                                    <UserCheck className="h-4 w-4" />
                                  ) : (
                                    <Ban className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                              {canDeleteUser(
                                currentUser?.role as UserRole,
                                user.role as UserRole
                              ) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteUser(
                                      user.id,
                                      user.role as UserRole
                                    )
                                  }
                                  disabled={loading}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalUsers > 10 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 10 + 1} to{" "}
            {Math.min(currentPage * 10, totalUsers)} of {totalUsers} users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedUser.profileImage}
                    alt={selectedUser.firstName}
                  />
                  <AvatarFallback className="text-lg">
                    {selectedUser.firstName.charAt(0)}
                    {selectedUser.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <Badge
                    variant="outline"
                    className={getRoleBadgeColor(selectedUser.role)}
                  >
                    {selectedUser.role.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      {selectedUser.email}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      {selectedUser.phoneNumber}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Role Capabilities</h4>
                  <div className="text-sm text-muted-foreground">
                    {getRoleCapabilities(selectedUser.role as UserRole)}
                  </div>
                  {!canManageUser(
                    currentUser?.role as UserRole,
                    selectedUser.role as UserRole
                  ) && (
                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border">
                      ⚠️ You cannot manage this user due to role hierarchy
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Account Status</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <Badge
                        variant={
                          selectedUser.isBlocked ? "destructive" : "default"
                        }
                        className="ml-2"
                      >
                        {selectedUser.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Email Verified:
                      </span>{" "}
                      <Badge
                        variant={
                          selectedUser.emailVerified ? "default" : "secondary"
                        }
                      >
                        {selectedUser.emailVerified ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Phone Verified:
                      </span>{" "}
                      <Badge
                        variant={
                          selectedUser.phoneVerified ? "default" : "secondary"
                        }
                      >
                        {selectedUser.phoneVerified ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Account Dates</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created:</span>{" "}
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Updated:</span>{" "}
                    {new Date(selectedUser.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                {canBlockUser(
                  currentUser?.role as UserRole,
                  selectedUser.role as UserRole
                ) && (
                  <Button
                    variant="outline"
                    onClick={() => handleBlockUser(selectedUser)}
                    disabled={loading}
                  >
                    {selectedUser.isBlocked ? "Unblock User" : "Block User"}
                  </Button>
                )}
                {canDeleteUser(
                  currentUser?.role as UserRole,
                  selectedUser.role as UserRole
                ) && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDeleteUser(
                        selectedUser.id,
                        selectedUser.role as UserRole
                      );
                      setIsViewDialogOpen(false);
                    }}
                    disabled={loading}
                  >
                    Delete User
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <CreateUserDialog
        isOpen={isCreateUserDialogOpen}
        onClose={() => setIsCreateUserDialogOpen(false)}
      />

      {/* Update User Role Dialog */}
      <UpdateUserRoleDialog
        isOpen={isUpdateRoleDialogOpen}
        onClose={() => {
          setIsUpdateRoleDialogOpen(false);
          setUserToUpdateRole(null);
        }}
        user={userToUpdateRole}
      />
    </div>
  );
}
