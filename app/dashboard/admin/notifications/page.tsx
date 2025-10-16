"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Send,
  Users,
  User,
  Shield,
  AlertTriangle,
  DollarSign,
  Car,
  FileText,
  Settings,
  History,
  Plus,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  createNotification,
  broadcastNotification,
  sendToRole,
  fetchNotifications,
} from "@/lib/store/slices/notificationSlice";
import { toast } from "sonner";
import { Notification } from "@/lib/api/notifications";
import { api } from "@/lib/api/apiClient";

interface NotificationFormData {
  title: string;
  message: string;
  type: Notification["type"];
  priority: Notification["priority"];
  targetType: "all" | "role" | "user";
  targetRole?: string;
  targetUserId?: string;
  targetUserIds?: string[]; // For multiple users
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { notifications = [], loading } = useAppSelector(
    (state) => state.notification
  );

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [openUserSelect, setOpenUserSelect] = useState(false);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    message: "",
    type: "SYSTEM",
    priority: "NORMAL",
    targetType: "all",
    targetUserIds: [],
  });

  // Check if user has permission - Only ADMIN and SUPER_ADMIN
  const canCreateNotification =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (user && !canCreateNotification) {
      toast.error(
        "Access Denied: Only administrators can broadcast notifications"
      );
      router.push("/dashboard");
    }
  }, [user, canCreateNotification, router]);

  useEffect(() => {
    if (canCreateNotification) {
      dispatch(fetchNotifications({ page: 1, limit: 50 }));
      // Fetch users for the dropdown
      fetchUsers();
    }
  }, [canCreateNotification, dispatch]);

  // Fetch all users for dropdown
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await api.get<{
        users: User[];
        pagination: any;
      }>("/admin/users", { params: { page: 1, limit: 1000 } });
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      title: "",
      message: "",
      type: "SYSTEM",
      priority: "NORMAL",
      targetType: "all",
      targetUserIds: [],
    });
    // Reset selected users
    setSelectedUserIds([]);
    // Close dialog
    setIsCreateDialogOpen(false);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      // Reset when dialog is closed
      handleCancel();
    } else {
      setIsCreateDialogOpen(open);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate target-specific requirements
    if (formData.targetType === "role" && !formData.targetRole) {
      toast.error("Please select a role to send the notification to");
      return;
    }

    if (
      formData.targetType === "user" &&
      (!selectedUserIds || selectedUserIds.length === 0)
    ) {
      toast.error(
        "Please select at least one user to send the notification to"
      );
      return;
    }

    try {
      if (formData.targetType === "all") {
        // Broadcast to all users
        await dispatch(
          broadcastNotification({
            title: formData.title,
            message: formData.message,
            type: formData.type,
            priority: formData.priority,
          })
        ).unwrap();
        toast.success("Notification sent to all users!");
      } else if (formData.targetType === "role" && formData.targetRole) {
        // Send to specific role
        await dispatch(
          sendToRole({
            role: formData.targetRole,
            title: formData.title,
            message: formData.message,
            type: formData.type,
            priority: formData.priority,
          })
        ).unwrap();
        toast.success(`Notification sent to all ${formData.targetRole}s!`);
      } else if (formData.targetType === "user" && selectedUserIds.length > 0) {
        // Send to specific users (multiple)
        for (const userId of selectedUserIds) {
          await dispatch(
            createNotification({
              title: formData.title,
              message: formData.message,
              type: formData.type,
              priority: formData.priority,
              targetUserId: userId,
            })
          ).unwrap();
        }
        toast.success(
          `Notification sent to ${selectedUserIds.length} user(s) successfully!`
        );
      }

      // Reset form and close dialog
      handleCancel();

      // Refresh the notifications list to show the newly created one
      dispatch(fetchNotifications({ page: 1, limit: 50 }));
    } catch (error: any) {
      toast.error(error?.message || "Failed to send notification");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VIOLATION":
        return AlertTriangle;
      case "FINE":
      case "PAYMENT":
        return DollarSign;
      case "COMPLAINT":
        return FileText;
      case "VEHICLE":
        return Car;
      case "LICENSE":
        return Shield;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "VIOLATION":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "FINE":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "PAYMENT":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "COMPLAINT":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "VEHICLE":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "LICENSE":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-600 text-white";
      case "HIGH":
        return "bg-orange-600 text-white";
      case "NORMAL":
        return "bg-yellow-600 text-white";
      case "LOW":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  if (!canCreateNotification) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to manage notifications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notification Management
          </h1>
          <p className="text-muted-foreground">
            Create and send notifications to users
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Broadcast to All
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Send notification to all users in the system
            </p>
            <Button
              onClick={() => {
                setFormData({ ...formData, targetType: "all" });
                setIsCreateDialogOpen(true);
              }}
              className="w-full"
            >
              Broadcast
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              Send to Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Target specific user roles (Citizens, Police, Admins)
            </p>
            <Button
              onClick={() => {
                setFormData({ ...formData, targetType: "role" });
                setIsCreateDialogOpen(true);
              }}
              variant="outline"
              className="w-full"
            >
              Select Role
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-green-600" />
              Send to User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Send notification to a specific user
            </p>
            <Button
              onClick={() => {
                setFormData({ ...formData, targetType: "user" });
                setIsCreateDialogOpen(true);
              }}
              variant="outline"
              className="w-full"
            >
              Select User
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notification Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => {
                setFormData({
                  ...formData,
                  type: "SYSTEM",
                  priority: "HIGH",
                  title: "System Maintenance",
                  message:
                    "The system will undergo maintenance on [DATE] from [TIME] to [TIME]. Please plan accordingly.",
                });
                setIsCreateDialogOpen(true);
              }}
            >
              <div className="text-left">
                <div className="font-semibold">System Maintenance</div>
                <div className="text-xs text-muted-foreground">
                  Notify about scheduled maintenance
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => {
                setFormData({
                  ...formData,
                  type: "SYSTEM",
                  priority: "URGENT",
                  title: "Emergency Alert",
                  message:
                    "Emergency situation in [AREA]. Please avoid the area and follow official instructions.",
                });
                setIsCreateDialogOpen(true);
              }}
            >
              <div className="text-left">
                <div className="font-semibold">Emergency Alert</div>
                <div className="text-xs text-muted-foreground">
                  Send urgent emergency notifications
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => {
                setFormData({
                  ...formData,
                  type: "SYSTEM",
                  priority: "NORMAL",
                  title: "New Feature Available",
                  message:
                    "We've just launched a new feature: [FEATURE NAME]. Check it out now!",
                });
                setIsCreateDialogOpen(true);
              }}
            >
              <div className="text-left">
                <div className="font-semibold">New Feature</div>
                <div className="text-xs text-muted-foreground">
                  Announce new features
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => {
                setFormData({
                  ...formData,
                  type: "WARNING",
                  priority: "HIGH",
                  title: "Traffic Violation Alert",
                  message:
                    "Multiple violations detected in [AREA]. Increased police presence active.",
                });
                setIsCreateDialogOpen(true);
              }}
            >
              <div className="text-left">
                <div className="font-semibold">Violation Alert</div>
                <div className="text-xs text-muted-foreground">
                  Alert about violations
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => {
                setFormData({
                  ...formData,
                  type: "PAYMENT_RECEIVED",
                  priority: "NORMAL",
                  title: "Payment Reminder",
                  message:
                    "You have pending fines that are due soon. Please make payment to avoid late fees.",
                });
                setIsCreateDialogOpen(true);
              }}
            >
              <div className="text-left">
                <div className="font-semibold">Payment Reminder</div>
                <div className="text-xs text-muted-foreground">
                  Remind about pending payments
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => {
                setFormData({
                  ...formData,
                  type: "WARNING",
                  priority: "HIGH",
                  title: "License Expiry Reminder",
                  message:
                    "Your driving license will expire soon. Please renew it before [DATE].",
                });
                setIsCreateDialogOpen(true);
              }}
            >
              <div className="text-left">
                <div className="font-semibold">License Reminder</div>
                <div className="text-xs text-muted-foreground">
                  Remind about license expiry
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications Sent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Notifications Sent
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications sent yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 10).map((notification) => {
                const TypeIcon = getTypeIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className="p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm">
                            {notification.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className={getPriorityColor(notification.priority)}
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getTypeColor(notification.type)}
                          >
                            {notification.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Notification Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Notification</DialogTitle>
            <DialogDescription>
              Send a notification to users in the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Target Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience *</label>
              <Tabs
                value={formData.targetType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    targetType: value as "all" | "role" | "user",
                  })
                }
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="role">By Role</TabsTrigger>
                  <TabsTrigger value="user">Specific User</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <div className="p-4 bg-accent/50 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-center">
                      This notification will be sent to all users in the system
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="role" className="mt-4">
                  <Select
                    value={formData.targetRole}
                    onValueChange={(value) =>
                      setFormData({ ...formData, targetRole: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CITIZEN">Citizens</SelectItem>
                      <SelectItem value="POLICE">Police Officers</SelectItem>
                      <SelectItem value="ADMIN">Administrators</SelectItem>
                      <SelectItem value="SUPER_ADMIN">
                        Super Administrators
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TabsContent>
                <TabsContent value="user" className="mt-4">
                  <div className="space-y-2">
                    <Popover
                      open={openUserSelect}
                      onOpenChange={setOpenUserSelect}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openUserSelect}
                          className="w-full justify-between"
                          disabled={loadingUsers}
                        >
                          {selectedUserIds.length === 0
                            ? loadingUsers
                              ? "Loading users..."
                              : "Select users..."
                            : `${selectedUserIds.length} user(s) selected`}
                          <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[500px] p-0">
                        <Command>
                          <CommandInput placeholder="Search users..." />
                          <CommandEmpty>No users found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {users.map((u) => (
                              <CommandItem
                                key={u.id}
                                value={u.id}
                                onSelect={() => {
                                  setSelectedUserIds((current) =>
                                    current.includes(u.id)
                                      ? current.filter((id) => id !== u.id)
                                      : [...current, u.id]
                                  );
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    selectedUserIds.includes(u.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {u.firstName} {u.lastName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {u.email} • {u.role}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Display selected users */}
                    {selectedUserIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedUserIds.map((id) => {
                          const selectedUser = users.find((u) => u.id === id);
                          return selectedUser ? (
                            <Badge
                              key={id}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {selectedUser.firstName} {selectedUser.lastName}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() =>
                                  setSelectedUserIds((current) =>
                                    current.filter((userId) => userId !== id)
                                  )
                                }
                              />
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Select multiple users to send this notification to
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Notification Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type *</label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as Notification["type"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SYSTEM">System</SelectItem>
                  <SelectItem value="INFO">Information</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                  <SelectItem value="REPORT_SUBMITTED">
                    Report Submitted
                  </SelectItem>
                  <SelectItem value="REPORT_APPROVED">
                    Report Approved
                  </SelectItem>
                  <SelectItem value="REPORT_REJECTED">
                    Report Rejected
                  </SelectItem>
                  <SelectItem value="REWARD_EARNED">Reward Earned</SelectItem>
                  <SelectItem value="PENALTY_APPLIED">
                    Penalty Applied
                  </SelectItem>
                  <SelectItem value="DEBT_CREATED">Debt Created</SelectItem>
                  <SelectItem value="PAYMENT_RECEIVED">
                    Payment Received
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority *</label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    priority: value as Notification["priority"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="Enter notification title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Message *</label>
              <Textarea
                placeholder="Enter notification message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.message.length} characters
              </p>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <div className="p-4 border rounded-lg bg-accent/30">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${getTypeColor(
                      formData.type
                    )}`}
                  >
                    {(() => {
                      const Icon = getTypeIcon(formData.type);
                      return <Icon className="h-4 w-4" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm">
                        {formData.title || "Notification Title"}
                      </h4>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(formData.priority)}
                      >
                        {formData.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formData.message || "Notification message"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
