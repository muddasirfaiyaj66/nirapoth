"use client";

import { useEffect, useState } from "react";
import {
  X,
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Notification } from "@/lib/api/notifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  onRead: () => void;
  onView: () => void;
}

export function NotificationToast({
  notification,
  onClose,
  onRead,
  onView,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    console.log("📋 NotificationToast rendered with:", {
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      type: notification.type,
    });

    const duration = notification.priority === "URGENT" ? 15000 : 8000;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [notification]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleView = () => {
    onView();
    handleClose();
    onRead();
  };

  const getIcon = () => {
    switch (notification.priority) {
      case "URGENT":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case "HIGH":
        return <AlertTriangle className="h-6 w-6 text-orange-500" />;
      case "NORMAL":
        return <Info className="h-6 w-6 text-blue-500" />;
      case "LOW":
        return <CheckCircle className="h-6 w-6 text-gray-500" />;
      default:
        return <Bell className="h-6 w-6 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.priority) {
      case "URGENT":
        return "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/50";
      case "HIGH":
        return "border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/50";
      case "NORMAL":
        return "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/50";
      case "LOW":
        return "border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-800/50";
      default:
        return "border-l-4 border-blue-500 bg-white dark:bg-gray-800";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card
            className={`${getBgColor()} shadow-lg border-2 ${
              notification.priority === "URGENT" ? "animate-pulse-slow" : ""
            }`}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">{getIcon()}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                      {notification.title || "Notification"}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={handleClose}
                    >
                      <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3 mb-3 font-medium">
                    {notification.message || "You have a new notification"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="h-7 text-xs"
                      onClick={handleView}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => {
                        onRead();
                        handleClose();
                      }}
                    >
                      Mark Read
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar for auto-close */}
            <motion.div
              className="h-1 bg-primary"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{
                duration: notification.priority === "URGENT" ? 15 : 8,
                ease: "linear",
              }}
            />
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
