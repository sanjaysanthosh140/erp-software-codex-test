import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const ACCENT = "#0f766e";
const PAGE_BG = "#fcfcfc";
const PAPER_BG = "#ffffff";
const TEXT_DARK = "#000000";
const TEXT_MUTED = "#64748b";
const BORDER = "rgba(15, 23, 42, 0.08)";
let BASE_URL = "http://localhost:8080";
const REQUIRED_DEPTS = [
  "Content Writing",
  "Video Production",
  "Editing",
  "Graphic Design",
  "DM",
];

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

const CONTENT_TYPES = ["Video", "Image", "Carousel", "Blog", "Ad"];

export default function CustomProjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const [project, setProject] = useState(null);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskContentType, setNewTaskContentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Status Menu State
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
  const [adminProfile, setAdminProfile] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "progress" | "completed" | "reject"

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    taskId: null,
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const token = localStorage.getItem("adminToken");
  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/admin/simple_custom_projects`, {
        headers: { Authorization: token },
      });
      const found = (res.data || []).find((p) => p._id === id);
      setProject(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/admin_profile`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (res.data) {
        const prof = Array.isArray(res.data) ? res.data[0] : res.data;
        setAdminProfile(prof);
        return prof;
      }
    } catch (err) {
      console.error("Error fetching admin profile:", err);
    }
    return null;
  };

  const normalizeDept = (name) => {
    if (!name) return "";
    const mapped = mapDeptName(name);
    if (mapped) return mapped.toLowerCase();
    return name
      .toLowerCase()
      .replace(/[-\s]+/g, " ")
      .trim();
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }
    fetchProject();
    fetchAdminProfile();
  }, [token, navigate, id]);

  const handleAddGlobalTask = async () => {
    if (!newTaskContent.trim() || !newTaskDate.trim() || !newTaskContentType.trim() || !project) return;
    try {
      const deptsForTask = project.departments.map((d) => ({
        departmentId: d.departmentId,
        departmentName: d.departmentName,
        status: "pending",
        remark: "",
      }));

      await axios.post(
        `${BASE_URL}/admin/simple_custom_project_global_task`,
        {
          projectId: project._id,
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
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

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
  // async function checkHead(token) {
  // try {
  // let res = await axios.get("http://localhost:8080/admin/admin_profile", {
  // headers: {
  // Authorization: token,
  // "Content-Type": "application/json"
  // }
  // });
  // if (res.data) {
  // console.log(res);
  // const prof = Array.isArray(res.data) ? res.data[0] : res.data;
  // return prof;
  // }
  // } catch (err) {
  // console.error(err);
  // }
  // return null;
  // }

  const performStatusUpdate = async (status, remark) => {
    try {
      const role = localStorage.getItem("adminRole");
      let today = new Date().toISOString().split("T")[0];

      console.log(today);
      // console.log(date);
      if (role === "head") {
        let profile = adminProfile;
        if (!profile) {
          profile = await fetchAdminProfile();
        }
        if (profile) {
          const projectDept = project?.departments.find(
            (d) => d.departmentId === statusTarget.departmentId,
          );
          if (projectDept) {
            const profileDeptNorm = normalizeDept(profile.department);
            const targetDeptNorm = normalizeDept(projectDept.departmentName);

            if (profileDeptNorm !== targetDeptNorm) {
              showToast(
                `Warning: You cannot update status for "${projectDept.departmentName}". You can only update tasks for your own department ("${profile.department}")!`,
                "warning",
              );
              setOpenRemarkDialog(false);
              setStatusTarget({
                taskId: null,
                departmentId: null,
                currentRemark: "",
              });
              setSelectedStatus(null);
              return;
            }
          }
        }
      }

      await axios.put(
        `${BASE_URL}/admin/simple_custom_project_global_task`,
        {
          projectId: project._id,
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
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenStatusMenu = async (
    event,
    taskId,
    departmentId,
    currentRemark,
  ) => {
    const role = localStorage.getItem("adminRole");
    if (role === "head") {
      let profile = adminProfile;
      if (!profile) {
        profile = await fetchAdminProfile();
      }
      if (profile) {
        const projectDept = project?.departments.find(
          (d) => d.departmentId === departmentId,
        );
        if (projectDept) {
          const profileDeptNorm = normalizeDept(profile.department);
          const targetDeptNorm = normalizeDept(projectDept.departmentName);

          if (profileDeptNorm !== targetDeptNorm) {
            showToast(
              `Warning: As Head of "${profile.department}", you are only allowed to update tasks for your own department!`,
              "warning",
            );
            return;
          }
        }
      }
    }
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

  const handleEditTask = async (task, projectId) => {
    try {
      let res = await axios.get(
        `${BASE_URL}/admin/update_simple_proj_task/${projectId}`,
      );
      console.log("from bE", res);
      const projectData = res.data?.project ?? res.data;
      const foundTask =
        projectData?.tasks?.find((t) => t._id === task._id) || task;

      setNewTaskContent(foundTask.content || foundTask.title || "");
      setNewTaskDate(foundTask.date || "");
      setNewTaskContentType(foundTask.contentType || "");
      setEditingTaskId(foundTask._id);
    } catch (err) {
      console.error(err);
      // Fallback
      setNewTaskContent(task.content || task.title || "");
      setNewTaskDate(task.date || "");
      setNewTaskContentType(task.contentType || "");
      setEditingTaskId(task._id);
    }
  };

  const handleUpdateGlobalTask = async () => {
    if (!newTaskContent.trim() || !newTaskDate.trim() || !newTaskContentType.trim() || !project || !editingTaskId) return;
    try {
      const payload = {
        projectId: project._id,
        taskId: editingTaskId,
        content: newTaskContent,
        date: newTaskDate,
        contentType: newTaskContentType,
      };

      await axios.put(`${BASE_URL}/admin/update_project_tasks`, payload, {
        headers: { Authorization: token },
      });

      handleCancelEdit();
      fetchProject();
      showSnackbar("Task updated successfully", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update task", "error");
    }
  };

  const handleDeleteTask = (taskId) => {
    setDeleteConfirm({ open: true, taskId });
  };

  const confirmDeleteTask = async () => {
    const { taskId } = deleteConfirm;
    if (!taskId) return;
    try {
      await axios.put(
        `${BASE_URL}/admin/delete_simple_project_global_task`,
        {
          projectId: project._id,
          taskId: taskId,
        },
        {
          headers: { Authorization: token },
        },
      );
      fetchProject();
      setDeleteConfirm({ open: false, taskId: null });
      showSnackbar("Task deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete task", "error");
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

  // Check if user can edit/delete tasks (must be from an included department)
  const canEditDelete = React.useMemo(() => {
    if (!adminProfile || !project?.departments) return false;
    const userDeptNorm = normalizeDept(adminProfile.department);
    return project.departments.some(
      (d) => normalizeDept(d.departmentName) === userDeptNorm,
    );
  }, [adminProfile, project?.departments]);

  // Compute filtered tasks by date range and status, auto-sorted ascending
  const displayedTasks = React.useMemo(() => {
    let tasks = project?.tasks || [];
    // Filter by status
    if (statusFilter !== "all") {
      tasks = tasks.filter((task) =>
        task.departments?.some((d) => d.status === statusFilter),
      );
    }
    // Filter by date range
    if (dateFrom) {
      tasks = tasks.filter((task) => task.date && task.date >= dateFrom);
    }
    if (dateTo) {
      tasks = tasks.filter((task) => task.date && task.date <= dateTo);
    }
    // Auto sort ascending when date range is active
    if (dateFrom || dateTo) {
      tasks = [...tasks].sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
      });
    }
    return tasks;
  }, [project?.tasks, dateFrom, dateTo, statusFilter]);

  if (!project && !loading)
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Project not found</Typography>
      </Box>
    );

  return (
    <Box
      sx={{ minHeight: "100vh", bgcolor: PAGE_BG, color: TEXT_DARK, pb: 10 }}
    >
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .MuiTableContainer-root { box-shadow: none !important; border: 1px solid #ddd !important; }
          .print-project-title { display: block !important; }
          @page { margin: 15mm; size: A4 landscape; }
        }
        .print-project-title { display: none; }
      `}</style>
      {/* Header */}
      <Box
        sx={{
          py: 2,
          bgcolor: "#fff",
          borderBottom: `1px solid ${BORDER}`,
          px: { xs: 2, md: 4 },
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <IconButton
          onClick={() => navigate("/head/custom-projects")}
          sx={{ color: TEXT_DARK, bgcolor: alpha(TEXT_DARK, 0.05) }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {project?.projectTilte || project?.projectTitle}
          </Typography>
          <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
            Global Task Management
          </Typography>
        </Box>
        <Button
          className="no-print"
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          sx={{
            borderRadius: "8px",
            fontWeight: 700,
            color: ACCENT,
            borderColor: ACCENT,
            "&:hover": { bgcolor: alpha(ACCENT, 0.05) },
          }}
        >
          Print
        </Button>
      </Box>

      {/* Content */}
      <Box
        sx={{
          width: "95%",
          mx: "auto",
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
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
            required
            error={editingTaskId ? false : !newTaskDate && newTaskContent.trim() !== ""}
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
            label="Content Type"
            placeholder="Select or type..."
            value={newTaskContentType}
            onChange={(e) => setNewTaskContentType(e.target.value)}
            required
            error={editingTaskId ? false : !newTaskContentType && newTaskContent.trim() !== ""}
            sx={{
              width: "160px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": { borderColor: BORDER },
              },
              "& .MuiInputBase-input": { color: TEXT_DARK },
            }}
            list="content-types-list"
          />
          <datalist id="content-types-list">
            {CONTENT_TYPES.map((type) => (
              <option key={type} value={type} />
            ))}
          </datalist>
          <TextField
            size="small"
            placeholder="Type content detail..."
            fullWidth
            required
            error={!newTaskContent.trim() && (newTaskDate !== "" || newTaskContentType !== "")}
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
                disabled={!newTaskContent.trim() || !newTaskDate.trim() || !newTaskContentType.trim()}
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
              disabled={!newTaskContent.trim() || !newTaskDate.trim() || !newTaskContentType.trim()}
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

        {/* Sort & Filter Toolbar */}
        <Box
          className="no-print"
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            bgcolor: "#fff",
            p: 2,
            borderRadius: "12px",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <CalendarTodayIcon sx={{ color: ACCENT, fontSize: "1.1rem" }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: TEXT_MUTED }}
          >
            Date Range:
          </Typography>
          <TextField
            size="small"
            type="date"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            inputProps={{ max: dateTo || undefined }}
            sx={{
              width: "155px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": { borderColor: dateFrom ? ACCENT : BORDER },
              },
              "& .MuiInputBase-input": { color: TEXT_DARK },
              "& .MuiInputLabel-root": { fontWeight: 700 },
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: TEXT_MUTED, fontWeight: 600 }}
          >
            →
          </Typography>
          <TextField
            size="small"
            type="date"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            inputProps={{ min: dateFrom || undefined }}
            sx={{
              width: "155px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": { borderColor: dateTo ? ACCENT : BORDER },
              },
              "& .MuiInputBase-input": { color: TEXT_DARK },
              "& .MuiInputLabel-root": { fontWeight: 700 },
            }}
          />

          <Box
            sx={{ width: "1px", height: "32px", bgcolor: BORDER, mx: 0.5 }}
          />

          <FormControl size="small" sx={{ minWidth: 165 }}>
            <InputLabel sx={{ fontWeight: 700 }}>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                borderRadius: "8px",
                fontWeight: 600,
                color: TEXT_DARK,
                "& .MuiSelect-select": { color: TEXT_DARK },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: BORDER },
              }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeIcon fontSize="small" sx={{ color: TEXT_MUTED }} />{" "}
                  Pending
                </Box>
              </MenuItem>
              <MenuItem value="progress">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PlayCircleIcon fontSize="small" sx={{ color: "#3b82f6" }} />{" "}
                  In Progress
                </Box>
              </MenuItem>
              <MenuItem value="completed">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ color: "#10b981" }} />{" "}
                  Completed
                </Box>
              </MenuItem>
              <MenuItem value="reject">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CancelIcon fontSize="small" sx={{ color: "#ef4444" }} />{" "}
                  Rejected
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {(statusFilter !== "all" || dateFrom || dateTo) && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                setStatusFilter("all");
              }}
              sx={{
                borderRadius: "8px",
                fontWeight: 700,
                color: "#ef4444",
                borderColor: "#ef4444",
                fontSize: "0.78rem",
                "&:hover": { bgcolor: alpha("#ef4444", 0.05) },
              }}
            >
              Clear Filters
            </Button>
          )}

          <Box sx={{ flex: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: TEXT_MUTED, fontWeight: 600 }}
          >
            {displayedTasks.length} task{displayedTasks.length !== 1 ? "s" : ""}{" "}
            shown
          </Typography>
        </Box>

        {/* Task Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: `1px solid ${BORDER}`,
            bgcolor: "#fff",
            maxHeight: "60vh",
            overflow: "auto",
            "&::-webkit-scrollbar": { width: 8, height: 8 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cbd5e1",
              borderRadius: 4,
            },
          }}
        >
          <Table stickyHeader sx={{ minWidth: 1000, whiteSpace: "nowrap" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: TEXT_DARK,
                    bgcolor: "#f8fafc",
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
                    bgcolor: "#f8fafc",
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
                    bgcolor: "#f8fafc",
                    borderBottom: `1px solid ${BORDER}`,
                    width: "150px",
                  }}
                >
                  Content-Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: TEXT_DARK,
                    bgcolor: "#f8fafc",
                    borderBottom: `1px solid ${BORDER}`,
                    width: "250px",
                    maxWidth: "250px",
                  }}
                >
                  Content
                </TableCell>
                {REQUIRED_DEPTS.filter((deptName) =>
                  project?.departments.some(
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
                      color: TEXT_DARK,
                      bgcolor: "#f8fafc",
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                  >
                    {deptName}
                  </TableCell>
                ))}
                <TableCell
                  align="right"
                  className="no-print"
                  sx={{
                    fontWeight: 800,
                    color: TEXT_DARK,
                    bgcolor: "#f8fafc",
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedTasks.map((task, index) => (
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
                        fontSize: "0.7rem",
                        color: TEXT_DARK,
                        borderColor: alpha(TEXT_DARK, 0.2),
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      color: TEXT_DARK,
                      borderBottom: `1px solid ${BORDER}`,
                      width: "250px",
                      maxWidth: "250px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      verticalAlign: "top",
                      py: 1.5,
                    }}
                  >
                    {task.content}
                  </TableCell>

                  {REQUIRED_DEPTS.filter((deptName) =>
                    project?.departments.some(
                      (d) =>
                        mapDeptName(d.departmentName) === deptName ||
                        d.departmentName === deptName,
                    ),
                  ).map((deptName) => {
                    const projectDept = project?.departments.find(
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

                    return (
                      <TableCell
                        key={deptName}
                        align="center"
                        sx={{ borderBottom: `1px solid ${BORDER}` }}
                      >
                        <Tooltip
                          title={
                            <React.Fragment>
                              {taskDeptStatus?.date ? (
                                <div style={{ marginBottom: "4px" }}>
                                  <strong>Date:</strong> {taskDeptStatus.date}
                                </div>
                              ) : (
                                <div style={{ marginBottom: "4px" }}>
                                  <strong>Date:</strong> <em>Not set</em>
                                </div>
                              )}
                              <div>
                                {remark
                                  ? `Remark: ${remark}`
                                  : "No remark yet. Click to update status."}
                              </div>
                            </React.Fragment>
                          }
                          arrow
                        >
                          <Chip
                            icon={getStatusIcon(status)}
                            label={status}
                            onClick={(e) =>
                              handleOpenStatusMenu(
                                e,
                                task._id,
                                projectDept.departmentId,
                                remark,
                              )
                            }
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.7rem",
                              textTransform: "capitalize",
                              bgcolor: alpha(cColor, 0.1),
                              color: cColor,
                              border: `1px solid ${alpha(cColor, 0.2)}`,
                              "& .MuiChip-icon": { color: cColor },
                              "&:hover": { bgcolor: alpha(cColor, 0.2) },
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                  <TableCell
                    align="right"
                    className="no-print"
                    sx={{
                      borderBottom: `1px solid ${BORDER}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {canEditDelete && (
                      <>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleEditTask(task, project?._id || id)
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
                      </>
                    )}
                    {!canEditDelete && (
                      <Tooltip title="Only users from included departments can edit or delete tasks">
                        <Typography
                          variant="caption"
                          sx={{
                            color: TEXT_MUTED,
                            fontWeight: 600,
                            display: "block",
                            textAlign: "center",
                          }}
                        >
                          No access
                        </Typography>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {displayedTasks.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={REQUIRED_DEPTS.length + 5}
                    align="center"
                    sx={{ py: 6, color: TEXT_MUTED, borderBottom: "none" }}
                  >
                    {statusFilter !== "all"
                      ? `No tasks found with status "${statusFilter}".`
                      : "No content tasks added for this project yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, taskId: null })}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            width: "220px",
            textAlign: "center",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: "#ef4444" }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{ color: TEXT_MUTED, fontWeight: 600 }}
          >
            Are you sure you want to delete this task? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 1, pb: 2 }}>
          <Button
            onClick={() => setDeleteConfirm({ open: false, taskId: null })}
            sx={{
              color: TEXT_MUTED,
              fontWeight: 700,
              borderRadius: "8px",
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteTask}
            variant="contained"
            color="error"
            sx={{
              fontWeight: 700,
              borderRadius: "8px",
              px: 3,
              boxShadow: "none",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "8px", fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
