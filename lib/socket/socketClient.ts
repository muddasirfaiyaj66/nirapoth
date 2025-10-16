import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let socket: Socket | null = null;

/**
 * Initialize socket connection
 */
export function initializeSocket(userId: string, role: string): Socket {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id);

    // Authenticate with user ID and role
    socket?.emit("authenticate", { userId, role });
  });

  socket.on("authenticated", (data) => {
    console.log("✅ Socket authenticated:", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error);
  });

  socket.on("error", (error) => {
    console.error("❌ Socket error:", error);
  });

  return socket;
}

/**
 * Get current socket instance
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Disconnect socket
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected and cleared");
  }
}

/**
 * Check if socket is connected
 */
export function isSocketConnected(): boolean {
  return socket !== null && socket.connected;
}
