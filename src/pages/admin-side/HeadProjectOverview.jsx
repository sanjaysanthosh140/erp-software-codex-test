import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Divider,
  TextField,
  InputAdornment,
  Skeleton,
  alpha,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// ─── helpers ────────────────────────────────────────────────────────────────

const statusColor = (s) => {
  const m = {
    completed: "#4ade80",
    done: "#4ade80",
    in_progress: "#00d4ff",
    inprogress: "#00d4ff",
    pending: "#fbbf24",
  };
  return m[s?.toLowerCase()] ?? "#94a3b8";
};

const priorityColor = (p) => {
  const m = {
    Critical: "#f43f5e",
    High: "#fb7185",
    Medium: "#fbbf24",
    Low: "#4ade80",
  };
  return m[p] ?? "#94a3b8";
};

const getProjectProgress = (project) => {
  const todos = project.todos ?? [];
  if (!todos.length) return 0;
  const done = todos.filter((t) => t.status === "completed").length;
  return Math.round((done / todos.length) * 100);
};

const isTaskCompleted = (task) => {
  if (!task) return false;
  const status = (task.status || "").toLowerCase();
  if (status === "completed" || status === "done") {
    return true;
  }

  const todos = task.user_subTaks || [];
  if (todos.length > 0) {
    const doneTodos = todos.filter(td => {
      const tdStatus = (td.status || "").toLowerCase();
      return tdStatus === "completed" || tdStatus === "done";
    }).length;
    return doneTodos === todos.length;
  }

  return false;
};

// --- Theme Constants ---
const PRIMARY_BLUE = "#0f172a";
const ACCENT_BLUE = "#38bdf8";
const STATUS_ACTIVE_BG = "#e0f2fe";
const STATUS_ACTIVE_TEXT = "#0369a1";
const PRIORITY_HIGH_BG = "#fee2e2";
const PRIORITY_HIGH_TEXT = "#991b1b";
const BORDER_COLOR = "#e2e8f0";
const CARD_SHADOW = "0 4px 20px rgba(0, 0, 0, 0.05)";

const PremiumCard = ({ children, sx = {}, hoverEffect = true, onClick }) => (
  <Card
    component={motion.div}
    whileHover={hoverEffect ? {
      translateY: -4,
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
    } : {}}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    sx={{
      background: "#fff",
      border: `1px solid #e2e8f0`,
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      color: "#1e293b",
      overflow: "hidden",
      transition: "all 0.3s ease",
      ...sx,
    }}
  >
    {children}
  </Card>
);

// ─── sub-components ──────────────────────────────────────────────────────────

const TodoItem = ({ todo }) => {
  const checked = todo.status === "completed";
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        py: 1.5,
        px: 2,
        borderRadius: "12px",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": { background: "rgba(15, 23, 42, 0.04)" },
      }}
    >
      <Box sx={{ mt: 0.3 }}>
        {checked ? (
          <CheckCircleIcon sx={{ color: "#4ade80", fontSize: 20 }} />
        ) : (
          <RadioButtonUncheckedIcon
            sx={{ color: alpha("#475569", 0.4), fontSize: 20 }}
          />
        )}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            color: checked ? "#94a3b8" : "#1e293b",
            fontSize: "0.88rem",
            fontWeight: checked ? 500 : 700,
            textDecoration: checked ? "line-through" : "none",
            lineHeight: 1.5,
          }}
        >
          {todo.title}
        </Typography>
        {todo.createdAt && (
          <Typography sx={{ color: "#64748b", fontSize: "0.72rem", mt: 0.5, fontWeight: 600 }}>
            Detected: {todo.createdAt}
          </Typography>
        )}
      </Box>
      <Chip
        label={todo.status ?? "pending"}
        size="small"
        sx={{
          bgcolor: alpha(statusColor(todo.status), 0.1),
          color: statusColor(todo.status),
          fontSize: "0.65rem",
          height: 20,
          fontWeight: 900,
          textTransform: "uppercase",
          border: `1px solid ${alpha(statusColor(todo.status), 0.2)}`,
          borderRadius: "6px"
        }}
      />
    </Box>
  );
};

const TaskCard = ({ task }) => {
  const todos = task.user_subTaks ?? [];
  const doneTodos = todos.filter((t) => t.status === "completed").length;
  const todoProgress = todos.length ? Math.round((doneTodos / todos.length) * 100) : 0;

  const sc = statusColor(task.status);

  return (
    <Box
      sx={{
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: "12px",
        mb: 2,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b", mb: 0.5 }}>
            {task.title}
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 500 }}>
            Deadline: {task.duedate || "2026-03-25"}
          </Typography>
        </Box>
        <Chip
          label={task.status === "completed" ? "Completed" : "Pending"}
          size="small"
          sx={{
            bgcolor: task.status === "completed" ? "#dcfce7" : "#fef3c7",
            color: task.status === "completed" ? "#15803d" : "#92400e",
            fontWeight: 700,
            fontSize: "0.7rem",
            borderRadius: "6px",
          }}
        />
      </Box>

      {/* Progress Bar within Task */}
      <Box sx={{ px: 2, pb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={todoProgress}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "#f1f5f9",
            "& .MuiLinearProgress-bar": {
              background: PRIMARY_BLUE,
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {todos.length > 0 && (
        <Accordion disableGutters sx={{ boxShadow: "none", background: "transparent", "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: "#64748b" }} />} sx={{ minHeight: 32, "& .MuiAccordionSummary-content": { my: 0.5 } }}>
            {/* Icon for expanding */}
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 1, backgroundColor: "#fff" }}>
            <Box sx={{ borderTop: `1px solid ${BORDER_COLOR}`, mt: 1, pt: 1 }}>
              {todos.map((todo, idx) => (
                <TodoItem key={todo.todo_id ?? idx} todo={todo} />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {todos.length === 0 && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", fontStyle: "italic", textAlign: "center" }}>
            No active directives for this task.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const EmployeeCard = ({ entry, index }) => {
  const tasks = entry.tasks ?? [];
  const totalTasksCount = tasks.length;
  const doneTasksCount = tasks.filter(t => isTaskCompleted(t)).length;
  const overallProgress = totalTasksCount ? Math.round((doneTasksCount / totalTasksCount) * 100) : 0;

  const totalTodos = tasks.reduce((sum, t) => sum + (t.user_subTaks ?? []).length, 0);

  const initials = (entry.employee ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <PremiumCard sx={{ p: 0, mb: 3 }} hoverEffect={false}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: PRIMARY_BLUE,
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#1e293b" }}>
              {entry.employee}
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 500 }}>
              {tasks.length} Operational Tasks • {totalTodos} Directives
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right", ml: 1 }}>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: "#10b981", lineHeight: 1 }}>
              100%
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>
              Work Capacity
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5, alignItems: "center" }}>
            <Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 600 }}>
              Work Progress
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>
              {overallProgress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overallProgress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "#f1f5f9",
              "& .MuiLinearProgress-bar": {
                background: PRIMARY_BLUE,
                borderRadius: 4,
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#1e293b", textTransform: "uppercase" }}>
              Assigned Tasks
            </Typography>
            <Chip
              label="Medium"
              size="small"
              sx={{ bgcolor: "#fff7ed", color: "#c2410c", fontWeight: 700, fontSize: "0.65rem", border: "1px solid #ffedd5" }}
            />
          </Box>

          {tasks.length === 0 ? (
            <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem", textAlign: "center", py: 2 }}>
              No tasks assigned.
            </Typography>
          ) : (
            <Box
              sx={{
                maxHeight: 350,
                overflowY: "auto",
                overflowX: "auto",
                pr: 1,
                pb: 1,
                "&::-webkit-scrollbar": { width: "6px", height: "6px" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#cbd5e1", borderRadius: "10px" },
              }}
            >
              {tasks.map((task, ti) => (
                <TaskCard key={task.task_id ?? task._id ?? ti} task={task} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </PremiumCard>
  );
};

// ─── project list card ───────────────────────────────────────────────────────

const ProjectListCard = ({ project, index, onSelect }) => {
  const progress = getProjectProgress(project);

  return (
    <PremiumCard
      sx={{ p: 0, cursor: "pointer" }}
      onClick={() => onSelect(project)}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography sx={{ color: "#1e293b", fontWeight: 800, fontSize: "1.1rem", mb: 0.5 }}>
              {project.title}
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
              IT
            </Typography>
          </Box>
          <Chip
            label="Active"
            size="small"
            sx={{
              bgcolor: STATUS_ACTIVE_BG,
              color: STATUS_ACTIVE_TEXT,
              fontWeight: 800,
              fontSize: "0.65rem",
              borderRadius: "6px",
              textTransform: "capitalize"
            }}
          />
        </Box>

        <Chip
          label="High"
          size="small"
          sx={{
            bgcolor: PRIORITY_HIGH_BG,
            color: PRIORITY_HIGH_TEXT,
            fontWeight: 800,
            fontSize: "0.65rem",
            borderRadius: "6px",
            mb: 2.5
          }}
        />

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500 }}>
              Deadline
            </Typography>
            <Typography sx={{ color: "#1e293b", fontSize: "0.8rem", fontWeight: 800 }}>
              2 days left
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pt: 2, borderTop: `1px solid ${BORDER_COLOR}` }}>
          <Box sx={{ display: "flex", mr: 1 }}>
            {[1, 2, 3].slice(0, (project.teamMembers ?? []).length || 2).map((_, i) => (
              <Avatar
                key={i}
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: "0.6rem",
                  bgcolor: ["#0369a1", "#f59e0b", "#991b1b"][i % 3],
                  color: "#fff",
                  border: "2px solid #fff",
                  ml: i === 0 ? 0 : -0.8
                }}
              >
                {String.fromCharCode(65 + i)}
              </Avatar>
            ))}
          </Box>
          <Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 600 }}>
            {(project.teamMembers ?? []).length || 2} Units
          </Typography>
        </Box>
      </Box>
    </PremiumCard>
  );
};

// ─── loading skeleton ─────────────────────────────────────────────────────────

const LoadingSkeleton = ({ count = 3 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, i) => (
      <Grid item xs={12} sm={6} md={4} key={i}>
        <PremiumCard sx={{ p: 4 }}>
          <Skeleton
            variant="rounded"
            width={50}
            height={50}
            sx={{ bgcolor: "#f1f5f9", borderRadius: "12px", mb: 2 }}
          />
          <Skeleton
            variant="text"
            width="40%"
            sx={{ bgcolor: "#f1f5f9", mb: 1, height: 20 }}
          />
          <Skeleton
            variant="text"
            width="80%"
            sx={{ bgcolor: "#f1f5f9", mb: 0.5, height: 32 }}
          />
          <Skeleton
            variant="text"
            width="60%"
            sx={{ bgcolor: "#f1f5f9", mb: 3 }}
          />
          <Skeleton
            variant="rounded"
            height={6}
            sx={{ bgcolor: "#f1f5f9", borderRadius: 3 }}
          />
        </PremiumCard>
      </Grid>
    ))}
  </Grid>
);

// ─── main page ────────────────────────────────────────────────────────────────

const HeadProjectOverview = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // --- project list state ---
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // --- selected project state ---
  const [selectedProject, setSelectedProject] = useState(null);
  const [overviewData, setOverviewData] = useState([]); // [{employee, tasks:[{...todos:[]}]}]
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState(null);

  // --- Calculate Total Progress dynamically based on Tasks ---
  const currentTotalProgress = React.useMemo(() => {
    if (!overviewData || overviewData.length === 0) return 0;

    let totalTasks = 0;
    let doneTasks = 0;

    overviewData.forEach((emp) => {
      const tasks = emp.tasks || [];
      totalTasks += tasks.length;
      doneTasks += tasks.filter(t => isTaskCompleted(t)).length;
    });

    return totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  }, [overviewData]);

  // fetch project list on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("https://project-management-sodtware-backend-end.onrender.com/admin/headProj", {
          headers: { Authorization: token, "Content-Type": "application/json" },
        });
        console.log(res.data);
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setProjectsLoading(false);
      }
    };
    if (token) fetchProjects();
  }, [token]);

  // fetch overview when a project is selected
  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    setOverviewData([]);
    setOverviewError(null);
    setOverviewLoading(true);
    try {
      const res = await axios.get(
        `https://project-management-sodtware-backend-end.onrender.com/admin/project-overview/${project._id}`,
        {
          headers: { Authorization: token, "Content-Type": "application/json" },
        },
      );

      const rawData = res.data;
      console.log("Raw Backend Data:", rawData);

      const employeeMap = new Map(); // empId -> { name, taskMap: Map(taskId -> task) }

      // Pass 1: Build Employee and Task Structure
      rawData.forEach((item) => {
        const empId = item.emp_datas?._id ? String(item.emp_datas._id) : null;
        const empName = item.emp_datas?.name;

        if (empId) {
          if (!employeeMap.has(empId)) {
            employeeMap.set(empId, { name: empName || "Unknown Employee", taskMap: new Map() });
          } else if (empName && employeeMap.get(empId).name === "Unknown Employee") {
            // Update name if we previously set it to "Unknown Employee" but now found a real name
            employeeMap.get(empId).name = empName;
          }
        }

        const taskSource = Array.isArray(item.employeeTasks)
          ? item.employeeTasks
          : Array.isArray(item.tasks)
            ? item.tasks.map(t => ({ tasks: t, employee: empId }))
            : [];

        taskSource.forEach((et) => {
          const taskObj = et.tasks || et;
          if (!taskObj || typeof taskObj !== "object") return;

          const currentEmpId = et.employee ? String(et.employee._id || et.employee) : empId;
          const currentEmpName = et.employee?.name || (currentEmpId === empId ? empName : null);

          if (!currentEmpId) return;

          if (!employeeMap.has(currentEmpId)) {
            employeeMap.set(currentEmpId, { name: currentEmpName || "Unknown Employee", taskMap: new Map() });
          } else if (currentEmpName && employeeMap.get(currentEmpId).name === "Unknown Employee") {
            employeeMap.get(currentEmpId).name = currentEmpName;
          }

          const taskId = String(taskObj.task_id || taskObj._id);
          const empRecord = employeeMap.get(currentEmpId);

          if (!empRecord.taskMap.has(taskId)) {
            empRecord.taskMap.set(taskId, {
              ...taskObj,
              task_id: taskId,
              user_subTaks: [],
              subTaskMap: new Map()
            });
          }
        });
      });

      // Pass 2: Link Subtasks Globably using user_id and task_id
      rawData.forEach((item) => {
        const subTasksContainer = Array.isArray(item.sub_tasks)
          ? item.sub_tasks
          : item.sub_tasks ? [item.sub_tasks] : [];

        subTasksContainer.forEach((st) => {
          if (!st) return;
          const stUserId = st.user_id ? String(st.user_id) : null;
          const stTaskId = st.task_id?._id ? String(st.task_id._id) : String(st.task_id);

          if (stUserId && employeeMap.has(stUserId)) {
            const empRecord = employeeMap.get(stUserId);
            const taskToUpdate = empRecord.taskMap.get(stTaskId);

            if (taskToUpdate && Array.isArray(st.user_subTaks)) {
              st.user_subTaks.forEach((todo) => {
                if (!todo || !todo.todo_id) return;
                taskToUpdate.subTaskMap.set(todo.todo_id, {
                  todo_id: todo.todo_id,
                  title: todo.title,
                  status: todo.status || "pending",
                  createdAt: todo.createdAt,
                });
              });
            }
          }
        });
      });

      // Convert to UI format
      const formattedData = Array.from(employeeMap.values()).map(emp => ({
        employee: emp.name,
        tasks: Array.from(emp.taskMap.values()).map(task => {
          const { subTaskMap, ...taskData } = task;
          return {
            ...taskData,
            user_subTaks: Array.from(subTaskMap.values())
          };
        })
      }))
        .filter(emp => emp.tasks.length > 0); // Only show employees with tasks

      setOverviewData(formattedData);
      console.log("Formatted Overview Data:", formattedData);
    } catch (err) {
      console.error("Error fetching overview:", err);
      setOverviewError(
        err.response?.data?.message ?? "Failed to load project overview.",
      );
    } finally {
      setOverviewLoading(false);
    }
  };

  const handleBack = () => {
    if (selectedProject) {
      setSelectedProject(null);
      setOverviewData([]);
      setOverviewError(null);
    } else {
      navigate("/head");
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ── PAGE root ──
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f1f5f9",
        position: "relative",
        p: { xs: 2, sm: 3, md: 5 },
        color: "#0f172a",
      }}
    >
      {/* Background Mesh Blobs */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: "60vw",
            height: "60vw",
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: "55vw",
            height: "55vw",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </Box>
      {/* ── HEADER ── */}
      <Box
        sx={{ mb: selectedProject ? 4 : 6, position: "relative", zIndex: 1 }}
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              color: "#64748b",
              mb: 3,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.9rem",
              borderRadius: "12px",
              px: 2,
              "&:hover": {
                color: "#1e293b",
                background: "rgba(15, 23, 42, 0.05)",
              },
            }}
          >
            {selectedProject ? "Back to Projects" : "Back to Dashboard"}
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2rem", md: "3.2rem" },
                  background: "linear-gradient(135deg, #0f172a 0%, #475569 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  mb: 1,
                }}
              >
                {selectedProject ? selectedProject.title : "Project Progress"}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.95rem", letterSpacing: 0.2 }}>
                {selectedProject
                  ? `Strategic employee progression and tactical daily insights`
                  : "Review the current project and team progress"}
              </Typography>
            </Box>

            {/* Stats pill when a project is selected */}
            {selectedProject && !overviewLoading && (
              <Box
                sx={{
                  ml: "auto",
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "Specialists", value: overviewData.length, color: "#f59e0b" },
                  { label: "Directives", value: overviewData.reduce((s, e) => s + (e.tasks?.length ?? 0), 0), color: "#38bdf8" },
                  { label: "Progress", value: `${currentTotalProgress}%`, color: "#4ade80" },
                ].map((stat, i) => (
                  <Box
                    key={i}
                    sx={{
                      background: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(12px)",
                      px: 3,
                      py: 1.5,
                      borderRadius: "16px",
                      textAlign: "center",
                      border: `1px solid ${BORDER_COLOR}`,
                      boxShadow: "0 4px 12px rgba(10, 15, 25, 0.03)",
                    }}
                  >
                    <Typography
                      sx={{
                        color: stat.color,
                        fontWeight: 900,
                        fontSize: "1.4rem",
                        lineHeight: 1.2
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography sx={{ color: "#64748b", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </motion.div>
      </Box>

      {/* ── VIEW: PROJECT LIST ── */}
      <AnimatePresence mode="wait">
        {!selectedProject && (
          <motion.div
            key="project-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
          >
            {/* Search */}
            <Box sx={{ mb: 6, maxWidth: 500, position: "relative", zIndex: 1 }}>
              <TextField
                placeholder="Search Strategic Intelligence Projects..."
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#0f172a", fontSize: 22, ml: 1 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#0f172a",
                    background: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "20px",
                    fontWeight: 600,
                    px: 1,
                    py: 0.5,
                    "& fieldset": {
                      border: `1px solid ${BORDER_COLOR}`,
                    },
                    "&:hover fieldset": { borderColor: "rgba(15, 23, 42, 0.2)" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0f172a",
                      borderWidth: "1.5px",
                    },
                  },
                }}
              />
            </Box>

            {projectsLoading ? (
              <LoadingSkeleton count={3} />
            ) : filteredProjects.length === 0 ? (
              <Box sx={{ textAlign: "center", mt: 10 }}>
                <FolderIcon sx={{ fontSize: 60, color: alpha("#0f172a", 0.1), mb: 2 }} />
                <Typography sx={{ color: "#64748b", fontWeight: 700, fontSize: "1rem" }}>
                  No active intelligence archives detected.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={4} sx={{ width: "100%" }}>
                {filteredProjects.map((project, i) => (
                  <Grid item xs={12} sm={6} md={4} key={project._id}>
                    <ProjectListCard
                      project={project}
                      index={i}
                      onSelect={handleSelectProject}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </motion.div>
        )}

        {/* ── VIEW: PROJECT DETAIL (employees + tasks + todos) ── */}
        {selectedProject && (
          <motion.div
            key="project-detail"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
          >
            {currentTotalProgress >= 100 && overviewData.length > 0 && !overviewLoading && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: "12px",
                  "& .MuiAlert-message": { width: "100%", fontWeight: 600 }
                }}
              >
                This project is 100% completed! Please remember to remove it.
              </Alert>
            )}
            {/* Project meta bar */}
            <Box
              sx={{
                background: "#fff",
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: "16px",
                p: 2,
                px: 3,
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexWrap: "wrap",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>
                  Priority Level:
                </Typography>
                <Chip
                  label={selectedProject.priority ?? "Medium"}
                  size="small"
                  sx={{
                    bgcolor: alpha(priorityColor(selectedProject.priority), 0.1),
                    color: priorityColor(selectedProject.priority),
                    fontWeight: 900,
                    borderRadius: "8px",
                    textTransform: "uppercase",
                    fontSize: "0.7rem"
                  }}
                />
              </Box>
              <Box sx={{ height: "20px", width: "1px", bgcolor: BORDER_COLOR, display: { xs: "none", md: "block" } }} />
              <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>
                Deadline:{" "}
                <Box
                  component="span"
                  sx={{ color: "#0f172a", fontWeight: 900 }}
                >
                  {selectedProject.deadline ?? "Pending Clearance"}
                </Box>
              </Typography>
              <Box sx={{ height: "20px", width: "1px", bgcolor: BORDER_COLOR, display: { xs: "none", md: "block" } }} />
              <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>
                Active Unit:{" "}
                <Box
                  component="span"
                  sx={{ color: "#0f172a", fontWeight: 900 }}
                >
                  {(selectedProject.teamMembers ?? []).length} Specialists
                </Box>
              </Typography>
            </Box>

            {/* Loading */}
            {overviewLoading && (
              <Box sx={{ mt: 4 }}>
                {[1, 2].map((i) => (
                  <PremiumCard key={i} sx={{ p: 4, mb: 4 }} hoverEffect={false}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        mb: 3,
                      }}
                    >
                      <Skeleton
                        variant="circular"
                        width={56}
                        height={56}
                        sx={{ bgcolor: "#f1f5f9" }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton
                          variant="text"
                          width="30%"
                          sx={{ bgcolor: "#f1f5f9", height: 24 }}
                        />
                        <Skeleton
                          variant="text"
                          width="50%"
                          sx={{ bgcolor: "#f1f5f9", height: 18 }}
                        />
                      </Box>
                    </Box>
                    <Skeleton
                      variant="rounded"
                      height={8}
                      sx={{ bgcolor: "#f1f5f9", borderRadius: 4, mb: 4 }}
                    />
                    <Skeleton

                      variant="rounded"
                      height={80}
                      sx={{ bgcolor: "#f1f5f9", borderRadius: "16px" }}
                    />
                  </PremiumCard>
                ))}
              </Box>
            )}

            {/* Error */}
            {overviewError && !overviewLoading && (
              <Box
                sx={{
                  background: "#fff",
                  border: `1px solid ${BORDER_COLOR}`,
                  borderRadius: "16px",
                  textAlign: "center",
                  borderColor: "rgba(244,63,94,0.2)",
                }}
              >
                <Typography sx={{ color: "#f43f5e", fontWeight: 600 }}>
                  {overviewError}
                </Typography>
              </Box>
            )}

            {/* Empty state */}
            {!overviewLoading &&
              !overviewError &&
              overviewData.length === 0 && (
                <Box sx={{ textAlign: "center", mt: 8 }}>
                  <TaskAltIcon sx={{ fontSize: 60, color: alpha("#0f172a", 0.1), mb: 2 }} />
                  <Typography
                    sx={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 800, mb: 1 }}
                  >
                    Zero intelligence stream throughput.
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>
                    Delegate operational tasks to specialists from the master control console.
                  </Typography>
                </Box>
              )}

            {/* Employee cards */}
            {!overviewLoading &&
              !overviewError &&
              overviewData.length > 0 && (
                <Grid container spacing={3}>
                  {overviewData.map((entry, i) => (
                    <Grid item xs={12} md={6} xl={4} key={entry.employee ?? i}>
                      <EmployeeCard
                        entry={entry}
                        index={i}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default HeadProjectOverview;