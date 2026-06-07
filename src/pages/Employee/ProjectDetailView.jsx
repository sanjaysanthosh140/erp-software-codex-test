/**
 * ProjectDetailView.jsx — Figma redesign (clean white theme).
 * ─────────────────────────────────────────────────────────────
 * ALL data-fetching and mutation logic is preserved EXACTLY:
 *   • fetchProjectDetails() — Promise.all 3 APIs + task_id normalisation
 *   • handleToggleTodo / handleToggleExpand
 *   • handleAddSubTask / handleSaveAllSubTasks
 *   • handleDeleteSubTask / handleToggleSubTaskStatus
 *   • calculatedProgress formula
 * Only styling, labels, and loading-speed (removed artificial 600 ms delay)
 * have been changed.
 */
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  Checkbox,
  IconButton,
  Fade,
  Button,
  TextField,
  Collapse,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";

/* ─── Design tokens ──────────────────────────────────────────────────── */
const NAVY = "#1a2d5a";
const NAVY2 = "#0f3a8a";
const RED = "#ef4444";
const AMBER = "#f97316";
const GREEN = "#22c55e";
const SLATE = "#0f172a";
const MUTED = "#64748b";
const BORDER = "rgba(15,23,42,0.09)";
const CARD = "#ffffff";

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Critical": return RED;
    case "High": return RED;
    case "Medium": return AMBER;
    default: return GREEN;
  }
};

const getPriorityBg = (priority) => {
  switch (priority) {
    case "Critical":
    case "High": return "#fef2f2";
    case "Medium": return "#fff7ed";
    default: return "#f0fdf4";
  }
};

/* ─── Shimmer keyframes injected once ──────────────────────────────── */
const shimmerStyle = {
  "@keyframes shimmer": {
    "0%": { backgroundPosition: "-600px 0" },
    "100%": { backgroundPosition: "600px 0" },
  },
};

const ShimmerBox = ({ sx = {} }) => (
  <Box
    sx={{
      ...shimmerStyle,
      background: "linear-gradient(90deg, #f0f2f5 25%, #e4e8ee 50%, #f0f2f5 75%)",
      backgroundSize: "1200px 100%",
      animation: "shimmer 1.5s infinite linear",
      borderRadius: "10px",
      ...sx,
    }}
  />
);

/* ─── Loading skeleton — mirrors real page layout ───────────────────── */
const LoadingSkeleton = () => (
  <Box
    sx={{
      width: "100%",
      minHeight: "100vh",
      bgcolor: "#f8f9fb",
      p: { xs: 2, sm: 2.5, md: 3 },
      boxSizing: "border-box",
    }}
  >
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

      {/* ← Back to Dashboard placeholder */}
      <ShimmerBox sx={{ width: 160, height: 20, borderRadius: "6px" }} />

      {/* Project header card skeleton */}
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid rgba(15,23,42,0.09)",
          borderRadius: "16px",
          p: { xs: 2, sm: 2.5 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <ShimmerBox sx={{ width: "60%", height: 26, mb: 1, borderRadius: "8px" }} />
          <ShimmerBox sx={{ width: "35%", height: 16, borderRadius: "6px" }} />
        </Box>
        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
          <ShimmerBox sx={{ width: 56, height: 52, borderRadius: "10px", mb: 0.8 }} />
          <ShimmerBox sx={{ width: 88, height: 14, borderRadius: "5px" }} />
        </Box>
      </Box>

      {/* Progress card skeleton */}
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid rgba(15,23,42,0.09)",
          borderRadius: "16px",
          p: { xs: 2, sm: 2.5 },
          boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.8 }}>
          <ShimmerBox sx={{ width: 20, height: 20, borderRadius: "5px" }} />
          <ShimmerBox sx={{ width: 150, height: 20, borderRadius: "6px" }} />
        </Box>
        <ShimmerBox sx={{ width: "50%", height: 14, mb: 2, borderRadius: "5px" }} />
        <ShimmerBox sx={{ width: "100%", height: 10, borderRadius: "5px", mb: 0.8 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <ShimmerBox sx={{ width: 36, height: 14, borderRadius: "5px" }} />
        </Box>
      </Box>

      {/* "Ongoing Tasks" heading skeleton */}
      <ShimmerBox sx={{ width: 160, height: 28, borderRadius: "8px" }} />

      {/* Task row skeletons */}
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            bgcolor: "#fff",
            border: "1px solid rgba(15,23,42,0.09)",
            borderRadius: "14px",
            p: { xs: "14px 16px", sm: "16px 20px" },
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            boxShadow: "0 1px 6px rgba(15,23,42,0.05)",
            /* Staggered fade-in feel */
            opacity: 1 - i * 0.18,
          }}
        >
          {/* Circle checkbox */}
          <ShimmerBox sx={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0 }} />

          {/* Title + meta */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <ShimmerBox sx={{ width: `${75 - i * 12}%`, height: 18, mb: 1, borderRadius: "6px" }} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <ShimmerBox sx={{ width: 90, height: 13, borderRadius: "5px" }} />
              <ShimmerBox sx={{ width: 100, height: 13, borderRadius: "5px" }} />
            </Box>
          </Box>

          {/* Priority chip + chevron */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
            <ShimmerBox sx={{ width: 62, height: 24, borderRadius: "6px" }} />
            <ShimmerBox sx={{ width: 24, height: 24, borderRadius: "6px" }} />
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

/* ─── Component ──────────────────────────────────────────────────────── */
const ProjectDetailView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [newSubTaskInputs, setNewSubTaskInputs] = useState({});
  const [modifiedTasks, setModifiedTasks] = useState({});
  const [savingAll, setSavingAll] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const adminToken = localStorage.getItem("adminToken");
  const token = localStorage.getItem("token") || adminToken;
  const isAdminDashboard = !projectId && !!adminToken;
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeeProjects, setEmployeeProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const normalizeProjectTodos = (tasksPayload, todosPayload, currentProjectId) => {
    return (tasksPayload || []).map((item, index) => {
      const rawId = item.employeeTasks?._id || item._id;
      const backendTaskId =
        typeof rawId === "object" ? rawId.$oid || rawId.toString() : rawId;
      const staticTodoList =
        item.employeeTasks?.todolist ||
        item.employeeTasks?.tasks?.todolist ||
        item.employeeTasks?.tasks?.subTasks ||
        [];
      const currentTaskId = item.employeeTasks?.tasks?.task_id;

      let fetchedTodos = [];
      let todoMetadata = {};
      let hasMatchedTodo = false;

      if (Array.isArray(todosPayload)) {
        const matchedTodoEntry = todosPayload.find(
          (todo) =>
            todo.task_id === currentTaskId && todo.project_id === currentProjectId
        );
        if (matchedTodoEntry) {
          hasMatchedTodo = true;
          todoMetadata = {
            group_id: matchedTodoEntry._id,
            user_id: matchedTodoEntry.user_id,
          };
          if (Array.isArray(matchedTodoEntry.user_subTaks)) {
            fetchedTodos = matchedTodoEntry.user_subTaks.map((st) => ({
              todo_id: st.todo_id,
              title: st.title,
              status: st.status || "pending",
              createdAt: st.createdAt,
            }));
          }
        }
      }

      const combinedSubTasks = hasMatchedTodo ? fetchedTodos : staticTodoList;
      return {
        ...(item.employeeTasks?.tasks || {}),
        ...todoMetadata,
        _id: todoMetadata.group_id || backendTaskId || `task-${index}-${Date.now()}`,
        originalTaskId: currentTaskId,
        subTasks: combinedSubTasks,
      };
    });
  };

  /* ══════════════════════════════════════════════════════════════════
     CORE DATA LOGIC — DO NOT CHANGE
     3 parallel API calls + task_id / subtask normalisation
  ══════════════════════════════════════════════════════════════════ */
  const fetchProjectDetails = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const headers = { Authorization: `${token}`, "Content-Type": "application/json" };

      const [projectsRes, tasksRes, todosRes] = await Promise.all([
        axios.get("http://localhost:8080/employee_included_proj", { headers }),
        axios.get(`http://localhost:8080/emp_proj-tasks/${projectId}`, { headers }),
        axios.get("http://localhost:8080/achive_created_todo_list", { headers }),
      ]);

      const projectMetadata = projectsRes.data.find((p) => p._id === projectId);

      if (projectMetadata) {
        const normalizedTasks = normalizeProjectTodos(
          tasksRes.data,
          todosRes.data,
          projectId
        );
        setProject({ ...projectMetadata, todos: normalizedTasks });
      } else {
        setProject(null);
      }
      /* ↓ Removed artificial 600 ms delay — instant render after fetch */
      setLoading(false);
    } catch (error) {
      console.error("Error fetching project details:", error);
      setLoading(false);
    }
  }, [projectId, token]);

  useEffect(() => {
    if (token && projectId) fetchProjectDetails();
  }, [projectId, token, fetchProjectDetails]);

  useEffect(() => {
    if (!isAdminDashboard || !token) return;
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:8080/admin/users",
          { headers: { Authorization: `${token}` } }
        );
        const users = Array.isArray(res.data) ? res.data : [];
        setEmployees(users);
        if (users.length > 0) {
          const firstId = users[0]._id;
          setSelectedEmployeeId(firstId);
        }
      } catch (error) {
        console.error("Failed to fetch employee list", error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [isAdminDashboard, token]);

  useEffect(() => {
    if (!isAdminDashboard || !selectedEmployeeId || !token) return;
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `${token}`, "Content-Type": "application/json" };
        const projectsRes = await axios.get(
          "http://localhost:8080/employee_included_proj",
          { headers, params: { empId: selectedEmployeeId } }
        );
        const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
        setEmployeeProjects(projects);
        if (projects.length > 0) {
          setSelectedProjectId((prev) =>
            prev && projects.some((p) => p._id === prev) ? prev : projects[0]._id
          );
        } else {
          setSelectedProjectId("");
          setProject(null);
        }
      } catch (error) {
        console.error("Failed to fetch employee projects", error);
        setEmployeeProjects([]);
        setSelectedProjectId("");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [isAdminDashboard, selectedEmployeeId, token]);

  useEffect(() => {
    if (!isAdminDashboard || !selectedEmployeeId || !selectedProjectId || !token) return;
    const fetchSelectedProject = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `${token}`, "Content-Type": "application/json" };
        const [tasksRes, todosRes] = await Promise.all([
          axios.get(
            `http://localhost:8080/emp_proj-tasks/${selectedProjectId}`,
            { headers, params: { empId: selectedEmployeeId } }
          ),
          axios.get(
            "http://localhost:8080/achive_created_todo_list",
            { headers, params: { empId: selectedEmployeeId } }
          ),
        ]);
        const selectedProject = employeeProjects.find((p) => p._id === selectedProjectId);
        if (!selectedProject) {
          setProject(null);
          return;
        }
        const normalizedTasks = normalizeProjectTodos(
          tasksRes.data,
          todosRes.data,
          selectedProjectId
        );
        setProject({ ...selectedProject, todos: normalizedTasks });
      } catch (error) {
        console.error("Failed to fetch employee project tasks", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSelectedProject();
  }, [isAdminDashboard, selectedEmployeeId, selectedProjectId, employeeProjects, token]);

  /* ══ Interaction handlers (logic preserved exactly) ══════════════ */
  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleToggleTodo = (todoId) => {
    if (!todoId || !project?.todos) return;
    setProject((prev) => ({
      ...prev,
      todos: prev.todos.map((todo) =>
        todo._id === todoId
          ? { ...todo, status: todo.status === "completed" ? "pending" : "completed" }
          : todo
      ),
    }));
  };

  const handleToggleExpand = (taskId) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleSubTaskInputChange = (taskId, value) => {
    setNewSubTaskInputs((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleAddSubTask = async (taskId) => {
    const content = newSubTaskInputs[taskId];
    if (!content?.trim()) return;
    const subId = `sub-${Date.now()}`;
    const newSubTask = { todo_id: subId, title: content, status: "pending", createdAt: new Date().toISOString(), isNew: true };
    setProject((prev) => ({
      ...prev,
      todos: prev.todos.map((todo) =>
        todo._id === taskId
          ? { ...todo, subTasks: [...(todo.subTasks || []), newSubTask] }
          : todo
      ),
    }));
    setModifiedTasks((prev) => ({ ...prev, [taskId]: true }));
    setNewSubTaskInputs((prev) => ({ ...prev, [taskId]: "" }));
  };

  const handleSaveAllSubTasks = async (taskId) => {
    const todo = project.todos.find((t) => t._id === taskId);
    if (!todo) return;
    try {
      const headers = { Authorization: `${token}`, "Content-Type": "application/json" };
      const subTaskList = (todo.subTasks || []).map((st) => ({
        createdAt: st.createdAt.includes("T") ? st.createdAt.split("T")[0] : st.createdAt,
        status: st.status, title: st.title, todo_id: st.todo_id,
      }));
      const payload = {
        user_id: todo.user_id, task_id: todo.task_id,
        project_id: projectId, user_subTaks: subTaskList, todolist: subTaskList,
      };
      const res_msg = await axios.post(
        "http://localhost:8080/add_multiple_todos",
        payload, { headers }
      );
      const successMsg = typeof res_msg.data.message === "string"
        ? res_msg.data.message
        : "Todo updated successfully";
      setAlertMsg(successMsg);
      setAlertOpen(true);
      setModifiedTasks((prev) => { const next = { ...prev }; delete next[taskId]; return next; });
      await fetchProjectDetails(true);
    } catch (error) {
      console.error("Failed to save subtasks", error);
    }
  };

  const handleDeleteSubTask = async (taskId, subTaskId) => {
    setProject((prev) => ({
      ...prev,
      todos: prev.todos.map((t) =>
        t._id === taskId
          ? { ...t, subTasks: t.subTasks.filter((st) => st.todo_id !== subTaskId) }
          : t
      ),
    }));
    setModifiedTasks((prev) => ({ ...prev, [taskId]: true }));
  };

  const handleToggleSubTaskStatus = (taskId, subTaskId) => {
    setProject((prev) => ({
      ...prev,
      todos: prev.todos.map((t) =>
        t._id === taskId
          ? {
            ...t, subTasks: t.subTasks.map((st) =>
              st.todo_id === subTaskId
                ? { ...st, status: st.status === "completed" ? "pending" : "completed" }
                : st
            )
          }
          : t
      ),
    }));
    setModifiedTasks((prev) => ({ ...prev, [taskId]: true }));
  };

  /* Global "Confirm Updates" — saves ALL modified tasks sequentially */
  const handleConfirmUpdates = async () => {
    const pendingIds = Object.keys(modifiedTasks);
    if (pendingIds.length === 0) return;
    setSavingAll(true);
    for (const taskId of pendingIds) {
      await handleSaveAllSubTasks(taskId);
    }
    setSavingAll(false);
  };

  /* ══ Derived data ════════════════════════════════════════════════ */
  const calculatedProgress =
    project?.todos?.length > 0
      ? Math.round(
        (project.todos.reduce((acc, todo) => {
          if (todo.status === "completed") return acc + 1;
          if (todo.subTasks?.length > 0) {
            return acc + todo.subTasks.filter((st) => st.status === "completed").length / todo.subTasks.length;
          }
          return acc;
        }, 0) / project.todos.length) * 100
      )
      : 0;

  /* ══ Early returns ═══════════════════════════════════════════════ */
  if (loading) return <LoadingSkeleton />;

  if (isAdminDashboard) {
    const selectedEmployee =
      employees.find((emp) => emp._id === selectedEmployeeId) || null;
    const assignedCount = project?.todos?.length || 0;
    const completedTasks =
      project?.todos?.filter((todo) => todo.status === "completed").length || 0;
    const subTaskTotal =
      project?.todos?.reduce((acc, todo) => acc + (todo.subTasks?.length || 0), 0) || 0;
    const completedSubTasks =
      project?.todos?.reduce(
        (acc, todo) =>
          acc + (todo.subTasks?.filter((st) => st.status === "completed").length || 0),
        0
      ) || 0;

    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          bgcolor: "#f8f9fb",
          p: { xs: 2, sm: 2.5, md: 3 },
          boxSizing: "border-box",
        }}
      >
        <Stack spacing={2}>
          <Typography sx={{ fontWeight: 800, color: SLATE, fontSize: { xs: "1.1rem", sm: "1.35rem" } }}>
            Admin Employee Work Dashboard
          </Typography>

          <Box sx={{ bgcolor: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", p: 2 }}>
            <Typography sx={{ fontWeight: 700, color: SLATE, mb: 1 }}>Employees</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
              {employees.map((emp) => (
                <Chip
                  key={emp._id}
                  label={emp.name || emp.email || "Employee"}
                  onClick={() => setSelectedEmployeeId(emp._id)}
                  sx={{
                    bgcolor: selectedEmployeeId === emp._id ? NAVY : "#eef2ff",
                    color: selectedEmployeeId === emp._id ? "#fff" : SLATE,
                    fontWeight: 600,
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Box sx={{ bgcolor: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", p: 2 }}>
            <Typography sx={{ fontWeight: 700, color: SLATE, mb: 0.5 }}>
              {selectedEmployee ? `${selectedEmployee.name || "Employee"}'s Projects` : "Projects"}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1, mb: 1.5 }}>
              {employeeProjects.map((proj) => (
                <Chip
                  key={proj._id}
                  label={proj.title || "Untitled Project"}
                  onClick={() => setSelectedProjectId(proj._id)}
                  sx={{
                    bgcolor: selectedProjectId === proj._id ? NAVY2 : "#f1f5f9",
                    color: selectedProjectId === proj._id ? "#fff" : SLATE,
                    fontWeight: 600,
                  }}
                />
              ))}
            </Stack>

            {project ? (
              <Stack spacing={1}>
                <Typography sx={{ color: MUTED, fontWeight: 600 }}>
                  Assigned Tasks: {assignedCount} | Completed Tasks: {completedTasks}
                </Typography>
                <Typography sx={{ color: MUTED, fontWeight: 600 }}>
                  Completed Subtasks: {completedSubTasks}/{subTaskTotal}
                </Typography>
                <Typography sx={{ color: SLATE, fontWeight: 800 }}>
                  Overall Progress: {calculatedProgress}%
                </Typography>
              </Stack>
            ) : (
              <Typography sx={{ color: MUTED }}>
                Select an employee and a project to view assigned work.
              </Typography>
            )}
          </Box>

          {project && (
            <Stack spacing={1.5}>
              {project.todos?.map((todo) => {
                const subProgress =
                  todo.subTasks?.length > 0
                    ? Math.round(
                      (todo.subTasks.filter((s) => s.status === "completed").length /
                        todo.subTasks.length) *
                      100
                    )
                    : 0;
                return (
                  <Box
                    key={todo._id}
                    sx={{
                      bgcolor: CARD,
                      border: `1px solid ${BORDER}`,
                      borderRadius: "12px",
                      p: 1.5,
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, color: SLATE }}>
                      {todo.title || "Task"}
                    </Typography>
                    <Typography sx={{ color: MUTED, fontSize: "0.85rem" }}>
                      Status: {todo.status || "pending"} | Subtask Progress: {subProgress}%
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Box>
    );
  }

  if (!project) return null;

  const daysRemaining = getDaysRemaining(project.deadline);
  const hasModifications = Object.keys(modifiedTasks).length > 0;

  /* ══ Render ══════════════════════════════════════════════════════ */
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f8f9fb",
        p: { xs: 2, sm: 2.5, md: 3 },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Fade in timeout={350}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5 } }}>

          {/* ── Back link ──────────────────────────────────────── */}
          <Box
            component="button"
            onClick={() => navigate(-1)}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.6,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: SLATE,
              fontWeight: 600,
              fontSize: "0.88rem",
              p: 0,
              alignSelf: "flex-start",
              "&:hover": { color: NAVY2 },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            Back to Dashboard
          </Box>

          {/* ── Project Header Card ─────────────────────────────── */}
          <Box
            sx={{
              bgcolor: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: "16px",
              p: { xs: 2, sm: 2.5 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: SLATE,
                  fontSize: { xs: "1.05rem", sm: "1.25rem", md: "1.4rem" },
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  mb: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {project.title}
              </Typography>
              <Typography sx={{ color: MUTED, fontSize: { xs: "0.75rem", sm: "0.82rem" }, fontWeight: 500 }}>
                Project Workflow System
              </Typography>
            </Box>

            <Box sx={{ textAlign: "right", flexShrink: 0 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: daysRemaining <= 5 ? RED : SLATE,
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  lineHeight: 1.2,
                }}
              >
                {formatDate(project.deadline)}
              </Typography>
              <Typography sx={{ color: MUTED, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase" }}>
                {daysRemaining >= 0 ? `${daysRemaining} Days Left` : `${Math.abs(daysRemaining)} Days Overdue`}
              </Typography>
            </Box>
          </Box>

          {/* ── Project Progress Card ───────────────────────────── */}
          <Box
            sx={{
              bgcolor: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: "16px",
              p: { xs: 2, sm: 2.5 },
              boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.5 }}>
              <TrendingUpIcon sx={{ fontSize: 20, color: SLATE }} />
              <Typography sx={{ fontWeight: 800, color: SLATE, fontSize: { xs: "0.95rem", sm: "1.05rem" } }}>
                Project Progress
              </Typography>
            </Box>
            <Typography sx={{ color: MUTED, fontSize: "0.78rem", mb: 1.8 }}>
              Overview of your ongoing tasks
            </Typography>

            {/* Dark navy progress bar */}
            <Box sx={{ position: "relative", height: 10, borderRadius: 5, bgcolor: "rgba(15,23,42,0.07)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calculatedProgress}%` }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                  borderRadius: 5,
                }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.8 }}>
              <Typography sx={{ fontWeight: 800, color: SLATE, fontSize: "0.82rem" }}>
                {calculatedProgress}%
              </Typography>
            </Box>
          </Box>

          {/* ── Ongoing Tasks ───────────────────────────────────── */}
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                color: SLATE,
                fontSize: { xs: "1.1rem", sm: "1.2rem" },
                letterSpacing: "-0.02em",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              Ongoing Tasks
            </Typography>

            <Stack spacing={1.5}>
              <AnimatePresence>
                {project.todos?.map((todo, index) => {
                  const isExpanded = !!expandedTasks[todo._id];
                  const isDoneMain = todo.status === "completed";
                  const priorityClr = getPriorityColor(todo.priority);
                  const priorityBg = getPriorityBg(todo.priority);
                  const subProgress = todo.subTasks?.length > 0
                    ? Math.round((todo.subTasks.filter((s) => s.status === "completed").length / todo.subTasks.length) * 100)
                    : 0;

                  return (
                    <motion.div
                      key={todo._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.28 }}
                    >
                      <Box
                        sx={{
                          bgcolor: CARD,
                          border: `1px solid ${isExpanded ? "rgba(26,45,90,0.2)" : BORDER}`,
                          borderRadius: "14px",
                          overflow: "hidden",
                          boxShadow: isExpanded
                            ? "0 4px 20px rgba(15,23,42,0.1)"
                            : "0 1px 6px rgba(15,23,42,0.05)",
                          transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                        }}
                      >
                        {/* Task row */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1, sm: 1.5 },
                            p: { xs: "12px 14px", sm: "14px 18px" },
                          }}
                        >
                          {/* Circle checkbox */}
                          <Checkbox
                            checked={isDoneMain}
                            onChange={() => handleToggleTodo(todo._id)}
                            icon={<RadioButtonUncheckedIcon sx={{ fontSize: 22, color: "rgba(15,23,42,0.2)" }} />}
                            checkedIcon={<CheckCircleIcon sx={{ fontSize: 22, color: GREEN }} />}
                            sx={{ p: 0, flexShrink: 0 }}
                          />

                          {/* Title + meta */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: isDoneMain ? MUTED : SLATE,
                                fontSize: { xs: "0.9rem", sm: "0.97rem" },
                                textDecoration: isDoneMain ? "line-through" : "none",
                                lineHeight: 1.3,
                                mb: 0.4,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {todo.title}
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.2, sm: 2 }, alignItems: "center" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <PersonIcon sx={{ fontSize: 13, color: MUTED }} />
                                <Typography sx={{ fontSize: "0.72rem", color: MUTED, fontWeight: 500 }}>
                                  {todo.employee === "You" ? "You" : "Assigned Unit"}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 13, color: MUTED }} />
                                <Typography sx={{ fontSize: "0.72rem", color: MUTED, fontWeight: 500 }}>
                                  Due {new Date(todo.duedate).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          {/* Priority chip + expand */}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexShrink: 0 }}>
                            {todo.priority && (
                              <Chip
                                label={todo.priority}
                                size="small"
                                sx={{
                                  bgcolor: priorityBg,
                                  color: priorityClr,
                                  fontWeight: 700,
                                  fontSize: "0.7rem",
                                  height: 24,
                                  borderRadius: "6px",
                                  "& .MuiChip-label": { px: 1 },
                                }}
                              />
                            )}
                            <IconButton
                              size="small"
                              onClick={() => handleToggleExpand(todo._id)}
                              sx={{
                                color: MUTED,
                                p: 0.4,
                                "&:hover": { bgcolor: "rgba(15,23,42,0.05)" },
                              }}
                            >
                              {isExpanded
                                ? <KeyboardArrowUpIcon sx={{ fontSize: 20 }} />
                                : <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                              }
                            </IconButton>
                          </Box>
                        </Box>

                        {/* ── Subtasks panel ──────────────────────────── */}
                        <Collapse in={isExpanded}>
                          <Box
                            sx={{
                              px: { xs: 2, sm: 2.5 },
                              pb: 2,
                              pt: 0.5,
                              borderTop: `1px solid ${BORDER}`,
                              bgcolor: "#fafbfc",
                            }}
                          >
                            {/* Sub-progress */}
                            {todo.subTasks?.length > 0 && (
                              <Box sx={{ mb: 2, pt: 1.5 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                    Sub-task Progress
                                  </Typography>
                                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: SLATE }}>
                                    {subProgress}%
                                  </Typography>
                                </Box>
                                <Box sx={{ height: 5, borderRadius: 3, bgcolor: "rgba(15,23,42,0.07)", overflow: "hidden" }}>
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${subProgress}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    style={{
                                      height: "100%",
                                      background: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                                      borderRadius: 3,
                                    }}
                                  />
                                </Box>
                              </Box>
                            )}

                            {/* Sub-task list */}
                            <Stack spacing={1} sx={{ mb: 1.5 }}>
                              {todo.subTasks?.map((subTask) => (
                                <Box
                                  key={subTask.todo_id}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: "8px 12px",
                                    bgcolor: CARD,
                                    border: `1px solid ${BORDER}`,
                                    borderRadius: "10px",
                                    gap: 1,
                                  }}
                                >
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                                    <Checkbox
                                      size="small"
                                      checked={subTask.status === "completed"}
                                      onChange={() => handleToggleSubTaskStatus(todo._id, subTask.todo_id)}
                                      sx={{
                                        p: 0.3,
                                        flexShrink: 0,
                                        color: "rgba(15,23,42,0.2)",
                                        "&.Mui-checked": { color: NAVY2 },
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontWeight: 600,
                                        color: subTask.status === "completed" ? MUTED : SLATE,
                                        textDecoration: subTask.status === "completed" ? "line-through" : "none",
                                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                        flex: 1,
                                        minWidth: 0,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {subTask.title}
                                    </Typography>
                                    {subTask.isNew && (
                                      <Chip
                                        label="Unsaved"
                                        size="small"
                                        sx={{
                                          height: 20,
                                          fontSize: "0.65rem",
                                          bgcolor: "rgba(249,115,22,0.1)",
                                          color: AMBER,
                                          fontWeight: 700,
                                          flexShrink: 0,
                                          "& .MuiChip-label": { px: 0.8 },
                                        }}
                                      />
                                    )}
                                  </Box>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteSubTask(todo._id, subTask.todo_id)}
                                    sx={{ color: "rgba(15,23,42,0.2)", "&:hover": { color: RED }, p: 0.4 }}
                                  >
                                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Box>
                              ))}
                            </Stack>

                            {/* Add new subtask input */}
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <TextField
                                size="small"
                                fullWidth
                                autoComplete="off"
                                placeholder="Add a sub-task..."
                                value={newSubTaskInputs[todo._id] || ""}
                                onChange={(e) => handleSubTaskInputChange(todo._id, e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddSubTask(todo._id)}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px",
                                    bgcolor: CARD,
                                    color: "#000",
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                    "& fieldset": { borderColor: BORDER },
                                    "&:hover fieldset": { borderColor: "rgba(26,45,90,0.3)" },
                                    "&.Mui-focused fieldset": { borderColor: NAVY },
                                  },
                                }}
                              />
                              <Button
                                variant="contained"
                                onClick={() => handleAddSubTask(todo._id)}
                                sx={{
                                  minWidth: 40,
                                  px: 1.5,
                                  borderRadius: "10px",
                                  bgcolor: NAVY,
                                  "&:hover": { bgcolor: NAVY2 },
                                  boxShadow: "none",
                                  flexShrink: 0,
                                }}
                              >
                                <AddIcon sx={{ fontSize: 18 }} />
                              </Button>
                            </Box>

                            {/* Per-task save (shown if this specific task has unsaved changes) */}
                            {modifiedTasks[todo._id] && (
                              <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => handleSaveAllSubTasks(todo._id)}
                                sx={{
                                  mt: 1.5,
                                  borderRadius: "10px",
                                  borderColor: NAVY,
                                  color: NAVY,
                                  fontWeight: 700,
                                  textTransform: "none",
                                  fontSize: "0.82rem",
                                  "&:hover": { bgcolor: "rgba(26,45,90,0.05)", borderColor: NAVY },
                                }}
                              >
                                Save changes for this task
                              </Button>
                            )}
                          </Box>
                        </Collapse>
                      </Box>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Stack>
          </Box>

          {/* ── Confirm Updates button (global save) ─────────────── */}
          <Box sx={{ pt: 1, pb: { xs: 8, sm: 3 } }}>
            <Button
              fullWidth
              variant="contained"
              disabled={savingAll}
              onClick={hasModifications ? handleConfirmUpdates : undefined}
              sx={{
                background: hasModifications
                  ? `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`
                  : `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                color: "#fff",
                fontWeight: 700,
                fontSize: { xs: "0.9rem", sm: "0.95rem" },
                borderRadius: "12px",
                py: 1.5,
                textTransform: "none",
                opacity: savingAll ? 0.7 : 1,
                boxShadow: "0 4px 20px rgba(15,42,100,0.25)",
                "&:hover": {
                  background: `linear-gradient(135deg, #0f1f42 0%, #0a2a6e 100%)`,
                  boxShadow: "0 6px 24px rgba(15,42,100,0.35)",
                },
                "&.Mui-disabled": {
                  color: "rgba(255,255,255,0.6)",
                  background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                },
              }}
            >
              {savingAll ? "Saving…" : "Confirm Updates"}
            </Button>
          </Box>
        </Box>
      </Fade>

      {/* ── Success snackbar ────────────────────────────────────────── */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3500}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="success"
          variant="filled"
          sx={{
            borderRadius: "12px",
            fontWeight: 700,
            bgcolor: "#22c55e",
            boxShadow: "0 6px 20px rgba(34,197,94,0.3)",
          }}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectDetailView;