import { api } from "./apiClient";

// Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | "REPORT_SUBMITTED"
    | "REPORT_APPROVED"
    | "REPORT_REJECTED"
    | "APPEAL_SUBMITTED"
    | "APPEAL_APPROVED"
    | "APPEAL_REJECTED"
    | "REWARD_EARNED"
    | "PENALTY_APPLIED"
    | "DEBT_CREATED"
    | "PAYMENT_RECEIVED"
    | "SYSTEM"
    | "INFO"
    | "WARNING"
    | "SUCCESS"
    | "ERROR";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: any;
  expiresAt?: string;
  createdAt: string;
  readAt?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    type: string;
    count: number;
  }[];
  byPriority: {
    priority: string;
    count: number;
  }[];
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type: Notification["type"];
  priority?: Notification["priority"];
  data?: any;
  targetUserId?: string;
  targetRole?: string;
}

export interface NotificationSearchParams {
  page?: number;
  limit?: number;
  type?: string;
  priority?: string;
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// API functions
export const notificationApi = {
  // Get all notifications for current user
  getMyNotifications: async (params?: NotificationSearchParams) => {
    return await api.get<{
      notifications: Notification[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/notifications", { params });
  },

  // Get unread notification count
  getUnreadCount: async () => {
    return await api.get<{ count: number }>("/notifications/unread-count");
  },

  // Get notification statistics
  getNotificationStats: async () => {
    return await api.get<NotificationStats>("/notifications/stats");
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    return await api.put<Notification>(`/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return await api.put("/notifications/read-all");
  },

  // Delete notification
  deleteNotification: async (notificationId: string) => {
    return await api.delete(`/notifications/${notificationId}`);
  },

  // Delete all read notifications
  deleteAllRead: async () => {
    return await api.delete("/notifications/read");
  },

  // Admin: Create notification
  createNotification: async (data: CreateNotificationData) => {
    return await api.post<Notification>("/notifications", data);
  },

  // Admin: Broadcast notification to all users
  broadcastNotification: async (data: {
    title: string;
    message: string;
    type: Notification["type"];
    priority?: Notification["priority"];
  }) => {
    return await api.post("/notifications/broadcast", data);
  },

  // Admin: Send notification to specific role
  sendToRole: async (data: {
    role: string;
    title: string;
    message: string;
    type: Notification["type"];
    priority?: Notification["priority"];
  }) => {
    return await api.post("/notifications/send-to-role", data);
  },
};
