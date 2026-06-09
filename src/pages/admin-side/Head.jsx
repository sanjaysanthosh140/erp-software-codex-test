import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Stack,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Fade,
  alpha,
  Divider,
} from "@mui/material";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import EditIcon from "@mui/icons-material/Edit";
// import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryIcon from "@mui/icons-material/History";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import GridViewIcon from "@mui/icons-material/GridView";
import NotesIcon from "@mui/icons-material/Notes";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import CreateProjectDialog from "../../components/CreateProjectDialog";
import TeamChat from "../../components/TeamChat";
import ProductionActivityLogger from "./ProductionActivityLogger";
// import EverythingComponent from "../../components/EverythingComponent";
import io from "socket.io-client";
import { NotificationBell } from "../../components/GlobalNotifications";
// --- iOS Liquid Glass Design Constants ---
const PRIMARY_BG = "#e6edf5";
const SECONDARY_BG = "#d9e3ef";
const TERTIARY_BG = "#cfd8e5";

const glassEffect = {
  background: "rgba(255, 255, 255, 1)",
  backdropFilter: "blur(25px) saturate(160%)",
  border: "1px solid rgba(255, 255, 255, 0.7)",
  borderRadius: "28px",
  boxShadow:
    "0 15px 45px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 1)",
  transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
  position: "relative",
  overflow: "hidden",
};

const iPhoneGlassButton = {
  background: "rgba(255, 255, 255, 1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.7)",
  borderRadius: "20px",
  color: "#1e293b",
  fontWeight: 1000,
  textTransform: "none",
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.04)",
  transition: "all 0.4s ease",
  "& .MuiButton-startIcon svg": { fontSize: 24 },
  "&:hover": {
    background: "rgba(255, 255, 255, 1)",
    transform: "translateY(-4px)",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(255, 255, 255, 1)",
  },
};

const Head = () => {
  const navigate = useNavigate();
  const API_BASE_URL = "https://project-management-sodtware-backend-end.onrender.com";
  const socket = io(API_BASE_URL);
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole") || "";
    if (!token || role.toLowerCase() !== "head") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin");
  };
  const [tasks, setTasks] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [activeView, setActiveView] = useState("dashboard"); // 'dashboard' or 'production-activity'
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    priority: "Medium",
    deadline: "",
    status: "pending",
    desc: "",
  });
  const [openAddToAccountsDialog, setOpenAddToAccountsDialog] = useState(false);
  const [projects, setProjects] = useState([]);
  const [accountFormData, setAccountFormData] = useState({
    projectId: "",
    status: "completed",
    description: "",
    department: "",
  });

  const accountFieldStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      color: "#0f172a",
      borderRadius: "12px",
    },
    "& .MuiOutlinedInput-input": {
      color: "#0f172a",
    },
    "& .MuiInputLabel-root": {
      color: "#0f172a",
    },
    "& .MuiFormHelperText-root": {
      color: "#475569",
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: "#2563eb",
    },
  };

  const getTokenPayload = () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return {};
      const payload = token.split(".")[1];
      if (!payload) return {};
      return JSON.parse(atob(payload));
    } catch (e) {
      return {};
    }
  };

  const getHeadIdFromToken = () => {
    const payload = getTokenPayload();
    return payload.id || payload._id || null;
  };

  const getDepartmentFromToken = () => {
    const payload = getTokenPayload();
    return payload.department || payload.dept || payload.departmentName || "";
  };

  const fetchHeadTasks = async () => {
    try {
      const headId = getHeadIdFromToken();
      if (!headId) return;
      const res = await axios.get(
        `${API_BASE_URL}/admin/hr_assigned_tasks?headId=${headId}`,
      );
      console.log("tasks from admin", res.data, headId);
      setTasks(res.data || []);
    } catch (err) {
      console.error("Error fetching head tasks:", err);
      setError("Failed to fetch assigned tasks");
    }
  };

  const fetchHeadProjectOptions = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_BASE_URL}/admin/headProj`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching project options:", err);
    }
  };

  const handleAccountInputChange = (e) => {
    const { name, value } = e.target;
    setAccountFormData({ ...accountFormData, [name]: value });
  };

  const handleAddToAccountsSubmit = async () => {
    const selectedProject = projects.find(
      (project) => project._id === accountFormData.projectId,
    );

    const payload = {
      projectId: accountFormData.projectId,
      projectName:
        selectedProject?.title ||
        selectedProject?.projectName ||
        selectedProject?.name ||
        "",
      status: accountFormData.status,
      description: accountFormData.description,
      department: accountFormData.department,
      headId: getHeadIdFromToken(),
      departmentName: getDepartmentFromToken(),
    };

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `${API_BASE_URL}/admin/add_to_accounts`,
        payload,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        },
      );

      setSuccess("Project entry saved for billing display");
      setOpenAddToAccountsDialog(false);
      setAccountFormData({
        projectId: "",
        status: "completed",
        description: "",
        department: "",
      });
      setTimeout(() => setSuccess(null), 2000);
      navigate("/head/billings");
    } catch (err) {
      console.error("Error saving billing entry:", err);
      setError("Failed to save billing entry. Please try again.");
    }
  };

  const formatHeadAssignmentSource = (task) => {
    const r = (
      task.admin ||
      task.role ||
      task.assignedByRole ||
      ""
    ).toLowerCase();
    if (r === "ceo" || r === "admin" || r === "superadmin") {
      return task.assignedByName
        ? `CEO · ${task.assignedByName}`
        : "CEO / Management";
    }
    if (r === "hr") {
      return task.assignedByName
        ? `HR · ${task.assignedByName}`
        : "HR Department";
    }
    return r.toUpperCase() || "General Admin";
  };

  useEffect(() => {
    fetchHeadTasks();
    fetchHeadProjectOptions();
  }, []);

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
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status } : t)),
      );
      setSuccess("Task status updated");
      setTimeout(() => setSuccess(null), 1500);
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update task status");
    }
  };

  // Status colors
  const statusColors = {
    pending: "#ff9c6e",
    in_progress: "#00d4ff",
    completed: "#4ade80",
  };

  // Priority colors
  const priorityColors = {
    Low: "#4ade80",
    Medium: "#fbbf24",
    High: "#ff7875",
    Critical: "#ff4d4f",
  };

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingId(task.id);
      setFormData({
        title: task.title,
        priority: task.priority,
        deadline: task.deadline,
        status: task.status,
        desc: task.desc,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        priority: "Medium",
        deadline: "",
        status: "pending",
        desc: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrUpdateTask = async () => {
    if (!formData.title.trim()) {
      setError("Title is required!");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Add new task via API (POST only)
      console.log("form data", formData);
      const response = await axios.post(
        "https://project-management-sodtware-backend-end.onrender.com/admin/add_task",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Task created:", response.data);
      const newTask = {
        id: response.data.id || Math.max(...tasks.map((t) => t.id), 100) + 1,
        ...formData,
      };
      setTasks([newTask, ...tasks]);
      setSuccess("Task created successfully!");

      setTimeout(() => {
        handleCloseDialog();
        setSuccess(null);
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create task",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const token = localStorage.getItem("adminToken");
      // console.log("project data ", projectData);
      // TODO: Replace with actual API call
      const response = await axios.post(
        `${API_BASE_URL}/admin/create_project`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      // console.log("Project created:", projectData);
      setSuccess("Project created successfully!");
      // if (response.status == 200) {
      // let projname = response.data.title;
      // let proj_Dep = response.data.description;
      // socket.emit("new_project", projname, proj_Dep);
      // }
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to create project");
    }
  };

  const handleOpenCustomDialog = () => {
    navigate("/head/custom-projects");
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
          minHeight: "100vh",
          backgroundColor: "#fcfcfc",
          p: 0,
          color: "#1a1a1a",
          position: "relative",
        }}
      >
        {/* Error and Success Alerts */}
        <Box
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 2000,
            maxWidth: "400px",
          }}
        >
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ mb: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              onClose={() => setSuccess(null)}
              sx={{ mb: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              {success}
            </Alert>
          )}
        </Box>

        {/* Header Section */}
        <Box
          sx={{
            py: 1.5,
            backgroundColor: "#fff",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box
            sx={{
              width: "98%",
              mx: "auto",
              px: { xs: 1, md: 3 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#444",
                  mb: 0.5,
                  fontSize: "2.2rem",
                }}
              >
                Head Operations
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#777", fontWeight: 500, fontSize: "1rem" }}
              >
                Workspace Hub
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <NotificationBell />
              <Button
                onClick={handleLogout}
                variant="outlined"
                sx={{
                  color: "#475569",
                  borderColor: "rgba(15, 23, 42, 0.12)",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                    borderColor: "rgba(15, 23, 42, 0.2)",
                    color: "#0f172a",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Conditional View Rendering */}
        {activeView === "production-activity" ? (
          <ProductionActivityLogger onBack={() => setActiveView("dashboard")} />
        ) : (
          <Box
            sx={{ width: "98%", mx: "auto", px: { xs: 1, md: 3 }, pt: 4, pb: 10 }}
          >
            {/* Status Cards Section */}
            <Grid
              container
              spacing={2}
              sx={{ mb: 6, width: "100%", justifyContent: "space-between" }}
            >
            {[
              { title: "Active Tasks", value: "03", icon: <AssignmentIcon /> },
              { title: "Processing", value: "01", icon: <NotesIcon /> },
              { title: "Approved", value: "01", icon: <CheckBoxIcon /> },
              { title: "Pending", value: "01", icon: <AccessTimeIcon /> },
            ].map((stat, idx) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={idx}
                sx={{ display: "flex", flexGrow: 1 }}
              >
                <Box
                  sx={{
                    width: "100%",
                    flexGrow: 1,
                    background:
                      "linear-gradient(90deg, #0d254a 0%, #1e4db7 100%)",
                    borderRadius: "8px",
                    p: 3,
                    color: "#fff",
                    minHeight: "150px", // Maintains landscape shape
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    position: "relative",
                    overflow: "hidden",
                    // Top Right Circle
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "-20%",
                      right: "-10%",
                      width: "120px",
                      height: "120px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "50%",
                    },
                    // Bottom Left Circle
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-20%",
                      left: "-10%",
                      width: "100px",
                      height: "100px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "50%",
                    },
                  }}
                >
                  {/* Top Right Label & Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      alignSelf: "flex-end",
                      mt: 1,
                      zIndex: 1,
                    }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: { fontSize: 24, opacity: 0.95 },
                    })}
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        opacity: 0.95,
                      }}
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                  {/* Bottom Left Number */}
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 700,
                      fontSize: "4.2rem",
                      mb: -0.5,
                      ml: 1,
                      letterSpacing: -2,
                      zIndex: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Action Grid Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              mb: 8,
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {[
              {
                label: "New Project",
                icon: <FolderIcon />,
                onClick: () => setOpenProjectDialog(true),
              },
              {
                label: "Project Hub",
                icon: <BarChartIcon />,
                onClick: () => navigate("/head/projects"),
              },
              {
                label: "Analytics Dashboard",
                icon: <GridViewIcon />,
                onClick: () => navigate("/head/project-overview"),
              },
              {
                label: "Custom",
                icon: <DashboardCustomizeIcon />,
                onClick: handleOpenCustomDialog,
              },
              {
                label: "Billings",
                icon: <InsertDriveFileIcon />,
                onClick: () => navigate("/head/billings"),
              },
              {
                label: "Add to Accounts",
                icon: <FolderIcon />,
                onClick: () => setOpenAddToAccountsDialog(true),
              },
              {
                label: "Everything",
                icon: <AssessmentIcon />,
                onClick: () => setActiveView("production-activity"),
              },
            ].map((action, idx) => (
              <Button
                key={idx}
                variant="outlined"
                startIcon={action.icon}
                onClick={action.onClick}
                sx={{
                  flex: 1,
                  minWidth: { xs: "100%", sm: "280px" },
                  color: "#555",
                  borderColor: "#e0e0e0",
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 4,
                  py: 2,
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
                  "&:hover": {
                    backgroundColor: "#f9f9f9",
                    borderColor: "#ccc",
                  },
                }}
              >
                {action.label}
              </Button>
            ))}
          </Box>

          {/* Task Overview Section */}
          <Typography
            variant="h4"
            sx={{
              mb: 6,
              fontWeight: 700,
              color: "#444",
              letterSpacing: "-1px",
            }}
          >
            Task Overview
          </Typography>
          <Box
            sx={{
              maxHeight: "62vh",
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": { width: 8 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#cbd5e1",
                borderRadius: 6,
              },
            }}
          >
            <Grid container spacing={3}>
              {tasks.map((task) => (
                <Grid item xs={12} md={6} lg={4} key={task._id}>
                  <Box
                    sx={{
                      bgcolor: "#ffffff",
                      borderRadius: "16px",
                      p: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                      border: "1px solid #f1f5f9",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: "#0f172a",
                          fontSize: "1.25rem",
                          lineHeight: 1.2,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Chip
                        label={task.priority || "Medium"}
                        size="small"
                        sx={{
                          bgcolor: (() => {
                            const p = (task.priority || "Medium").toLowerCase();
                            if (p === "critical" || p === "high")
                              return "#fee2e2";
                            if (p === "medium") return "#fef3c7";
                            return "#f0fdf4";
                          })(),
                          color: (() => {
                            const p = (task.priority || "Medium").toLowerCase();
                            if (p === "critical" || p === "high")
                              return "#991b1b";
                            if (p === "medium") return "#92400e";
                            return "#166534";
                          })(),
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        color: "#475569",
                        fontSize: "0.95rem",
                        mb: 3,
                        lineHeight: 1.6,
                        flexGrow: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOverflow: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {task.desc ||
                        task.description ||
                        "No description provided."}
                    </Typography>

                    <Divider sx={{ mb: 2.5, opacity: 0.6 }} />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: 16, color: "#94a3b8" }}
                          />
                          <Typography
                            sx={{
                              color: "#64748b",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                            }}
                          >
                            Deadline
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: "#1e293b",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                          }}
                        >
                          {task.deadline
                            ? new Date(task.deadline).toLocaleDateString(
                                "en-GB",
                                { day: "2-digit", month: "short" },
                              )
                            : "-"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PersonIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                          <Typography
                            sx={{
                              color: "#64748b",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                            }}
                          >
                            Source
                          </Typography>
                        </Box>
                        <Chip
                          label={formatHeadAssignmentSource(task)}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            height: "22px",
                            borderRadius: "4px",
                            ...(() => {
                              const role = (
                                task.admin ||
                                task.role ||
                                task.assignedByRole ||
                                ""
                              ).toLowerCase();
                              if (role === "hr") {
                                return {
                                  bgcolor: "#ecfdf5",
                                  color: "#065f46",
                                  border: "1px solid #d1fae5",
                                };
                              }
                              if (
                                role === "ceo" ||
                                role === "admin" ||
                                role === "superadmin"
                              ) {
                                return {
                                  bgcolor: "#eff6ff",
                                  color: "#1e40af",
                                  border: "1px solid #dbeafe",
                                };
                              }
                              return {
                                bgcolor: "#f8fafc",
                                color: "#475569",
                                border: "1px solid #e2e8f0",
                              };
                            })(),
                          }}
                        />
                      </Box>
                    </Box>

                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={task.status || "pending"}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                      sx={{
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
                      <MenuItem value="pending">⏳ Pending</MenuItem>
                      <MenuItem value="in_progress">⚙️ In Progress</MenuItem>
                      <MenuItem value="completed">✅ Completed</MenuItem>
                    </TextField>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
        )}

        {/* --- Dialogs --- */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingId ? "Update Task" : "Add Task"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Description"
                name="desc"
                value={formData.desc}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
              />
              <TextField
                select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </TextField>
              <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
              <TextField
                label="Deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
              <Button
                onClick={handleAddOrUpdateTask}
                disabled={loading}
                fullWidth
                variant="contained"
                sx={{ py: 1.5, fontWeight: 700, borderRadius: "8px" }}
              >
                {loading
                  ? "Processing..."
                  : editingId
                    ? "Update Task"
                    : "Add Task"}
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openAddToAccountsDialog}
          onClose={() => setOpenAddToAccountsDialog(false)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              width: "100%",
              maxWidth: 420,
              borderRadius: "28px",
              bgcolor: "#f8fafc",
              boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
            },
          }}
        >
          <DialogTitle
            sx={{ fontWeight: 700, textAlign: "center", color: "#0f172a" }}
          >
            Add to Accounts
          </DialogTitle>
          <DialogContent sx={{ py: 2.5, px: 3 }}>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", fontWeight: 500 }}
                >
                  Choose a project and add a completed entry for accounts.
                </Typography>
              </Box>
              <TextField
                select
                label="Select Project"
                name="projectId"
                value={accountFormData.projectId}
                onChange={handleAccountInputChange}
                fullWidth
                variant="outlined"
                sx={{ ...accountFieldStyles, minHeight: 70 }}
              >
                {projects.length === 0 ? (
                  <MenuItem value="" disabled>
                    No projects available
                  </MenuItem>
                ) : (
                  projects.map((project) => (
                    <MenuItem key={project._id} value={project._id}>
                      {project.title ||
                        project.projectName ||
                        project.name ||
                        "Unnamed Project"}
                    </MenuItem>
                  ))
                )}
              </TextField>
              <TextField
                label="Status"
                name="status"
                value={accountFormData.status}
                fullWidth
                variant="outlined"
                disabled
                helperText="Status is fixed to completed"
                sx={{
                  ...accountFieldStyles,
                  "& .MuiOutlinedInput-input": {
                    color: "#000000 !important",
                  },
                  "& .MuiOutlinedInput-input.Mui-disabled": {
                    color: "#000000 !important",
                    WebkitTextFillColor: "#000000 !important",
                  },
                }}
              />
              <TextField
                label="Department"
                name="department"
                value={accountFormData.department}
                onChange={handleAccountInputChange}
                fullWidth
                variant="outlined"
                sx={accountFieldStyles}
              />
              <TextField
                label="Description"
                name="description"
                value={accountFormData.description}
                onChange={handleAccountInputChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={accountFieldStyles}
              />
              <Button
                onClick={handleAddToAccountsSubmit}
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: "14px",
                  textTransform: "none",
                  boxShadow: "0 12px 28px rgba(14, 165, 233, 0.2)",
                }}
              >
                Submit
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>

        <CreateProjectDialog
          open={openProjectDialog}
          onClose={() => setOpenProjectDialog(false)}
          onSubmit={handleCreateProject}
        />

        {/* <EverythingComponent
          open={openEverything}
          onClose={() => setOpenEverything(false)}
          onSubmit={(payload) => {
            console.log("Everything submit:", payload);
            setSuccess("Department changes saved!");
            setTimeout(() => setSuccess(null), 2500);
          }}
        /> */}
      </Box>

      {/* Floating TeamChat Bubble */}
      <TeamChat />
    </>
  );
};

export default Head;
