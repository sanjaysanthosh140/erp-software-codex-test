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
    Divider,
    TextField,
    InputAdornment,
    Skeleton,
    alpha,
    IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SearchIcon from "@mui/icons-material/Search";
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

// --- Styled Components & Theme Constants ---
const PRIMARY_BLUE = "#1e40af";
const ACCENT_TEXT = "#64748b";
const DARK_TEXT = "#1f2937";
const CARD_SHADOW = "0 4px 20px rgba(0, 0, 0, 0.05)";
const CARD_BORDER = "rgba(0, 0, 0, 0.08)";

const GlassCard = ({ children, sx = {}, hoverEffect = true, ...props }) => (
    <Card
        {...props}
        component={motion.div}
        whileHover={hoverEffect ? {
            translateY: -2,
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
        } : {}}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
            background: "#ffffff",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: "16px",
            boxShadow: CARD_SHADOW,
            color: DARK_TEXT,
            overflow: "hidden",
            ...sx,
        }}
    >
        {children}
    </Card>
);

// ─── sub-components ──────────────────────────────────────────────────────────

const TodoItem = ({ todo }) => {
    const checked = todo.status === "done" || todo.status === "completed";
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                py: 1,
                px: 1,
                borderRadius: "8px",
                "&:hover": { background: "rgba(0, 0, 0, 0.02)" },
            }}
        >
            <Box sx={{ mt: 0.2 }}>
                {checked ? (
                    <CheckCircleIcon sx={{ color: "#10b981", fontSize: 18 }} />
                ) : (
                    <RadioButtonUncheckedIcon
                        sx={{ color: "#d1d5db", fontSize: 18 }}
                    />
                )}
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography
                    sx={{
                        color: "#4b5563",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        lineHeight: 1.4,
                    }}
                >
                    {todo.title}
                </Typography>
                {todo.createdAt && (
                    <Typography sx={{ color: "#9ca3af", fontSize: "0.7rem", mt: 0.3 }}>
                        Detected: {todo.createdAt}
                    </Typography>
                )}
            </Box>
            {checked && (
                <Chip
                    label="Completed"
                    size="small"
                    sx={{
                        bgcolor: "#ecfdf5",
                        color: "#10b981",
                        fontSize: "0.7rem",
                        height: 20,
                        fontWeight: 600,
                        borderRadius: "4px"
                    }}
                />
            )}
        </Box>
    );
};

const TaskCard = ({ task }) => {
    const todos = task.todos ?? task.user_subTaks ?? [];
    const doneTodos = todos.filter(
        (t) => t.status === "done" || t.status === "completed",
    ).length;
    const todoProgress = todos.length
        ? Math.round((doneTodos / todos.length) * 100)
        : 0;

    const isCompleted = task.status?.toLowerCase() === "completed" || task.status?.toLowerCase() === "done";

    return (
        <Accordion
            disableGutters
            sx={{
                background: "#ffffff",
                border: "1px solid #f1f5f9",
                borderRadius: "12px !important",
                mb: 1.5,
                "&:before": { display: "none" },
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#94a3b8", fontSize: 20 }} />}
                sx={{ px: 2, py: 0.5 }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: "#1f2937", fontWeight: 700, fontSize: "0.95rem" }}>
                            {task.title}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5 }}>
                            <Typography sx={{ color: "#9ca3af", fontSize: "0.75rem", fontWeight: 500 }}>
                                Deadline: {task.deadline || "2026-03-25"}
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        label={task.status === "pending" ? "Pending" : "Completed"}
                        size="small"
                        sx={{
                            bgcolor: task.status === "pending" ? "#fff7ed" : "#ecfdf5",
                            color: task.status === "pending" ? "#f97316" : "#10b981",
                            elevation: 0,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 22,
                            borderRadius: "6px"
                        }}
                    />
                </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 2, pb: 2, maxHeight: { xs: "250px", sm: "350px", md: "400px" }, overflowY: "auto", "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-track": { background: "rgba(0,0,0,0.03)", borderRadius: "10px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(0,0,0,0.15)", borderRadius: "10px" } }}>
                {todos.length === 0 ? (
                    <Typography
                        sx={{
                            color: "#64748b",
                            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                            textAlign: "center",
                            py: 2,
                            fontWeight: 500,
                            fontStyle: "italic"
                        }}
                    >
                        No active directives for this task.
                    </Typography>
                ) : (
                    <Box sx={{ overflow: "auto", maxHeight: { xs: "200px", sm: "300px", md: "350px" }, borderRadius: "12px", background: "rgba(255, 255, 255, 0.5)", p: 1, "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-track": { background: "rgba(0,0,0,0.03)", borderRadius: "10px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(0,0,0,0.15)", borderRadius: "10px" } }}>
                        <Box sx={{ px: 1.5, mb: 1.5, mt: 0.5 }}>
                            <LinearProgress
                                variant="determinate"
                                value={todoProgress}
                                sx={{
                                    height: 4,
                                    borderRadius: 2,
                                    bgcolor: "rgba(15, 23, 42, 0.05)",
                                    "& .MuiLinearProgress-bar": {
                                        background: "linear-gradient(90deg, #4ade80, #38bdf8)",
                                        borderRadius: 2,
                                    },
                                }}
                            />
                        </Box>
                        <Divider sx={{ borderColor: "rgba(15, 23, 42, 0.05)", mb: 1 }} />
                        {todos.map((todo, idx) => (
                            <TodoItem key={todo._id ?? todo.todo_id ?? idx} todo={todo} />
                        ))}
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
};

const EmployeeCard = ({ entry, index }) => {
    const tasks = entry.tasks ?? [];
    const totalTodos = tasks.reduce(
        (sum, t) => sum + (t.todos ?? t.user_subTaks ?? []).length,
        0,
    );
    const doneTodos = tasks.reduce((sum, t) => {
        const td = t.todos ?? t.user_subTaks ?? [];
        return (
            sum +
            td.filter((x) => x.status === "done" || x.status === "completed").length
        );
    }, 0);
    const overallProgress = totalTodos
        ? Math.round((doneTodos / totalTodos) * 100)
        : 0;

    const initials = (entry.employee ?? "?")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return (
        <GlassCard sx={{ p: 3, mb: 3 }} hoverEffect={false}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "#1e3a8a",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                    }}
                >
                    {initials}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography sx={{ color: "#1f2937", fontWeight: 700, fontSize: "1rem" }}>
                            {entry.employee}
                        </Typography>
                        <Box sx={{ textAlign: "right" }}>
                            <Typography sx={{ color: "#10b981", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>
                                0%
                            </Typography>
                            <Typography sx={{ color: "#9ca3af", fontSize: "0.65rem", fontWeight: 600 }}>
                                Work Capacity
                            </Typography>
                        </Box>
                    </Box>
                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 500, mb: 1.5 }}>
                        {tasks.length} Operational Tasks • {totalTodos} Directives
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography sx={{ color: "#6b7280", fontSize: "0.8rem", fontWeight: 600 }}>
                                Work Progress
                            </Typography>
                            <Typography sx={{ color: "#111827", fontSize: "0.8rem", fontWeight: 700 }}>
                                {overallProgress}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={overallProgress}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: "#f1f5f9",
                                "& .MuiLinearProgress-bar": {
                                    bgcolor: "#1e3a8a",
                                    borderRadius: 3,
                                },
                            }}
                        />
                    </Box>

                    <Typography sx={{ color: "#1f2937", fontSize: "0.95rem", fontWeight: 700, mb: 2 }}>
                        Assigned Tasks
                    </Typography>

                    <Box>
                        {tasks.length === 0 ? (
                            <Typography sx={{ color: "#9ca3af", fontSize: "0.85rem", fontStyle: "italic" }}>
                                No active tasks assigned.
                            </Typography>
                        ) : (
                            tasks.map((task, ti) => (
                                <TaskCard key={task.task_id ?? task._id ?? ti} task={task} />
                            ))
                        )}
                    </Box>
                </Box>
            </Box>
        </GlassCard>
    );
};

const ProjectListCard = ({ project, index, onSelect }) => {
    const progress = getProjectProgress(project);
    const pc = priorityColor(project.priority);

    return (
        <GlassCard
            sx={{ p: 0, cursor: "pointer", height: "100%", position: "relative" }}
            onClick={() => onSelect(project)}
        >
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography
                        sx={{
                            color: "#0f172a",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            lineHeight: 1.3,
                            flex: 1,
                            pr: 2
                        }}
                    >
                        {project.title}
                    </Typography>
                    <Chip
                        label="Active"
                        size="small"
                        sx={{
                            bgcolor: "#e0f2fe",
                            color: "#0284c7",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            height: 24,
                            borderRadius: "6px"
                        }}
                    />
                </Box>

                <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600, mb: 2 }}>
                    {project.category || "IT"}
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Chip
                        label={project.priority || "High"}
                        size="small"
                        sx={{
                            bgcolor: "#fee2e2",
                            color: "#dc2626",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            height: 24,
                            px: 1,
                            borderRadius: "4px"
                        }}
                    />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>
                        Deadline
                    </Typography>
                    <Typography sx={{ color: "#1e2937", fontSize: "0.85rem", fontWeight: 700 }}>
                        2 days left
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>
                            Work Progress
                        </Typography>
                        <Typography sx={{ color: "#1e2937", fontSize: "0.85rem", fontWeight: 700 }}>
                            {progress}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 4,
                            borderRadius: 2,
                            bgcolor: "#f1f5f9",
                            "& .MuiLinearProgress-bar": {
                                bgcolor: "#cbd5e1",
                                borderRadius: 2
                            }
                        }}
                    />
                </Box>

                <Divider sx={{ mb: 2, borderColor: "#f1f5f9" }} />

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {(project.teamMembers || []).slice(0, 3).map((member, i) => (
                            <Avatar
                                key={i}
                                sx={{
                                    width: 28,
                                    height: 28,
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    border: "2px solid #fff",
                                    ml: i > 0 ? -1 : 0,
                                    bgcolor: ["#3b82f6", "#ef4444", "#10b981"][i % 3]
                                }}
                            >
                                {member.name?.[0] || "A"}
                            </Avatar>
                        ))}
                    </Box>
                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
                        {(project.teamMembers || []).length} Units
                    </Typography>
                </Box>
            </Box>
        </GlassCard>
    );
};

const LoadingSkeleton = ({ count = 3 }) => (
    <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
                <GlassCard sx={{ p: 4 }}>
                    <Skeleton
                        variant="rounded"
                        width={50}
                        height={50}
                        sx={{ bgcolor: "rgba(15, 23, 42, 0.05)", borderRadius: "16px", mb: 2 }}
                    />
                    <Skeleton
                        variant="text"
                        width="40%"
                        sx={{ bgcolor: "rgba(15, 23, 42, 0.03)", mb: 1, height: 20 }}
                    />
                    <Skeleton
                        variant="text"
                        width="80%"
                        sx={{ bgcolor: "rgba(15, 23, 42, 0.05)", mb: 0.5, height: 32 }}
                    />
                    <Skeleton
                        variant="text"
                        width="60%"
                        sx={{ bgcolor: "rgba(15, 23, 42, 0.03)", mb: 3 }}
                    />
                    <Skeleton
                        variant="rounded"
                        height={6}
                        sx={{ bgcolor: "rgba(15, 23, 42, 0.05)", borderRadius: 3 }}
                    />
                </GlassCard>
            </Grid>
        ))}
    </Grid>
);

const HRProjectProgress = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedProject, setSelectedProject] = useState(null);
    const [overviewData, setOverviewData] = useState([]);
    const [overviewLoading, setOverviewLoading] = useState(false);
    const [overviewError, setOverviewError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const role = localStorage.getItem("adminRole");
            if (!token || role !== "hr") {
                navigate("/admin");
                return;
            }

            try {
                const res = await axios.get("http://localhost:8080/admin/hr_projects_progress", {
                    headers: { Authorization: token, "Content-Type": "application/json" },
                });
                setProjects(res.data);
            } catch (err) {
                console.error("Error fetching projects:", err);
            } finally {
                setProjectsLoading(false);
            }
        };
        if (token) fetchProjects();
    }, [token]);

    const handleSelectProject = async (project) => {
        setSelectedProject(project);
        setOverviewData([]);
        setOverviewError(null);
        setOverviewLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:8080/admin/project-overview/${project._id}`,
                {
                    headers: { Authorization: token, "Content-Type": "application/json" },
                },
            );

            const rawData = res.data;
            console.log("Raw Project Overview Data:", rawData);
            const grouped = {};

            rawData.forEach((item) => {
                const empId = item.emp_datas?._id ? String(item.emp_datas._id) : null;
                const empName = item.emp_datas?.name || "Unknown Employee";

                if (!empId) return;

                if (!grouped[empId]) {
                    let empTasks = [];
                    if (Array.isArray(item.employeeTasks)) {
                        item.employeeTasks.forEach((et) => {
                            if (String(et.employee) === empId || String(et.employee?._id) === empId) {
                                if (et.tasks && typeof et.tasks === 'object' && !Array.isArray(et.tasks)) {
                                    empTasks.push({ ...et.tasks, user_subTaks: [] });
                                } else if (Array.isArray(et.tasks)) {
                                    empTasks.push(...et.tasks.map((t) => ({ ...t, user_subTaks: [] })));
                                }
                            }
                        });
                    } else if (Array.isArray(item.tasks)) {
                        empTasks = item.tasks.map((t) => ({ ...t, user_subTaks: [] }));
                    }

                    grouped[empId] = {
                        employee: empName,
                        tasks: empTasks,
                    };
                }

                const subTasks = Array.isArray(item.sub_tasks)
                    ? item.sub_tasks
                    : item.sub_tasks
                        ? [item.sub_tasks]
                        : [];

                subTasks.forEach((st) => {
                    if (!st) return;
                    const stTaskId = st.task_id?._id ? String(st.task_id._id) : String(st.task_id);

                    const taskToUpdate = grouped[empId].tasks.find(
                        (t) => String(t.task_id) === stTaskId || String(t._id) === stTaskId
                    );

                    if (taskToUpdate && Array.isArray(st.user_subTaks)) {
                        st.user_subTaks.forEach((actualTodo) => {
                            if (!actualTodo) return;
                            const actualId = actualTodo._id || actualTodo.todo_id || actualTodo.title;
                            const exists = taskToUpdate.user_subTaks.find((existing) => {
                                const existingId = existing._id || existing.todo_id || existing.title;
                                return String(existingId) === String(actualId);
                            });

                            if (!exists) {
                                taskToUpdate.user_subTaks.push(actualTodo);
                            }
                        });
                    }
                });
            });

            const formattedData = Object.values(grouped);
            console.log("Grouped Overview Data:", formattedData);
            setOverviewData(formattedData);
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
            navigate("/hr-dashboard");
        }
    };

    const filteredProjects = projects.filter(
        (p) =>
            p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <Box
            sx={{
                height: "100%",
                minHeight: "100vh",
                bgcolor: "#ffffff",
                position: "relative",
                overflowX: "hidden",
                overflowY: "auto",
                p: { xs: 2, sm: 3, md: 4 },
                pb: { xs: 6, md: 8 },
                color: "#1f2937",
            }}
        >

            {/* Header Section */}
            <Box sx={{ position: "relative", zIndex: 1, mb: selectedProject ? 4 : 6 }}>
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
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
                            "&:hover": { color: "#1e293b", background: "rgba(15, 23, 42, 0.05)" },
                        }}
                    >
                        {selectedProject ? "Back to Projects" : "Back to Dashboard"}
                    </Button>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", mb: 2 }}>
                        <Box>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: "1.5rem", md: "1.75rem" },
                                    color: "#1f2937",
                                    letterSpacing: "-0.01em",
                                    lineHeight: 1.2,
                                    mb: 0.5,
                                }}
                            >
                                {selectedProject ? selectedProject.title : "HR Project Overview"}
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.9rem" }}>
                                {selectedProject
                                    ? "Track employee progress and daily updates"
                                    : "Overview of all active projects and initiatives"}
                            </Typography>
                        </Box>

                        {selectedProject && !overviewLoading && (
                            <Box sx={{ ml: "auto", display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                                {[
                                    { label: "Specialists", value: overviewData.length, color: "#f97316", bgcolor: "#fff7ed" },
                                    { label: "Tasks", value: overviewData.reduce((s, e) => s + (e.tasks?.length ?? 0), 0), color: "#0284c7", bgcolor: "#f0f9ff" },
                                    { label: "Performance", value: `${getProjectProgress(selectedProject)}%`, color: "#10b981", bgcolor: "#f0fdf4" },
                                ].map((stat, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            bgcolor: stat.bgcolor,
                                            px: 2,
                                            py: 1,
                                            borderRadius: "8px",
                                            textAlign: "center",
                                            minWidth: 80,
                                            border: "1px solid rgba(0,0,0,0.05)"
                                        }}
                                    >
                                        <Typography sx={{ color: stat.color, fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.1 }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography sx={{ color: ACCENT_TEXT, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", mt: 0.2 }}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </motion.div>
            </Box>

            {/* Main Content */}
            <AnimatePresence mode="wait">
                {!selectedProject && (
                    <motion.div key="project-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
                        <Box sx={{ mb: 4, maxWidth: 450, position: "relative", zIndex: 1 }}>
                            <TextField
                                placeholder="Search Records.."
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        background: "#fff",
                                        borderRadius: "12px",
                                        fontSize: "0.9rem",
                                        "& fieldset": { borderColor: "#e5e7eb" },
                                        "&:hover fieldset": { borderColor: "#d1d5db" },
                                        "&.Mui-focused fieldset": { borderColor: "#94a3b8" },
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
                            Object.entries(
                                filteredProjects.reduce((acc, project) => {
                                    const departments = [
                                        "Sales",
                                        "Accounts",
                                        "Graphic Design",
                                        "Video-production",
                                        "Content-writing",
                                        "Editing",
                                        "Digital marketing",
                                        "Information Technology",
                                        "IT"
                                    ];
                                    const desc = project.description || "";
                                    let foundDept = "General";

                                    for (const dept of departments) {
                                        const escapedDept = dept.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                        const regex = new RegExp(`\\b${escapedDept}\\b`, 'i');
                                        if (regex.test(desc)) {
                                            foundDept = (dept.toLowerCase() === "it" || dept.toLowerCase() === "information technology")
                                                ? "Information Technology"
                                                : dept;
                                            break;
                                        }
                                    }

                                    if (!acc[foundDept]) acc[foundDept] = [];
                                    acc[foundDept].push(project);
                                    return acc;
                                }, {})
                            ).sort(([a], [b]) => {
                                if (a === "General") return 1;
                                if (b === "General") return -1;
                                return a.localeCompare(b);
                            }).map(([deptName, deptProjects]) => (
                                <Box key={deptName} sx={{ mb: 6 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                                        <Box sx={{ width: 4, height: 28, bgcolor: "#38bdf8", borderRadius: 1 }} />
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: "1.1rem",
                                                color: "#64748b",
                                            }}
                                        >
                                            {deptName}
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={3}>
                                        {deptProjects.map((project, i) => (
                                            <Grid item xs={12} sm={6} md={4} key={project._id || i}>
                                                <ProjectListCard project={project} index={i} onSelect={handleSelectProject} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            ))
                        )}
                    </motion.div>
                )}

                {selectedProject && (
                    <motion.div key="project-detail" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}>
                        <Box
                            sx={{
                                bgcolor: "#fff",
                                border: "1px solid #f1f5f9",
                                borderRadius: "12px",
                                p: 1.5,
                                px: 2,
                                mb: 4,
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                flexWrap: "wrap",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
                                    Priority Level:
                                </Typography>
                                <Chip
                                    label={selectedProject.priority || "High"}
                                    size="small"
                                    sx={{
                                        bgcolor: "#fee2e2",
                                        color: "#dc2626",
                                        fontWeight: 700,
                                        borderRadius: "4px",
                                        fontSize: "0.75rem",
                                        height: 22
                                    }}
                                />
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                            <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
                                Deadline: <Box component="span" sx={{ color: "#1f2937", fontWeight: 700 }}>{selectedProject.deadline || "2026-03-25"}</Box>
                            </Typography>
                            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                            <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
                                Active Unit: <Box component="span" sx={{ color: "#1f2937", fontWeight: 700 }}>{(selectedProject.teamMembers || []).length} Specialists</Box>
                            </Typography>
                        </Box>

                        {overviewLoading ? (
                            <Box sx={{ mt: 4 }}>
                                {[1, 2].map((i) => (
                                    <GlassCard key={i} sx={{ p: 4, mb: 4 }} hoverEffect={false}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                                            <Skeleton />
                                            <Box sx={{ flex: 1 }}>
                                                <Skeleton width="30%" />
                                                <Skeleton width="50%" />
                                            </Box>
                                        </Box>
                                        <Skeleton height={8} sx={{ mb: 4 }} />
                                        <Skeleton height={80} />
                                    </GlassCard>
                                ))}
                            </Box>
                        ) : overviewError ? (
                            <Box sx={{ p: 4, textAlign: "center", borderRadius: "16px", background: "rgba(244,63,94,0.05)", border: "1px solid rgba(244,63,94,0.1)" }}>
                                <Typography color="error" sx={{ fontWeight: 800 }}>{overviewError}</Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={4}>
                                {overviewData.map((entry, idx) => (
                                    <Grid item xs={12} md={12} key={idx}>
                                        <EmployeeCard entry={entry} index={idx} />
                                    </Grid>
                                ))}
                                {overviewData.length === 0 && (
                                    <Box sx={{ textAlign: "center", py: 10, width: "100%" }}>
                                        <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>Zero specialist assignments detected.</Typography>
                                    </Box>
                                )}
                            </Grid>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};

export default HRProjectProgress;