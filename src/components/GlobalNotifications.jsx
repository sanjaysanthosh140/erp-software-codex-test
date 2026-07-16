const API_URL = import.meta.env.VITE_API_URL
import React from "react";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import { useToast } from "../context/ToastContext";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Button,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import CloseIcon from "@mui/icons-material/Close";

const STORAGE_KEY = "alkor_notifications";
const MAX_NOTIFICATIONS = 20;

const formatNotificationDate = (isoDate) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(isoDate));
  } catch (e) {
    return isoDate;
  }
};

const loadNotifications = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

const saveNotifications = (notifications) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new CustomEvent("alkor_notifications_update", {
      detail: notifications,
    }));
  } catch (e) {
    console.error("Failed to save notifications", e);
  }
};

const addNotification = (notification) => {
  const list = loadNotifications();
  const next = [notification, ...list].slice(0, MAX_NOTIFICATIONS);
  saveNotifications(next);
};

const playBeep = (opts = {}) => {
  // play a short beep using WebAudio. Simple and small.
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = opts.type || "sine";
    o.frequency.value = opts.freq || 880;
    g.gain.value = opts.volume || 0.12;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      try {
        ctx.close();
      } catch (e) {}
    }, opts.duration || 120);
  } catch (e) {
    // ignore
  }
};

export default function GlobalNotifications() {
  const socket = useSocket();
  const { showToast } = useToast();

  React.useEffect(() => {
    if (!socket) return;

    let joined = false;

    const joinIfNeeded = async () => {
      // Fetch profile once and emit `join_department` so server can send dept events.
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("adminToken");
        if (!token) return;
        const res = await axios.get(`${API_URL}/employee_profile`, {
          headers: { Authorization: token },
        });
        const profileData = Array.isArray(res.data) ? res.data[0] : res.data;
        if (profileData && profileData.department) {
          socket.emit("join_department", profileData.department);
          socket.emit("register", profileData._id);
          joined = true;
        }
      } catch (e) {
        console.error("Error in joinIfNeeded:", e);
      }
    };

    // Wait for socket to be connected before joining
    const handleConnect = () => {
      joinIfNeeded();
    };

    // If socket is already connected, join immediately
    if (socket.connected) {
      joinIfNeeded();
    } else {
      // Otherwise, wait for connection
      socket.on("connect", handleConnect);
    }

    // Also rejoin on reconnection
    socket.on("reconnect", handleConnect);

    // When the server notifies about projects, show a small toast and beep.
    const handleNew = (data) => {
      const message = `New project ${data.title} added.`;
      showToast(message, "success");
      addNotification({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: "New project",
        message,
        receivedAt: new Date().toISOString(),
      });
      playBeep({ freq: 880, duration: 140 });
    };

    const handleDelete = (data) => {
      const message = `Project deleted: ${data.title}`;
      showToast(message, "info");
      addNotification({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: "Project removed",
        message,
        receivedAt: new Date().toISOString(),
      });
      playBeep({ freq: 520, duration: 140 });
    };

    const handel_custom_proj = (data) => {
      const message = `New custom project client ${data.projectTilte} added.`;
      showToast(message, "success");
      addNotification({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: "Custom project",
        message,
        receivedAt: new Date().toISOString(),
      });
      playBeep({ freq: 880, duration: 140 });
    };

    const handlecustom_proj_delete = (data) => {
      const message = `Project ${data.clientname} has been removed from ${data.department} by ${data.headname}.`;
      console.log("data from delete event", data);
      showToast(message, "info");
      addNotification({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: "Custom project removed",
        message,
        receivedAt: new Date().toISOString(),
      });
      playBeep({ freq: 520, duration: 140 });
    };

    const handle_task_assigen = (data) => {
      const message = `Task assigned: ${data.desc}`;
      console.log("assigned task", data.desc);
      showToast(message, "info");
      addNotification({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: "Task assigned",
        message,
        receivedAt: new Date().toISOString(),
      });
      playBeep({ freq: 580, duration: 240 });
    };

    const handle_account_notification = (data) => {
      console.log("account_data form backend", data);
      const message = `Work completion confirmed for project ${data.projectName} under the ${data.department} department. Billing can now be processed.`;
      showToast(message, "info");
      addNotification({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: "Billing update",
        message,
        receivedAt: new Date().toISOString(),
      });
      playBeep({ freq: 800, duration: 140 });
    };
    socket.on("new_project", handleNew);
    socket.on("delete_project", handleDelete);
    socket.on("custom_project", handel_custom_proj);
    socket.on("remove_custom_client", handlecustom_proj_delete);
    socket.on("assigned_task", handle_task_assigen);
    socket.on("new_billing_entry", handle_account_notification);
    return () => {
      if (joined && socket && socket.connected) {
        // Optionally leave room
      }
      socket.off("connect", handleConnect);
      socket.off("reconnect", handleConnect);
      socket.off("new_project", handleNew);
      socket.off("delete_project", handleDelete);
      socket.off("custom_project", handel_custom_proj);
      socket.off("remove_custom_client", handlecustom_proj_delete);
      socket.off("assigned_task", handle_task_assigen);
      socket.off("new_billing_entry", handle_account_notification);
    };
  }, [socket, showToast]);

  return null;
}

export function NotificationBell() {
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(loadNotifications);

  React.useEffect(() => {
    const handleStorage = () => setNotifications(loadNotifications());
    const handleCustom = (event) => setNotifications(Array.isArray(event.detail) ? event.detail : loadNotifications());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("alkor_notifications_update", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("alkor_notifications_update", handleCustom);
    };
  }, []);

  const unreadCount = notifications.length;

  const handleClear = () => {
    saveNotifications([]);
    setNotifications([]);
  };

  return (
    <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <IconButton
        onClick={() => setOpen((prev) => !prev)}
        sx={{ color: "#0f172a", background: "rgba(15,23,42,0.04)", p: 1.2, borderRadius: "14px", transition: "all 0.2s", '&:hover': { background: 'rgba(15,23,42,0.08)' } }}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {open && (
        <Box
          sx={{
            position: "absolute",
            top: 52,
            right: 0,
            width: { xs: 300, sm: 360, md: 400 },
            maxHeight: 420,
            overflowY: "auto",
            bgcolor: "#fff",
            border: "1px solid rgba(15, 23, 42, 0.12)",
            borderRadius: "20px",
            boxShadow: "0 30px 60px rgba(15, 23, 42, 0.12)",
            zIndex: 1400,
          }}
        >
          <Box sx={{ px: 2.5, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>
              Notifications
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Button
                size="small"
                onClick={handleClear}
                startIcon={<ClearAllIcon sx={{ fontSize: 18 }} />}
                sx={{ textTransform: "none", color: "#475569", minWidth: 0 }}
              >
                Clear
              </Button>
              <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "#64748b" }}>
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
          <Divider sx={{ borderColor: "rgba(15, 23, 42, 0.08)" }} />
          <Box sx={{ p: 2 }}>
            {notifications.length === 0 ? (
              <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
                No notifications yet.
              </Typography>
            ) : (
              notifications.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: "rgba(239, 246, 255, 0.95)",
                    borderRadius: "16px",
                    transition: "transform 0.2s",
                    '&:hover': { transform: 'translateY(-1px)' },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 0.7, fontSize: "0.98rem" }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#475569", fontSize: "0.92rem", whiteSpace: "pre-line" }}>
                    {item.message}
                  </Typography>
                  <Typography sx={{ color: "#94a3b8", fontSize: "0.8rem", mt: 1 }}>
                    {formatNotificationDate(item.receivedAt)}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
