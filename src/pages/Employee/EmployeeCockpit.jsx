/**
 * EmployeeCockpit.jsx
 * Figma-matched layout:
 *   Header  → "Welcome back, [Name] 👋"  |  Logout
 *   Section 1 → AttendanceWidget (4 navy stat cards + punch actions)
 *   Section 2 → ProjectsPreview
 *   Section 3 → WorkReportForm (textarea + inline reports list, submit btn)
 *
 * UserReportsList is rendered inside WorkReportForm now — NOT separately here.
 */
import React from "react";
import { Box, Typography, Divider, Badge, IconButton, TextField, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import AttendanceWidget from "../../components/AttendanceWidget";
import ProjectsPreview from "../../components/dashboard/ProjectsPreview";
import WorkReportForm from "../../components/dashboard/WorkReportForm";
import TeamChat from "../../components/TeamChat";
import Employeeeverything from "../../components/Employeeeverything";
import ProductionActivityLogger from "../admin-side/ProductionActivityLogger";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LayersIcon from "@mui/icons-material/Layers";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { NotificationBell } from "../../components/GlobalNotifications";
// import { useSocket } from "../../context/SocketContext";
// import { useToast } from "../../context/ToastContext";
const speakFemale = (text) => {
  // speakFemale: small helper to speak a message aloud using the browser voice.
  // Use when you want a short spoken confirmation or greeting (non-critical).
  if (!("speechSynthesis" in window)) return;
  // Cancel any ongoing speech to avoid overlapping or double triggers
  window.speechSynthesis.cancel();

  const speak = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return; // Wait for voices

    const utterance = new SpeechSynthesisUtterance(text);

    // Targeted search for high-quality female voices
    const femaleVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("google uk english female") ||
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("victoria") ||
        v.name.toLowerCase().includes("microsoft zira") ||
        v.name.toLowerCase().includes("salli"),
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else {
      // Fallback: increase pitch slightly
      utterance.pitch = 1.2;
    }

    utterance.rate = 0.95; // Natural pace
    window.speechSynthesis.speak(utterance);

    // Ensure we don't trigger again on this session
    window.speechSynthesis.onvoiceschanged = null;
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = speak;
  } else {
    speak();
  }
};

const EmployeeCockpit = () => {
  const navigate = useNavigate();
  const { deptId } = useParams();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const token = localStorage.getItem("token") || null;
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const [profile, setProfile] = React.useState(null);
  const [headId, setHeadId] = React.useState(null);
  const [tasksLoading, setTasksLoading] = React.useState(false);
  const [headTasks, setHeadTasks] = React.useState([]);
  const [taskPanelOpen, setTaskPanelOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = React.useState(false);
  const [openEverything, setOpenEverything] = React.useState(false);
  const [openFloor, setOpenFloor] = React.useState(false);
  const API_BASE_URL = "https://project-management-sodtware-backend-end.onrender.com";
  const PRIMARY = "#0f172a";
  const SECONDARY = "rgba(15,23,42,0.6)";

  const parseJwt = (tkn) => {
    try {
      if (!tkn) return null;
      const payload = tkn.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  };

  const openLogoutConfirm = () => {
    if (isLoggingOut) return;
    setLogoutConfirmOpen(true);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    // NOTE: GlobalNotifications now handles project toasts and beeps globally.
    // We keep the playBeep helper here for local uses (greetings, confirmations).
    setIsLoggingOut(true);
    try {
      if (token) {
        await axios.post(
          "https://project-management-sodtware-backend-end.onrender.com/admin/attendance",
          { action: "PUNCH_OUT" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
      }
    } catch (error) {
      console.error("Failed to punch out during logout", error);
    } finally {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const timeInMins = hours * 60 + minutes;

      let message = "";

      if (!token) {
        // Rule 4: Missing token/session
        message =
          "Attendance information appears incomplete. Please contact the authorized administrator for verification.";
      } else if (timeInMins >= 570 && timeInMins < 810) {
        // Rule 1: 09:30 AM - 01:30 PM
        message =
          "Please note, logging out before 1:30 PM will mark your attendance as half day. Kindly ensure your scheduled work is completed.";
      } else if (timeInMins >= 810 && timeInMins < 1020) {
        // Rule 2: 01:30 PM - 04:59 PM
        message =
          "Please note, your logout time is below the standard eight working hours. Only your actual worked duration will be recorded.";
      } else if (timeInMins >= 1020) {
        // Rule 3: 05:00 PM onwards (Successfully completed)
        if (timeInMins < 1110) {
          // 05:00 PM - 06:30 PM: Random evening wishes
          const wishes = [
            "Thank you. Your work session is recorded. Have a wonderful evening.",
            "Work session complete. Enjoy your evening and rest well.",
            "Successfully recorded. Wishing you a peaceful and pleasant evening ahead.",
            "Thank you for your hard work today. Have a great evening.",
          ];
          message = wishes[Math.floor(Math.random() * wishes.length)];
        } else {
          message =
            "Thank you. Your work session has been recorded successfully. Have a pleasant evening.";
        }
      } else {
        // Rule 4: Fallback / Early morning / Mismatch
        message =
          "Attendance information appears incomplete. Please contact the authorized administrator for verification.";
      }

      speakFemale(message);
      localStorage.clear();
      navigate("/");
    }
  };

  /* ── Report submitted callback ── */
  const handleReportSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  /* ── Fetch employee profile (API preserved exactly) ── */

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token) {
          const res = await axios.get(
            "https://project-management-sodtware-backend-end.onrender.com/employee_profile",
            {
              headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
              },
            },
          );
          const profileData = Array.isArray(res.data) ? res.data[0] : res.data;
          setProfile(profileData);
          console.log("emp profile", profileData.department);
          // socket.emit("join_department", profileData.department);
          // join department will be emitted in the socket effect below once socket & profile are ready
        }
      } catch (error) {
        console.error("Failed to fetch profile in Cockpit", error);
      }
    };
    fetchProfile();

    if (token) {
      const payload = parseJwt(token);
      const resolvedHeadId = payload?._id || payload?.id || payload?.userId || null;
      if (resolvedHeadId) {
        setHeadId(resolvedHeadId);
      }
    }
  }, [token]);

  

  React.useEffect(() => {
    if (profile && sessionStorage.getItem("justLoggedIn")) {
      const fName =
        profile.name?.split(" ")[0] ||
        profile.username?.split(" ")[0] ||
        "there";
      speakFemale(`Welcome to the dashboard, ${fName}.`);
      sessionStorage.removeItem("justLoggedIn");
    }
  }, [profile]);

  const fetchHeadTasks = async (resolvedHeadId) => {
    const effectiveHeadId = resolvedHeadId || headId;
    if (!effectiveHeadId) return;

    setTasksLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/admin/hr_assigned_tasks?headId=${effectiveHeadId}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setHeadTasks(res.data || []);
    } catch (error) {
      console.error("Failed to fetch head tasks", error);
      setHeadTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

  React.useEffect(() => {
    if (headId) {
      fetchHeadTasks(headId);
    }
  }, [headId]);

  const handleTaskIconClick = async () => {
    // Refresh tasks whenever the user opens the panel to keep data accurate
    try {
      await fetchHeadTasks(headId);
      setTaskPanelOpen((prev) => !prev);
    } catch (e) {
      console.error("Failed to refresh tasks on icon click", e);
      setTaskPanelOpen((prev) => !prev);
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      const payload = {
        headId: task.headId,
        title: task.title,
        priority: task.priority,
        deadline: task.deadline,
        assignedDate: task.assignedDate,
        status,
      };
      await axios.put(
        `${API_BASE_URL}/admin/hr_assigned_tasks/${task._id}`,
        payload,
      );
      setHeadTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status } : t)));
      setSuccessMessage("Task status updated");
      setTimeout(() => setSuccessMessage(null), 1500);
    } catch (err) {
      console.error("Error updating status:", err);
      setErrorMessage("Failed to update task status");
      setTimeout(() => setErrorMessage(null), 2000);
    }
  };

  /* Derive first name for greeting */
  const firstName =
    profile?.name?.split(" ")[0] || profile?.username?.split(" ")[0] || "there";

  return (
    <>
      <Box
        sx={{
          width: "100%",
          minHeight: "100%",
          py: { xs: 2.5, sm: 3, md: 3.5 },
          px: { xs: 2, sm: 2.5, md: 3 },
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: { xs: 3, sm: 3.5, md: 4 },
          bgcolor: "#f8f9fb",
        }}
      >
        {/* ══ Page Header ════════════════════════════════════════════════ */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Greeting */}
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                color: PRIMARY,
                fontSize: { xs: "1.25rem", sm: "1.45rem", md: "1.6rem" },
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Welcome back, {firstName}&nbsp;
              <span style={{ fontSize: "1.1em" }}>👋</span>
            </Typography>
            <Typography
              sx={{
                color: SECONDARY,
                fontSize: { xs: "0.78rem", sm: "0.85rem" },
                mt: 0.4,
                fontWeight: 400,
              }}
            >
              Here's your workday overview
            </Typography>
            {/* Everything / Project Hub + Floor triggers */}
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              <Box
                component="button"
                onClick={() => setOpenEverything(true)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2.5,
                  py: 0.8,
                  borderRadius: "10px",
                  border: "none",
                  background: PRIMARY,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": { opacity: 0.9, transform: "scale(1.02)" },
                }}
              >
                <AssignmentIcon sx={{ fontSize: 16 }} />
               calendar
              </Box>
              <Box
                component="button"
                onClick={() => setOpenFloor(true)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2.5,
                  py: 0.8,
                  borderRadius: "10px",
                  border: "1px solid rgba(15, 23, 42, 0.12)",
                  background: "#fff",
                  color: PRIMARY,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: "#f1f5f9", transform: "scale(1.02)" },
                }}
              >
                <LayersIcon sx={{ fontSize: 16 }} />
                Floor
              </Box>
            </Box>
          </Box>

          {/* Top actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, position: "relative" }}>
            <IconButton
              onClick={handleTaskIconClick}
              sx={{
                border: "1px solid rgba(15, 23, 42, 0.12)",
                bgcolor: "#ffffff",
                color: "#0f172a",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                "&:hover": { bgcolor: "#f1f5f9" },
              }}
            >
              <Badge badgeContent={headTasks.length} color="primary">
                <AssignmentIcon />
              </Badge>
            </IconButton>
            <NotificationBell />
            <Box
              component="button"
              onClick={openLogoutConfirm}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.2 },
                border: "1px solid rgba(15, 23, 42, 0.12)",
                borderRadius: "12px",
                background: "#ffffff",
                color: "#475569",
                fontWeight: 600,
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                cursor: "pointer",
                letterSpacing: "0.01em",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                mt: { xs: 0.3, sm: 0.2 },
                flexShrink: 0,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                "&:hover": {
                  background: "#f1f5f9",
                  color: "#0f172a",
                  borderColor: "rgba(15, 23, 42, 0.2)",
                },
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Box>
            {taskPanelOpen && (
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  mt: 1,
                  width: { xs: 320, sm: 360 },
                  maxWidth: "100%",
                  bgcolor: "#ffffff",
                  border: "1px solid rgba(15,23,42,0.12)",
                  borderRadius: "18px",
                  boxShadow: "0 18px 45px rgba(15,23,42,0.14)",
                  p: 2,
                  zIndex: 20,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: PRIMARY }}>
                    Your Assigned Tasks
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {successMessage && (
                      <Typography sx={{ color: 'green', fontSize: '0.85rem' }}>{successMessage}</Typography>
                    )}
                    {errorMessage && (
                      <Typography sx={{ color: 'red', fontSize: '0.85rem' }}>{errorMessage}</Typography>
                    )}
                    <Button size="small" onClick={() => setHeadTasks([])} sx={{ textTransform: 'none' }}>Clear</Button>
                  </Box>
                </Box>

                {tasksLoading ? (
                  <Typography sx={{ color: SECONDARY, fontSize: "0.9rem" }}>
                    Loading tasks...
                  </Typography>
                ) : headTasks.length === 0 ? (
                  <Typography sx={{ color: SECONDARY, fontSize: "0.9rem" }}>
                    No tasks assigned to you yet.
                  </Typography>
                ) : (
                  headTasks.map((task) => (
                    <Box
                      key={task._id || task.headId || task.title}
                      sx={{
                        py: 1.25,
                        borderBottom: "1px solid rgba(15,23,42,0.08)",
                        '&:last-of-type': { borderBottom: 'none' },
                      }}
                    >
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: PRIMARY, mb: 0.35 }}>
                        {task.title || task.task || "Untitled task"}
                      </Typography>
                      <Typography sx={{ color: SECONDARY, fontSize: "0.8rem", mb: 0.5 }}>
                        Priority: {task.priority || "Medium"}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: SECONDARY, fontSize: '0.8rem' }}>
                          Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}
                        </Typography>

                        <TextField
                          select
                          fullWidth={false}
                          size="small"
                          value={task.status || 'pending'}
                          onChange={(e) => handleStatusChange(task, e.target.value)}
                          sx={{
                            ml: 1,
                            minWidth: 120,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              backgroundColor: "#f8fafc",
                              fontSize: "0.9rem",
                              fontWeight: 600,
                              color: "#0f172a !important",
                              "&:hover fieldset": { borderColor: "#cbd5e1" },
                              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                            },
                            "& .MuiSelect-select": {
                              color: "#0f172a !important",
                            },
                          }}
                        >
                          <MenuItem value="pending">pending</MenuItem>
                          <MenuItem value="in_progress">in_progress</MenuItem>
                          <MenuItem value="completed">completed</MenuItem>
                          {/* <MenuItem value="cancelled">cancelled</MenuItem> */}
                        </TextField>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* ══ Section 1 — Attendance (4 navy stat cards + punch actions) ═ */}
        <AttendanceWidget currentUserId={token} />

        {/* Subtle divider */}
        <Divider sx={{ borderColor: "rgba(15,23,42,0.06)" }} />

        {/* ══ Section 2 — My Projects ════════════════════════════════════ */}
        <ProjectsPreview userId={token} maxProjects={9} />

        {/* Subtle divider */}
        <Divider sx={{ borderColor: "rgba(15,23,42,0.06)" }} />

        {/* ══ Section 3 — Daily Work Report (form + inline list) ═════════ */}
        <WorkReportForm
          deptId={deptId}
          profile={profile}
          onReportSubmitted={handleReportSubmitted}
        />

        {/* Bottom breathing room */}
        <Box sx={{ pb: { xs: 6, sm: 2 } }} />
      </Box>

      {/* Floating chat bubble */}
      <TeamChat />

      <Dialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        maxWidth="xs"
        fullWidth={false}
        PaperProps={{
          sx: {
            width: 360,
            maxWidth: "90vw",
            borderRadius: "18px",
            mx: "auto",
          },
        }}
      >
        <DialogTitle id="logout-dialog-title">Confirm logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to logout? Your current session will end.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setLogoutConfirmOpen(false);
              handleLogout();
            }}
            color="primary"
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floor / Production Activity Modal */}
      {openFloor && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10000,
            bgcolor: "#fff",
            overflow: "auto",
          }}
        >
          <ProductionActivityLogger onBack={() => setOpenFloor(false)} />
        </Box>
      )}

      {/* Everything / Project Hub Modal View */}
      {openEverything && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10000,
            bgcolor: "#fff",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              bgcolor: "#fff",
              p: 2,
              borderBottom: "1px solid #e0e0e0",
              zIndex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Hybrid Project Dashboard
            </Typography>
            <Box
              component="button"
              onClick={() => setOpenEverything(false)}
              sx={{
                p: 1,
                borderRadius: "50%",
                border: "none",
                background: "#f0f0f0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": { background: "#e0e0e0" },
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Box>
          </Box>
          <Employeeeverything deptId={deptId} />
        </Box>
      )}
    </>
  );
};

export default EmployeeCockpit;
