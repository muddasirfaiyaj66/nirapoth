"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Trash2,
  Eye,
  AlertTriangle,
  DollarSign,
  Car,
  FileText,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "@/lib/store/slices/notificationSlice";
import { toast } from "sonner";
import { Notification } from "@/lib/api/notifications";

export default function NotificationDropdown() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notifications = [], unreadCount } = useAppSelector(
    (state) => state.notification
  );
  const [open, setOpen] = useState(false);

  // Fetch notifications and unread count
  useEffect(() => {
    dispatch(fetchUnreadCount());

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (open) {
      dispatch(fetchNotifications({ page: 1, limit: 10 }));
    }
  }, [open, dispatch]);

  const handleMarkAsRead = async (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.stopPropagation();
    try {
      await dispatch(markAsRead(notificationId)).unwrap();
      dispatch(fetchUnreadCount());
    } catch (error: any) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await dispatch(markAllAsRead()).unwrap();
      toast.success("All notifications marked as read");
      dispatch(fetchUnreadCount());
    } catch (error: any) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    try {
      await dispatch(deleteNotification(notificationId)).unwrap();
      dispatch(fetchUnreadCount());
    } catch (error: any) {
      toast.error("Failed to delete notification");
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already
    if (!notification.isRead) {
      await dispatch(markAsRead(notification.id));
      dispatch(fetchUnreadCount());
    }

    // Navigate based on notification type
    setOpen(false);

    switch (notification.type) {
      case "VIOLATION":
        if (notification.data?.violationId) {
          router.push(`/dashboard/violations`);
        }
        break;
      case "FINE":
        if (notification.data?.fineId) {
          router.push(`/dashboard/admin/finances/fines`);
        }
        break;
      case "PAYMENT":
        router.push(`/dashboard/admin/finances/revenue`);
        break;
      case "COMPLAINT":
        router.push(`/dashboard/admin/complaints`);
        break;
      case "VEHICLE":
        router.push(`/dashboard/vehicles`);
        break;
      case "LICENSE":
        router.push(`/dashboard/licenses`);
        break;
      default:
        router.push(`/notifications`);
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
        return "text-red-600";
      case "FINE":
        return "text-orange-600";
      case "PAYMENT":
        return "text-green-600";
      case "COMPLAINT":
        return "text-blue-600";
      case "VEHICLE":
        return "text-purple-600";
      case "LICENSE":
        return "text-indigo-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-1 text-xs"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.slice(0, 10).map((notification) => {
                const TypeIcon = getTypeIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                      !notification.isRead ? "bg-accent/30" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`flex-shrink-0 mt-1 ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium line-clamp-1">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(notification.createdAt)}
                          </span>
                          <div className="flex gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) =>
                                  handleMarkAsRead(e, notification.id)
                                }
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-600 hover:text-red-700"
                              onClick={(e) => handleDelete(e, notification.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setOpen(false);
            router.push("/notifications");
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
