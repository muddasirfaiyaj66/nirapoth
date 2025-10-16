import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  notificationApi,
  Notification,
  NotificationStats,
  NotificationSearchParams,
  CreateNotificationData,
} from "@/lib/api/notifications";

export interface NotificationState {
  notifications: Notification[];
  stats: NotificationStats | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    type?: string;
    priority?: string;
    isRead?: boolean;
    dateFrom?: string;
    dateTo?: string;
  };
}

const initialState: NotificationState = {
  notifications: [],
  stats: null,
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (params: NotificationSearchParams = {}, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getMyNotifications(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notification/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadCount();
      return response.count;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

export const fetchNotificationStats = createAsyncThunk(
  "notification/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getNotificationStats();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch notification statistics"
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await notificationApi.markAsRead(notificationId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationApi.markAllAsRead();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete notification"
      );
    }
  }
);

export const deleteAllRead = createAsyncThunk(
  "notification/deleteAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationApi.deleteAllRead();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete read notifications"
      );
    }
  }
);

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async (data: CreateNotificationData, { rejectWithValue }) => {
    try {
      const response = await notificationApi.createNotification(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create notification"
      );
    }
  }
);

export const broadcastNotification = createAsyncThunk(
  "notification/broadcastNotification",
  async (
    data: {
      title: string;
      message: string;
      type: Notification["type"];
      priority?: Notification["priority"];
    },
    { rejectWithValue }
  ) => {
    try {
      await notificationApi.broadcastNotification(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to broadcast notification"
      );
    }
  }
);

export const sendToRole = createAsyncThunk(
  "notification/sendToRole",
  async (
    data: {
      role: string;
      title: string;
      message: string;
      type: Notification["type"];
      priority?: Notification["priority"];
    },
    { rejectWithValue }
  ) => {
    try {
      await notificationApi.sendToRole(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send notification to role"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<NotificationState["pagination"]>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<NotificationState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Ensure notifications array exists
      if (!state.notifications) {
        state.notifications = [];
      }
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // Fetch notification stats
      .addCase(fetchNotificationStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchNotificationStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        if (!state.notifications) {
          state.notifications = [];
          return;
        }
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload.id
        );
        if (index !== -1) {
          const wasUnread = !state.notifications[index].isRead;
          state.notifications[index] = action.payload;
          if (wasUnread) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        if (!state.notifications) {
          state.notifications = [];
          return;
        }
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.unreadCount = 0;
      })
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        if (!state.notifications) {
          state.notifications = [];
          return;
        }
        const notification = state.notifications.find(
          (n) => n.id === action.payload
        );
        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(
          (n) => n.id !== action.payload
        );
        state.pagination.total -= 1;
      })
      // Delete all read
      .addCase(deleteAllRead.fulfilled, (state) => {
        if (!state.notifications) {
          state.notifications = [];
          return;
        }
        state.notifications = state.notifications.filter((n) => !n.isRead);
        state.pagination.total = state.notifications.length;
      })
      // Create notification
      .addCase(createNotification.fulfilled, (state, action) => {
        if (!state.notifications) {
          state.notifications = [];
        }
        state.notifications.unshift(action.payload);
        if (!action.payload.isRead) {
          state.unreadCount += 1;
        }
      });
  },
});

export const {
  clearError,
  setPagination,
  setFilters,
  clearFilters,
  addNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
