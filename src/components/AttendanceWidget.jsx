/**
 * AttendanceWidget.jsx — Figma redesign.
 * 4 dark-navy stat cards: Date | Time | Attendance Status | Active Projects
 * All API / state logic preserved exactly.
 */
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import { Business, FreeBreakfast, Home } from "@mui/icons-material";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const AttendanceWidget = ({ currentUserId }) => {
  const { showToast } = useToast();
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [status, setStatus] = useState("ABSENT");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeProjects, setActiveProjects] = useState(0);
  const workStartRef = useRef(null);
  const breakStartRef = useRef(null);
  const totalBreakMsRef = useRef(0);
  const hasAutoPunchedRef = useRef(false);
  const ATTENDANCE_SESSION_KEY = "attendance_session";
  /* ── Clock tick ── */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ── Auto Punch In on Mount ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      // If we're still absent after 200ms (to allow local storage to load), auto punch in
      if (status === "ABSENT" && !hasAutoPunchedRef.current && !loading) {
        hasAutoPunchedRef.current = true;
        handlePunch("PUNCH_IN");
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [status, loading]);

  /* ── Restore session from localStorage ── */
  useEffect(() => {
    const saved = localStorage.getItem(ATTENDANCE_SESSION_KEY);
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.status === "WORKING") {
          workStartRef.current = s.workStart;
          totalBreakMsRef.current = s.totalBreakMs;
          setStatus("WORKING");
        } else if (s.status === "ON_BREAK") {
          workStartRef.current = s.workStart;
          breakStartRef.current = s.breakStart;
          totalBreakMsRef.current = s.totalBreakMs;
          setStatus("ON_BREAK");
        } else if (s.status === "COMPLETED") {
          setStatus("COMPLETED");
        }
      } catch {
        localStorage.removeItem(ATTENDANCE_SESSION_KEY);
      }
    }
  }, []);

  /* ── Fetch active project count ── */
  useEffect(() => {
    if (!currentUserId) return;
    axios
      .get("https://project-management-sodtware-backend-end.onrender.com/employee_included_proj", {
        headers: { Authorization: `${currentUserId}`, "Content-Type": "application/json" },
      })
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : [];
        setActiveProjects(arr.length);
      })
      .catch(() => { });
  }, [currentUserId]);

  const saveSession = (newStatus) => {
    localStorage.setItem(
      ATTENDANCE_SESSION_KEY,
      JSON.stringify({
        status: newStatus,
        workStart: workStartRef.current,
        breakStart: breakStartRef.current,
        totalBreakMs: totalBreakMsRef.current,
      })
    );
  };

  /* ── Elapsed timer ── */
  useEffect(() => {
    if (status === "WORKING" && workStartRef.current) {
      const workedMs =
        currentTime.getTime() - workStartRef.current - totalBreakMsRef.current;
      setElapsedSeconds(Math.max(0, Math.floor(workedMs / 1000)));
    }
  }, [status, currentTime]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(
      Math.floor((s % 3600) / 60)
    ).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* ── Punch actions (API preserved) ── */
  const handlePunch = async (action) => {
    setLoading(true);
    const now = currentTime.getTime();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "https://project-management-sodtware-backend-end.onrender.com/admin/attendance",
        { action },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (action === "PUNCH_IN") {
        workStartRef.current = now;
        totalBreakMsRef.current = 0;
        setElapsedSeconds(0);
        setStatus("WORKING");
        saveSession("WORKING");
      }
      if (action === "LUNCH_START") {
        breakStartRef.current = now;
        setStatus("ON_BREAK");
        saveSession("ON_BREAK");
      }
      if (action === "LUNCH_END") {
        totalBreakMsRef.current += now - breakStartRef.current;
        breakStartRef.current = null;
        setStatus("WORKING");
        saveSession("WORKING");
      }
      if (action === "PUNCH_OUT") {
        setStatus("COMPLETED");
        saveSession("COMPLETED");
        setTimeout(() => localStorage.removeItem(ATTENDANCE_SESSION_KEY), 1000);
      }
      showToast(`${action.replace("_", " ").toLowerCase()} executed.`, "success");
    } catch {
      showToast("Protocol execution failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived display values ── */
  const dateStr = currentTime.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "-"); // "Wed 18-03-2026"

  const timeStr = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }); // "09:30 PM"

  const attendanceLabel =
    status === "ABSENT"
      ? "Absent"
      : status === "WORKING"
        ? "Present"
        : status === "ON_BREAK"
          ? "On Break"
          : "Completed";

  const primaryAction = () => {
    if (status === "ABSENT") return handlePunch("PUNCH_IN");
    if (status === "WORKING") return handlePunch("PUNCH_OUT");
    if (status === "ON_BREAK") return handlePunch("LUNCH_END");
    return null;
  };

  const primaryLabel =
    status === "ABSENT"
      ? "Punch In"
      : status === "WORKING"
        ? "Punch Out"
        : status === "ON_BREAK"
          ? "Resume"
          : "Done";

  /* ── Shared card style ── */
  const cardStyle = {
    flex: "1 1 160px",
    minWidth: 0,
    background: "linear-gradient(145deg, #1a2d5a 0%, #0f1f42 60%, #0a1530 100%)",
    borderRadius: "16px",
    padding: "20px 20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(10,21,60,0.22)",
  };

  const cardBubble = {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    top: -40,
    right: -30,
  };

  const cardLabel = {
    color: "rgba(255,255,255,0.6)",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
    display: "flex",
    alignItems: "center",
    gap: 6,
    textTransform: "uppercase",
  };

  const cardValue = {
    color: "#fff",
    fontSize: "1.7rem",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
  };

  return (
    <Box>
      {/* ── 4 stat cards ── */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 1.5, sm: 2 },
          flexWrap: "wrap",
        }}
      >
        {/* Date */}
        <Box sx={cardStyle}>
          <Box sx={cardBubble} />
          <Box sx={cardLabel}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Date
          </Box>
          <Typography sx={cardValue}>{dateStr}</Typography>
        </Box>

        {/* Time */}
        <Box sx={cardStyle}>
          <Box sx={cardBubble} />
          <Box sx={cardLabel}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Time
          </Box>
          <Typography sx={{ ...cardValue, fontSize: { xs: "1.45rem", sm: "1.7rem" } }}>
            {status === "ABSENT" ? timeStr : formatTime(elapsedSeconds)}
          </Typography>
        </Box>

        {/* Attendance Status */}
        <Box sx={cardStyle}>
          <Box sx={cardBubble} />
          <Box sx={cardLabel}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Attendance Status
          </Box>
          <Typography sx={cardValue}>{attendanceLabel}</Typography>
        </Box>

        {/* Active Projects */}
        <Box sx={cardStyle}>
          <Box sx={cardBubble} />
          <Box sx={cardLabel}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Active Projects
          </Box>
          <Typography sx={cardValue}>
            {String(activeProjects).padStart(2, "0")}
          </Typography>
        </Box>
      </Box>

    </Box>
  );
};

export default AttendanceWidget;