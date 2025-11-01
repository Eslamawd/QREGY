import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket"], // يقلّل مشاكل CORS
    });
  } else if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const joinKitchen = (restaurant_id) => {
  socket?.emit("joinKitchen", { restaurant_id });
};
export const joinCashier = (restaurant_id) => {
  socket?.emit("joinCashier", { restaurant_id });
};

export const joinOrder = (order_id) => {
  socket?.emit("joinOrder", { order_id });
};

export const onNewOrder = (callback) => {
  socket?.on("new_order", callback);
};

export const onOrderUpdated = (callback) => {
  socket?.on("order_updated", callback);
};
