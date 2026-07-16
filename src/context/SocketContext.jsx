const API_URL = import.meta.env.VITE_API_URL;
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

// Simple socket provider
// Purpose: create ONE shared Socket.IO connection for the whole app.
// Usage: wrap your app with <SocketProvider> and call `useSocket()` to get the socket.
// Notes: it reads `localStorage.token` or `localStorage.adminToken` to authenticate.
// It reactively reconnects when either token changes.

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [currentToken, setCurrentToken] = useState(
    localStorage.getItem("token") || localStorage.getItem("adminToken")
  );

  // Monitor token changes and manage socket connection
  useEffect(() => {
    // Polling to detect token changes in real-time
    const pollInterval = setInterval(() => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("adminToken");
      if (token !== currentToken) {
        setCurrentToken(token);
      }
    }, 500);

    return () => clearInterval(pollInterval);
  }, [currentToken]);

  // Create/disconnect socket based on token
  useEffect(() => {
    if (!currentToken) {
      // No token, disconnect
      if (socket) {
        try {
          socket.disconnect();
        } catch (e) {
          // ignore
        }
        setSocket(null);
      }
      return;
    }

    // Token exists, create socket
    const s = io(`${API_URL}`, {
      auth: { token: currentToken },
      transports: ["websocket"],
    });

    setSocket(s);

    return () => {
      try {
        s.disconnect();
      } catch (e) {
        // ignore
      }
      setSocket(null);
    };
  }, [currentToken]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketContext;
