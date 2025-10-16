"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NotificationToast } from "./NotificationToast";
import { Notification } from "@/lib/api/notifications";
import { useSocketEvent } from "@/hooks/useSocket";
import { useAppDispatch } from "@/lib/store";
import {
  addNotification,
  fetchUnreadCount,
  markAsRead,
} from "@/lib/store/slices/notificationSlice";
import {
  initializeAudio,
  playNotificationSound,
} from "@/lib/utils/notificationSound";

interface ToastNotification extends Notification {
  toastId: string;
}

export function NotificationContainer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Initialize audio on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioInitialized) {
        initializeAudio();
        setAudioInitialized(true);
        // Remove listeners after first init
        document.removeEventListener("click", initAudio);
        document.removeEventListener("keydown", initAudio);
      }
    };

    document.addEventListener("click", initAudio);
    document.addEventListener("keydown", initAudio);

    return () => {
      document.removeEventListener("click", initAudio);
      document.removeEventListener("keydown", initAudio);
    };
  }, [audioInitialized]);

  const addToast = useCallback(
    (notification: Notification) => {
      const toastNotification: ToastNotification = {
        ...notification,
        toastId: `${notification.id || Date.now()}-${Math.random()}`,
      };

      setToasts((prev) => {
        // Keep max 3 toasts visible
        const newToasts = [toastNotification, ...prev];
        return newToasts.slice(0, 3);
      });

      // Play sound if audio is initialized
      if (audioInitialized) {
        playNotificationSound(notification.type, notification.priority);
      }
    },
    [audioInitialized]
  );

  const removeToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  }, []);

  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      dispatch(markAsRead(notificationId));
      dispatch(fetchUnreadCount());
    },
    [dispatch]
  );

  const handleView = useCallback(
    (notification: Notification) => {
      if (notification.actionUrl) {
        router.push(notification.actionUrl);
      } else {
        router.push("/notifications");
      }
    },
    [router]
  );

  // Listen for normal notifications
  useSocketEvent<Notification>("notification:new", (notification) => {
    console.log("🔔 New notification received (toast):", {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      type: notification.type,
      fullNotification: notification,
    });

    // Add to Redux store
    dispatch(addNotification(notification));
    dispatch(fetchUnreadCount());

    // Show toast
    addToast(notification);
  });

  // Listen for urgent notifications
  useSocketEvent<Notification>("notification:urgent", (notification) => {
    console.log("🚨 URGENT notification received (toast):", {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      type: notification.type,
      fullNotification: notification,
    });

    // Add to Redux store
    dispatch(addNotification(notification));
    dispatch(fetchUnreadCount());

    // Show toast
    addToast(notification);
  });

  return (
    <div className="fixed top-4 right-4 z-[99999] space-y-3 max-w-md w-full md:w-auto pointer-events-none px-4 md:px-0">
      <div className="space-y-3 pointer-events-auto">
        {toasts.length > 0
          ? toasts.map((toast) => (
              <NotificationToast
                key={toast.toastId}
                notification={toast}
                onClose={() => removeToast(toast.toastId)}
                onRead={() => handleMarkAsRead(toast.id)}
                onView={() => handleView(toast)}
              />
            ))
          : null}
      </div>
    </div>
  );
}
