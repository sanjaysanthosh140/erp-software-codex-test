import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useToast } from "../context/ToastContext";
const ACCENT = "#0f766e";
const PAGE_BG = "#ffffff";
const TEXT_DARK = "#000000";
const TEXT_MUTED = "#64748b";
const BORDER = "rgba(15, 23, 42, 0.08)";
const REQUIRED_DEPTS = [
  "Content Writing",
  "Video Production",
  "Editing",
  "Graphic Design",
  "DM",
];
const CONTENT_TYPES = ["Video", "Image", "Carousel", "Blog", "Ad", "Other"];
const mapDeptName = (name) => {
  if (!name) return null;
  const n = name.toLowerCase().replace("-", " ").trim();
  if (n === "dm") return "DM";
  if (n === "content writing") return "Content Writing";
  if (n === "video production") return "Video Production";
  if (n === "editing") return "Editing";
  if (n === "graphic design") return "Graphic Design";
  return null;
};
const getDeptNameFromId = (id) => {
  if (!id) return null;
  const n = id.toLowerCase().replace("_", " ").replace("-", " ").trim();
  if (n.includes("dm")) return "DM";
  if (n.includes("content")) return "Content Writing";
  if (n.includes("video")) return "Video Production";
  if (n.includes("editing")) return "Editing";
  if (n.includes("graphic")) return "Graphic Design";
  return null;
};
const BASE_URL = "https://project-management-sodtware-backend-end.onrender.com";
export default function Employeeeverything({ deptId }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusTarget, setStatusTarget] = useState({
    taskId: null,
    departmentId: null,
    currentRemark: "",
  });
  const [selectedStatus, setSelectedStatus] = useState(null);
  // Remark Dialog State
  const [openRemarkDialog, setOpenRemarkDialog] = useState(false);
  const [tempRemark, setTempRemark] = useState("");
  // Task Management State
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskContentType, setNewTaskContentType] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const token = localStorage.getItem("token");
  const myDeptName = getDeptNameFromId(deptId);
  const { showToast } = useToast();
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/simple_custom_projects`,
        {
          headers: { Authorization: token },
        },
      );
      setProjects(res.data || []);
      if (selectedProject) {
        const updated = (res.data || []).find(
          (p) => p._id === selectedProject._id,
        );
        if (updated) setSelectedProject(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, [token]);
  const handleStatusSelect = async (status) => {
    setAnchorEl(null);
    if (status === "pending" || status === "reject") {
      setSelectedStatus(status);
      setTempRemark(statusTarget.currentRemark || "");
      setOpenRemarkDialog(true);
    } else {
      // For "progress" and "completed", update directly
      await performStatusUpdate(status, "");
    }
  };

  const performStatusUpdate = async (status, remark) => {
    try {
      let today = new Date().toISOString().split("T")[0];
      await axios.put(
        `${BASE_URL}/admin/simple_custom_project_global_task`,
        {
          projectId: selectedProject._id,
          taskId: statusTarget.taskId,
          departmentId: statusTarget.departmentId,
          status: status,
          date: today,
          remark: remark,
        },
        {
          headers: { Authorization: token },
        },
      );
      setOpenRemarkDialog(false);
      setStatusTarget({ taskId: null, departmentId: null, currentRemark: "" });
      setSelectedStatus(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };
  const handleOpenStatusMenu = (event, taskId, departmentId, currentRemark) => {
    setStatusTarget({ taskId, departmentId, currentRemark });
    setAnchorEl(event.currentTarget);
  };
  const handleCloseStatusMenu = () => {
    setAnchorEl(null);
  };
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setNewTaskContent("");
    setNewTaskDate("");
    setNewTaskContentType("");
  };
  const handleAddGlobalTask = async () => {
    if (!newTaskContent.trim() || !selectedProject) return;

    const isMyDeptInProject = selectedProject.departments.some(
      (d) =>
        mapDeptName(d.departmentName) === myDeptName ||
        d.departmentName === myDeptName,
    );

    if (!isMyDeptInProject) {
      showToast(
        "Your department is not part of this project. You cannot add tasks.",
        "warning",
      );
      return;
    }

    try {
      const deptsForTask = selectedProject.departments.map((d) => ({
        departmentId: d.departmentId,
        departmentName: d.departmentName,
        status: "pending",
        remark: "",
      }));

      await axios.post(
        `${BASE_URL}/admin/simple_custom_project_global_task`,
        {
          projectId: selectedProject._id,
          content: newTaskContent,
          date: newTaskDate,
          contentType: newTaskContentType,
          departments: deptsForTask,
        },
        {
          headers: { Authorization: token },
        },
      );
      setNewTaskContent("");
      setNewTaskDate("");
      setNewTaskContentType("");
      showToast("Task added successfully!", "success");
      fetchProjects();
    } catch (err) {
      console.error(err);
      showToast("Failed to add task", "error");
    }
  };
  const handleEditTask = async (task, projectId) => {
    try {
      const isMyDeptInProject = selectedProject.departments.some(
        (d) =>
          mapDeptName(d.departmentName) === myDeptName ||
          d.departmentName === myDeptName,
      );

      if (!isMyDeptInProject) {
        showToast(
          "Your department is not part of this project. You cannot edit tasks.",
          "warning",
        );
        return;
      }

      setNewTaskContent(task.content || task.title || "");
      setNewTaskDate(task.date || "");
      setNewTaskContentType(task.contentType || "");
      setEditingTaskId(task._id);
    } catch (err) {
      console.error(err);
      showToast("Failed to load task for editing", "error");
    }
  };
  const handleUpdateGlobalTask = async () => {
    if (!newTaskContent.trim() || !selectedProject || !editingTaskId) return;
    try {
      const payload = {
        projectId: selectedProject._id,
        taskId: editingTaskId,
        content: newTaskContent,
        date: newTaskDate,
        contentType: newTaskContentType,
      };

      await axios.put(
        `${BASE_URL}/admin/update_project_tasks`,
        payload,
        {
          headers: { Authorization: token },
        },
      );

      handleCancelEdit();
      showToast("Task updated successfully!", "success");
      fetchProjects();
    } catch (err) {
      console.error(err);
      showToast("Failed to update task", "error");
    }
  };
  const handleDeleteTask = async (taskId) => {
    const isMyDeptInProject = selectedProject.departments.some(
      (d) =>
        mapDeptName(d.departmentName) === myDeptName ||
        d.departmentName === myDeptName,
    );

    if (!isMyDeptInProject) {
      showToast(
        "Your department is not part of this project. You cannot delete tasks.",
        "warning",
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.put(
          `${BASE_URL}/admin/delete_simple_project_global_task`,
          {
            projectId: selectedProject._id,
            taskId: taskId,
          },
          {
            headers: { Authorization: token },
          },
        );
        showToast("Task deleted successfully!", "success");
        fetchProjects();
      } catch (err) {
        console.error(err);
        showToast("Failed to delete task", "error");
      }
    }
  };
  const getStatusColor = (status, taskDeptStatus) => {
    if (status === "progress") return "#3b82f6";
    if (status === "reject") return "#ef4444";
    if (status === "completed") return "#10b981";
    if (
      status === "pending" &&
      (taskDeptStatus?.date || taskDeptStatus?.remark)
    )
      return "#f59e0b";
    return TEXT_MUTED;
  };
  const getStatusIcon = (status) => {
    if (status === "progress") return <PlayCircleIcon fontSize="small" />;
    if (status === "reject") return <CancelIcon fontSize="small" />;
    if (status === "completed") return <CheckCircleIcon fontSize="small" />;
    return <AccessTimeIcon fontSize="small" />;
  };
  const calculateProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const totalSlots = project.tasks.length * project.departments.length;
    let completedSlots = 0;
    project.tasks.forEach((task) => {
      task.departments?.forEach((d) => {
        if (d.status === "completed") completedSlots++;
      });
    });
    return Math.round((completedSlots / totalSlots) * 100);
  };
  if (loading && projects.length === 0) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress sx={{ color: ACCENT }} />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: PAGE_BG,
        color: TEXT_DARK,
        minHeight: "100%",
      }}
    >
      {selectedProject ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <IconButton
              onClick={() => setSelectedProject(null)}
              sx={{ color: TEXT_DARK, bgcolor: alpha(TEXT_DARK, 0.05) }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {selectedProject.projectTilte || selectedProject.projectTitle}
              </Typography>
              <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
                Your Department:{" "}
                <Box component="span" sx={{ color: ACCENT, fontWeight: 700 }}>
                  {myDeptName || "Not assigned"}
                </Box>
              </Typography>
            </Box>
          </Box>
          {/* Add Task Input Row */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              bgcolor: "#fff",
              p: 2,
              borderRadius: "12px",
              border: `1px solid ${BORDER}`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              flexWrap: "wrap",
            }}
          >
            <TextField
              size="small"
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              sx={{
                width: "160px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": { borderColor: BORDER },
                },
                "& .MuiInputBase-input": { color: TEXT_DARK },
              }}
            />
            <TextField
              size="small"
              select
              label="Content Type"
              value={newTaskContentType}
              onChange={(e) => setNewTaskContentType(e.target.value)}
              sx={{
                width: "160px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": { borderColor: BORDER },
                },
                "& .MuiInputBase-input": { color: TEXT_DARK },
              }}
            >
              {CONTENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              placeholder="Type content detail..."
              fullWidth
              sx={{
                flex: 1,
                minWidth: "200px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": { borderColor: BORDER },
                },
                "& .MuiInputBase-input": { color: TEXT_DARK },
              }}
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
            />
            {editingTaskId ? (
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="contained"
                  onClick={handleUpdateGlobalTask}
                  disabled={!newTaskContent.trim()}
                  sx={{
                    whiteSpace: "nowrap",
                    px: 3,
                    borderRadius: "8px",
                    fontWeight: 700,
                    bgcolor: ACCENT,
                    color: "#fff",
                    "&:hover": { bgcolor: "#0d5c56" },
                  }}
                >
                  Update Task
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
                  sx={{
                    whiteSpace: "nowrap",
                    px: 3,
                    borderRadius: "8px",
                    fontWeight: 700,
                    color: TEXT_DARK,
                    borderColor: BORDER,
                  }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                onClick={handleAddGlobalTask}
                disabled={!newTaskContent.trim()}
                startIcon={<AddIcon />}
                sx={{
                  whiteSpace: "nowrap",
                  px: 3,
                  borderRadius: "8px",
                  fontWeight: 700,
                  bgcolor: ACCENT,
                  color: "#fff",
                  "&:hover": { bgcolor: "#0d5c56" },
                }}
              >
                Add Task
              </Button>
            )}
          </Box>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: `1px solid ${BORDER}`,
              bgcolor: "#fff",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(TEXT_DARK, 0.02) }}>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      color: TEXT_DARK,
                      py: 2,
                      borderBottom: `1px solid ${BORDER}`,
                      width: "60px",
                    }}
                  >
                    No.
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      color: TEXT_DARK,
                      borderBottom: `1px solid ${BORDER}`,
                      width: "120px",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      color: TEXT_DARK,
                      borderBottom: `1px solid ${BORDER}`,
                      width: "130px",
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      color: TEXT_DARK,
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                  >
                    Content
                  </TableCell>
                  {REQUIRED_DEPTS.filter((deptName) =>
                    selectedProject.departments.some(
                      (d) =>
                        mapDeptName(d.departmentName) === deptName ||
                        d.departmentName === deptName,
                    ),
                  ).map((deptName) => (
                    <TableCell
                      key={deptName}
                      align="center"
                      sx={{
                        fontWeight: 800,
                        color: deptName === myDeptName ? ACCENT : TEXT_DARK,
                        borderBottom: `1px solid ${BORDER}`,
                        bgcolor:
                          deptName === myDeptName
                            ? alpha(ACCENT, 0.05)
                            : "transparent",
                      }}
                    >
                      {deptName}
                    </TableCell>
                  ))}
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 800,
                      color: TEXT_DARK,
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(selectedProject.tasks || []).map((task, index) => (
                  <TableRow
                    key={task._id || index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { bgcolor: alpha(TEXT_DARK, 0.01) },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: TEXT_MUTED,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      #{index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: TEXT_MUTED,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {task.date || "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: TEXT_MUTED,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      <Chip
                        label={task.contentType || "N/A"}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          color: TEXT_DARK,
                          borderColor: alpha(TEXT_DARK, 0.1),
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: TEXT_DARK,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {task.content}
                    </TableCell>
                    {REQUIRED_DEPTS.filter((deptName) =>
                      selectedProject.departments.some(
                        (d) =>
                          mapDeptName(d.departmentName) === deptName ||
                          d.departmentName === deptName,
                      ),
                    ).map((deptName) => {
                      const projectDept = selectedProject.departments.find(
                        (d) =>
                          mapDeptName(d.departmentName) === deptName ||
                          d.departmentName === deptName,
                      );
                      if (!projectDept)
                        return (
                          <TableCell
                            key={deptName}
                            align="center"
                            sx={{ borderBottom: `1px solid ${BORDER}` }}
                          >
                            —
                          </TableCell>
                        );
                      const taskDeptStatus = task.departments?.find(
                        (d) => d.departmentId === projectDept.departmentId,
                      );
                      const status = taskDeptStatus?.status || "pending";
                      const remark = taskDeptStatus?.remark || "";
                      const cColor = getStatusColor(status, taskDeptStatus);
                      const isMyDept = deptName === myDeptName;
                      return (
                        <TableCell
                          key={deptName}
                          align="center"
                          sx={{
                            borderBottom: `1px solid ${BORDER}`,
                            bgcolor: isMyDept
                              ? alpha(ACCENT, 0.02)
                              : "transparent",
                          }}
                        >
                          <Tooltip
                            title={
                              <React.Fragment>
                                {taskDeptStatus?.date && (
                                  <div style={{ marginBottom: "4px" }}>
                                    <strong>Date:</strong> {taskDeptStatus.date}
                                  </div>
                                )}
                                <div>
                                  {remark
                                    ? `Remark: ${remark}`
                                    : isMyDept
                                      ? "Click to update your status"
                                      : "No remark yet"}
                                </div>
                              </React.Fragment>
                            }
                            arrow
                          >
                            <Chip
                              icon={getStatusIcon(status)}
                              label={status}
                              onClick={
                                isMyDept
                                  ? (e) =>
                                      handleOpenStatusMenu(
                                        e,
                                        task._id,
                                        projectDept.departmentId,
                                        remark,
                                      )
                                  : undefined
                              }
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                textTransform: "capitalize",
                                bgcolor: alpha(cColor, 0.1),
                                color: cColor,
                                border: `1px solid ${alpha(cColor, 0.2)}`,
                                cursor: isMyDept ? "pointer" : "default",
                                "& .MuiChip-icon": { color: cColor },
                                "&:hover": isMyDept
                                  ? { bgcolor: alpha(cColor, 0.2) }
                                  : {},
                              }}
                            />
                          </Tooltip>
                        </TableCell>
                      );
                    })}
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: `1px solid ${BORDER}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleEditTask(task, selectedProject?._id)
                        }
                        sx={{
                          color: ACCENT,
                          mr: 1,
                          bgcolor: alpha(ACCENT, 0.05),
                          "&:hover": { bgcolor: alpha(ACCENT, 0.1) },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTask(task._id)}
                        sx={{
                          color: "#ef4444",
                          bgcolor: alpha("#ef4444", 0.05),
                          "&:hover": { bgcolor: alpha("#ef4444", 0.1) },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {(!selectedProject.tasks ||
                  selectedProject.tasks.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={REQUIRED_DEPTS.length + 5}
                      align="center"
                      sx={{ py: 6, color: TEXT_MUTED }}
                    >
                      No tasks assigned yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <BusinessIcon sx={{ color: ACCENT }} />
              My Custom Projects
            </Typography>
            <Chip
              label={`${projects.length} Projects`}
              sx={{
                fontWeight: 800,
                bgcolor: alpha(ACCENT, 0.1),
                color: ACCENT,
              }}
            />
          </Box>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: `1px solid ${BORDER}`,
              bgcolor: "#fff",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(TEXT_DARK, 0.02) }}>
                  <TableCell sx={{ fontWeight: 800, color: TEXT_DARK, py: 2 }}>
                    Project Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: TEXT_DARK }}>
                    Progress
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 800, color: TEXT_DARK }}
                  >
                    Your Dept
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 800, color: TEXT_DARK }}
                  >
                    Departments
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((proj) => {
                  const prog = calculateProgress(proj);
                  const isIncluded = proj.departments.some(
                    (d) => mapDeptName(d.departmentName) === myDeptName,
                  );
                  return (
                    <TableRow
                      key={proj._id}
                      onClick={() => setSelectedProject(proj)}
                      sx={{
                        cursor: "pointer",
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { bgcolor: alpha(TEXT_DARK, 0.01) },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell sx={{ fontWeight: 800, color: TEXT_DARK }}>
                        {proj.projectTilte || proj.projectTitle}
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            color: TEXT_MUTED,
                            fontWeight: 500,
                          }}
                        >
                          Created:{" "}
                          {new Date(
                            proj.createdAt || Date.now(),
                          ).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: "200px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={prog}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: alpha(ACCENT, 0.1),
                              "& .MuiLinearProgress-bar": {
                                bgcolor: ACCENT,
                                borderRadius: 3,
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 800,
                              color: TEXT_DARK,
                              minWidth: "30px",
                            }}
                          >
                            {prog}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={isIncluded ? "Included" : "Not Included"}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: "0.65rem",
                            bgcolor: isIncluded
                              ? alpha(ACCENT, 0.1)
                              : alpha(TEXT_DARK, 0.05),
                            color: isIncluded ? ACCENT : TEXT_MUTED,
                            border: `1px solid ${isIncluded ? alpha(ACCENT, 0.2) : "transparent"}`,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            justifyContent: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          {proj.departments.map((d) => (
                            <Tooltip
                              key={d.departmentId}
                              title={d.headName || "Head"}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor:
                                    mapDeptName(d.departmentName) === myDeptName
                                      ? ACCENT
                                      : alpha(TEXT_DARK, 0.2),
                                }}
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {projects.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ py: 6, color: TEXT_MUTED }}
                    >
                      No custom projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {/* Status Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseStatusMenu}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            "& .MuiMenuItem-root": {
              fontWeight: 600,
              fontSize: "0.9rem",
              gap: 1.5,
            },
          },
        }}
      >
        <MenuItem onClick={() => handleStatusSelect("pending")}>
          <AccessTimeIcon fontSize="small" sx={{ color: TEXT_MUTED }} /> Pending
        </MenuItem>
        <MenuItem onClick={() => handleStatusSelect("progress")}>
          <PlayCircleIcon fontSize="small" sx={{ color: "#3b82f6" }} /> Progress
        </MenuItem>
        <MenuItem onClick={() => handleStatusSelect("completed")}>
          <CheckCircleIcon fontSize="small" sx={{ color: "#10b981" }} />{" "}
          Completed
        </MenuItem>
        <MenuItem onClick={() => handleStatusSelect("reject")}>
          <CancelIcon fontSize="small" sx={{ color: "#ef4444" }} /> Reject
        </MenuItem>
      </Menu>
      {/* Remark Dialog */}
      <Dialog
        open={openRemarkDialog}
        onClose={() => setOpenRemarkDialog(false)}
        PaperProps={{ sx: { borderRadius: "16px", minWidth: "350px" } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Update Status & Add Remark
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: TEXT_MUTED }}>
            Selected Status:{" "}
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                color: getStatusColor(selectedStatus),
                textTransform: "capitalize",
              }}
            >
              {selectedStatus}
            </Box>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Add Detail / Remark (Why?)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={tempRemark}
            onChange={(e) => setTempRemark(e.target.value)}
            placeholder="Enter reason or progress details..."
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              "& .MuiInputBase-input": { color: TEXT_DARK },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenRemarkDialog(false)}
            sx={{ color: TEXT_MUTED, fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => performStatusUpdate(selectedStatus, tempRemark)}
            variant="contained"
            sx={{
              bgcolor: ACCENT,
              fontWeight: 700,
              borderRadius: "8px",
              "&:hover": { bgcolor: "#0d5c56" },
            }}
          >
            Submit Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
