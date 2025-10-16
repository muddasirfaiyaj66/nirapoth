import { useEffect, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";
import {
  initializeSocket,
  disconnectSocket,
  getSocket,
} from "@/lib/socket/socketClient";
import { useAppSelector } from "@/lib/store";

export function useSocket() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      socketRef.current = initializeSocket(user.id, user.role);
    }

    return () => {
      // Cleanup on unmount
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  const socket = getSocket();

  return {
    socket,
    isConnected: socket?.connected || false,
  };
}

export function useSocketEvent<T = any>(
  eventName: string,
  callback: (data: T) => void
) {
  const { socket } = useSocket();
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!socket) return;

    const handler = (data: T) => {
      callbackRef.current(data);
    };

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [socket, eventName]);
}
