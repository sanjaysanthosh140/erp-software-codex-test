const API_URL = import.meta.env.VITE_API_URL;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Fade,
  alpha,
  CircularProgress,
  Alert,
  Button,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  Select,
  Avatar,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FolderIcon from "@mui/icons-material/Folder";
import AssessmentIcon from "@mui/icons-material/Assessment";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import TeamChat from "../../components/TeamChat";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

// Components
import GlassCard from "./components/GlassCard";
import StatCards from "./components/StatCards";
import EmployeeManager from "./components/EmployeeManager";
import DepartmentManager from "./components/DepartmentManager";
import ReportManager from "./components/ReportManager";
import AttendanceManager from "./components/AttendanceManager";
import DashboardDialogs from "./components/DashboardDialogs";
import ProductionActivityLogger from "./ProductionActivityLogger";
import HeadReportForm from "../../components/dashboard/HeadReportForm";

// Styles & Constants
import {
  PRIMARY_BG,
  SECONDARY_BG,
  DEPARTMENTS,
  POSTS,
  normalizeDeptName,
  getDeptColor,
} from "./components/SharedStyles";

const toLocalISO = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const headTaskAssignerFromJwt = (role) => {
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) return { assignedByRole: role, assignedByName: undefined };
    const payload = JSON.parse(atob(token.split(".")[1]));
    const name = payload.name || payload.email;
    return { assignedByRole: role, assignedByName: name || undefined };
  } catch {
    return { assignedByRole: role, assignedByName: undefined };
  }
};

const headTaskSourceChipLabel = (task) => {
  if (task.admin === "ceo") return "From: CEO";
  if (task.admin === "hr") return "From: HR";

  const r = (task.assignedByRole || "").toLowerCase();
  if (r === "ceo" || r === "admin" || r === "superadmin") {
    return task.assignedByName
      ? `From: CEO · ${task.assignedByName}`
      : "From: CEO / Management";
  }
  if (r === "hr") {
    return task.assignedByName
      ? `From: HR · ${task.assignedByName}`
      : "From: HR";
  }
  return "From: HR (legacy)";
};

// --- DM Projects Helpers ---
const HR_HYBRID_DEPTS = [
  "Content Writing",
  "Video Production",
  "Editing",
  "Graphic Design",
  "DM",
];

const HRDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole") || "";
    if (!token || role.toLowerCase() !== "hr") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin");
  };

  // Tab State
  const [tabValue, setTabValue] = useState(0);

  // Data State
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openDeptDialog, setOpenDeptDialog] = useState(false);
  const [openResponsibleDialog, setOpenResponsibleDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  // Selection/Editing States
  const [userToDelete, setUserToDelete] = useState(null);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [userForPassword, setUserForPassword] = useState(null);
  const [editingDept, setEditingDept] = useState(null);

  const [projectsCount, setProjectsCount] = useState(0);
  const [dmProjects, setDmProjects] = useState([]);

  // Form States
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
    active: true,
  });
  const [responsibleForm, setResponsibleForm] = useState({
    name: "",
    email: "",
    post: "",
    department: "",
    password: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    email: "",
    newPassword: "",
    accountType: "employee", // "employee" or "admin"
  });
  const [deptForm, setDeptForm] = useState({
    id: "",
    title: "",
    color: "#ffff",
    description: "",
  });
  const [headTaskForm, setHeadTaskForm] = useState({
    headId: "",
    task: "",
    priority: "Medium",
    assignedDate: toLocalISO(new Date()),
    deadline: "",
  });
  const [headTasks, setHeadTasks] = useState([]);
  const [editingHeadTask, setEditingHeadTask] = useState(null);

  // Filter & Alert States
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [reportDate, setReportDate] = useState("");
  const [reportDeptFilter, setReportDeptFilter] = useState("ALL");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceDeptFilter, setAttendanceDeptFilter] = useState("ALL");

  const currentAdminProfile = (() => {
    const storedName = localStorage.getItem("adminName") || "HR";
    const storedId = localStorage.getItem("adminId") || "";
    const token = localStorage.getItem("adminToken");

    if (!token) {
      return { name: storedName, _id: storedId, id: storedId };
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload.id || payload._id || storedId;
      return {
        name: payload.name || payload.email || storedName,
        _id: id,
        id,
      };
    } catch {
      return { name: storedName, _id: storedId, id: storedId };
    }
  })();

  // --- Initial Data Fetch ---
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("adminToken");
      const role = localStorage.getItem("adminRole");
      console.log(token, role);
      if (!token || role !== "hr") {
        navigate("/admin");
        return;
      }

      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchAdmins(),
        fetchDepartments(),
        fetchReports(),
        fetchLogs(),
        fetchProjects(),
        fetchHeadTasks(),
        fetchDmProjects(),
        fetchEmployees(),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (tabValue !== 6) return;
    fetchHeadTasks();
    const intervalId = setInterval(() => {
      fetchHeadTasks();
    }, 10000);
    return () => clearInterval(intervalId);
  }, [tabValue]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects/get_projects`);
      setProjectsCount(res.data.length);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/employeelists`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("adminToken")
        },
      });
      console.log("users",res.data)
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/get_admins`);
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/departments`);
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/reports`);
      setReports(res.data);
      console.log("reports from hr_dash", res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_URL}/admin/employe_log`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
      console.log(res);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  const fetchHeadTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/hr_assigned_tasks`);
      setHeadTasks(res.data || []);
      console.log("Head tasks:", res.data);
    } catch (err) {
      console.error("Error fetching head tasks:", err);
    }
  };

  const fetchDmProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/simple_custom_projects`);
      setDmProjects(res.data || []);
    } catch (err) {
      console.error("Error fetching DM projects:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employeelists`, {
        headers: {
          Authorization: localStorage.getItem("adminToken"),
        },
      });
      console.log("employee data for tasks", res.data);
      setEmployees(res.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };
  // --- Handlers ---
  const handleTabChange = (e, newValue) => {
    if (newValue === 4) {
      navigate("/hr/project-progress");
      return;
    }
    setTabValue(newValue);
  };

  const handleUserDialogOpen = (user = null) => {
    setEditingUser(user);
    setUserForm(
      user
        ? { ...user }
        : { name: "", email: "", department: "", password: "", active: true },
    );
    setOpenUserDialog(true);
  };

  const handlePasswordDialogOpen = (user, type = "employee") => {
    setUserForPassword(user);
    setPasswordForm({
      email: user.email,
      newPassword: "",
      accountType: type,
    });
    setOpenPasswordDialog(true);
  };

  const handleAdminDialogOpen = (admin = null) => {
    setEditingAdmin(admin);
    setResponsibleForm(
      admin
        ? { ...admin, post: admin.role || "" }
        : { name: "", email: "", post: "", department: "", password: "" },
    );
    setOpenResponsibleDialog(true);
  };

  //  user submit
  const handleUserSubmit = async () => {
    try {
      if (editingUser) {
        const { password, ...updateData } = userForm;
        await axios.put(
          `${API_URL}/admin/updateEmploye/${editingUser._id}`,
          updateData,
        );
      } else {
        await axios.post(`${API_URL}/admin/employes`, userForm);
        setAlertMessage(`User ${userForm.name} added successfully`);
        setAlertOpen(true);
      }
      fetchUsers();
      setOpenUserDialog(false);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      if (passwordForm.accountType === "admin") {
        await axios.put(`${API_URL}/admin/updatePassword_admin`, passwordForm);
      } else {
        await axios.post(`${API_URL}/admin/updatePassword`, passwordForm);
      }
      setAlertMessage(`Password updated for ${passwordForm.email}`);
      setAlertOpen(true);
      setOpenPasswordDialog(false);
    } catch (err) {
      console.error("Error updating password:", err);
    }
  };

  const handleResponsibleSubmit = async () => {
    try {
      const payload = {
        ...responsibleForm,
        role: responsibleForm.post,
        active: true,
      };
      delete payload.post;
      if (editingAdmin) {
        await axios.put(
          `${API_URL}/admin/update_admin/${editingAdmin._id}`,
          payload,
        );
        setAlertMessage(
          `Head User ${responsibleForm.name} updated successfully`,
        );
      } else {
        await axios.post(`${API_URL}/admin/add_admins`, payload);
        setAlertMessage(`Head User ${responsibleForm.name} added successfully`);
      }
      setAlertOpen(true);
      fetchAdmins();
      setOpenResponsibleDialog(false);
      setResponsibleForm({
        name: "",
        email: "",
        post: "",
        department: "",
        password: "",
      });
    } catch (err) {
      console.error("Error adding responsible:", err);
    }
  };

  const handleDeptSubmit = async () => {
    try {
      const payload = { ...deptForm, color: deptForm.color || "#ffff" };
      if (editingDept) {
        await axios.put(
          `${API_URL}/admin/Editdepartments/${editingDept._id}`,
          payload,
        );
      } else {
        await axios.post(`${API_URL}/admin/addDep`, payload);
      }
      fetchDepartments();
      setOpenDeptDialog(false);
    } catch (err) {
      console.error("Error saving department:", err);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(`${API_URL}/admin/deleteEmp/${userToDelete._id}`);
      setUsers(users.filter((u) => u._id !== userToDelete._id));
      setAlertMessage(`User deleted successfully`);
      setAlertOpen(true);
      setTimeout(() => setAlertOpen(false), 3000);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
    setOpenDeleteDialog(false);
  };

  const confirmDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      let id = adminToDelete._id;
      await axios.delete(`${API_URL}/admin/delete_admin/${id}`);
      fetchAdmins();
      setAlertMessage(`Head User deleted successfully`);
      setAlertOpen(true);
      setTimeout(() => setAlertOpen(false), 3000);
    } catch (err) {
      console.error("Error deleting admin:", err);
    }
    setOpenDeleteDialog(false);
  };

  const handleDeleteDept = async (deptId) => {
    try {
      await axios.delete(`${API_URL}/admin/deleteDept/${deptId}`);
      fetchDepartments();
    } catch (err) {
      console.error("Error deleting dept:", err);
    }
  };

  const resetHeadTaskForm = () => {
    setHeadTaskForm({
      headId: "",
      task: "",
      priority: "Medium",
      assignedDate: toLocalISO(new Date()),
      deadline: "",
    });
    setEditingHeadTask(null);
  };

  const handleHeadTaskSubmit = async () => {
    if (!headTaskForm.headId || !headTaskForm.task || !headTaskForm.deadline)
      return;
    const payload = {
      headId: headTaskForm.headId,
      admin: localStorage.getItem("adminRole"),
      title: headTaskForm.task,
      priority: headTaskForm.priority,
      assignedDate: headTaskForm.assignedDate,
      deadline: headTaskForm.deadline,
      ...(editingHeadTask ? {} : headTaskAssignerFromJwt("hr")),
    };
    try {
      if (editingHeadTask) {
        await axios.put(
          `${API_URL}/admin/hr_assigned_tasks/${editingHeadTask._id}`,
          payload,
        );
        setAlertMessage("Head task updated successfully");
      } else {
        await axios.post(`${API_URL}/admin/hr_assigned_tasks`, payload);
        setAlertMessage("Head task created successfully");
      }
      setAlertOpen(true);
      resetHeadTaskForm();
      fetchHeadTasks();
    } catch (err) {
      console.error("Error saving head task:", err);
    }
  };

  const handleEditHeadTask = (task) => {
    setEditingHeadTask(task);
    setHeadTaskForm({
      headId: task.headId || "",
      task: task.title || task.task || "",
      priority: task.priority || "Medium",
      assignedDate: task.assignedDate
        ? toLocalISO(task.assignedDate)
        : toLocalISO(new Date()),
      deadline: task.deadline ? toLocalISO(task.deadline) : "",
    });
  };

  const handleDeleteHeadTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/admin/hr_assigned_tasks/${taskId}`);
      setAlertMessage("Head task deleted successfully");
      setAlertOpen(true);
      fetchHeadTasks();
    } catch (err) {
      console.error("Error deleting head task:", err);
    }
  };

  const handleUpdateTaskStatus = async (task, newStatus) => {
    try {
      await axios.put(`${API_URL}/admin/hr_assigned_tasks/${task._id}`, {
        ...task,
        status: newStatus,
      });
      setAlertMessage("Task status updated successfully");
      setAlertOpen(true);
      fetchHeadTasks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // --- Stats Calculation ---
  const today = toLocalISO(new Date());
  const uniqueSubmittersToday = new Set(
    reports
      .filter((r) => {
        try {
          return toLocalISO(r.date) === today;
        } catch (e) {
          return false;
        }
      })
      .map((r) => r.author || r.userId || r.userName),
  );

  const pendingReportsCount = Math.max(
    0,
    users.length - uniqueSubmittersToday.size,
  );

  const stats = [
    {
      title: "Total Employees",
      value: users.length,
      icon: PeopleIcon,
      color: "#fff",
    },
    { title: "Active Now", value: 0, icon: CheckCircleIcon, color: "#fff" },
    {
      title: "Departments",
      value: departments.length,
      icon: FolderIcon,
      color: "#fff",
    },
    {
      title: "Active Projects",
      value: projectsCount,
      icon: AssessmentIcon,
      color: "#fff",
    },
  ];

  const formatDepartment = (dept) => {
    if (!dept) return "";
    if (typeof dept === "string") return dept;
    return (
      dept.title || dept.name || dept.department || dept.departmentName || ""
    );
  };

  const normalizedDepartmentOptions = Array.from(
    new Set(
      departments.map(formatDepartment).filter(Boolean).map(normalizeDeptName),
    ),
  );

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: PRIMARY_BG,
        }}
      >
        <CircularProgress sx={{ color: "#38bdf8" }} />
      </Box>
    );
  }

  if (tabValue === 8) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${PRIMARY_BG} 0%, ${SECONDARY_BG} 100%)`,
          p: { xs: 1, md: 2 },
          pb: 4,
          color: "#0f172a",
        }}
      >
        <ProductionActivityLogger onBack={() => setTabValue(0)} />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${PRIMARY_BG} 0%, ${SECONDARY_BG} 100%)`,
          p: { xs: 1, md: 2 },
          pb: 4,
          color: "#0f172a",
        }}
      >
        {/* Header Section */}
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              mb: 1,
              pl: 1,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: "#1f2937",
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  mb: 0.5,
                }}
              >
                HR Workspace
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#64748b", fontWeight: 600 }}
              >
                Management Dashboard
              </Typography>
            </Box>

            {/* Logout Button */}
            <Box
              component="button"
              onClick={handleLogout}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.4 },
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(15, 23, 42, 0.12)",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                color: "#475569",
                fontWeight: 800,
                fontSize: { xs: "0.78rem", sm: "0.88rem" },
                cursor: "pointer",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                flexShrink: 0,
                mt: { xs: 0.5, sm: 0 },
                "&:hover": {
                  background: "#ffffff",
                  color: "#0f172a",
                  borderColor: "rgba(15, 23, 42, 0.2)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
                },
              }}
            >
              <svg
                width="15"
                height="15"
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
              Logout
            </Box>
          </Box>
        </Fade>

        {/* Top Stats Section */}
        <StatCards stats={stats} />

        {/* Main Feature Area */}
        <GlassCard
          sx={{
            minHeight: "60vh",
            borderRadius: "32px",
            display: "flex",
            flexDirection: "column",
            // Keep tab content comfortable when there is lots of data
            maxHeight: { xs: "calc(100vh - 250px)", md: "calc(100vh - 230px)" },
          }}
        >
          {/* Navigation Tabs */}
          <Box
            sx={{
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              background: "rgba(255,255,255,0.4)",
              px: 2,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  color: "rgba(0,0,0,0.4)",
                  minHeight: 64,
                  transition: "all 0.3s ease",
                  "&.Mui-selected": { color: "#38bdf8" },
                },
                "& .MuiTabs-indicator": {
                  height: 4,
                  borderRadius: "2px",
                  background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                },
              }}
            >
              <Tab label="Employees" />
              <Tab label="Departments" />
              <Tab label="Work Reports" />
              <Tab label="Attendance" />
              <Tab label="Project Progress" />
              <Tab label="Heads" />
              <Tab label="Head Tasks" />
              <Tab label="DM Projects" />
              <Tab label="Floor" />
            </Tabs>
          </Box>

          {/* Content Area (scrolls top-to-bottom) */}
          <Box
            sx={{
              p: { xs: 1, md: 2 },
              flex: 1,
              minHeight: 0, // important for flex scrolling containers
              overflowY: "auto",
              overflowX: "hidden",
              pb: { xs: 2, md: 4 },
              "&::-webkit-scrollbar": { width: 8 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#cbd5e1",
                borderRadius: 6,
              },
            }}
          >
            <AnimatePresence mode="wait">
              {tabValue === 0 && (
                <EmployeeManager
                  key="employees"
                  users={users}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  departmentFilter={departmentFilter}
                  setDepartmentFilter={setDepartmentFilter}
                  departmentsList={departments}
                  onAddEmployee={() => handleUserDialogOpen()}
                  onAddHead={() => {
                    setResponsibleForm({
                      name: "",
                      email: "",
                      post: "",
                      department: "",
                      password: "",
                    });
                    setOpenResponsibleDialog(true);
                  }}
                  onEditUser={handleUserDialogOpen}
                  onEditPassword={(user) =>
                    handlePasswordDialogOpen(user, "employee")
                  }
                  onDeleteUser={(user) => {
                    setUserToDelete(user);
                    setAdminToDelete(null);
                    setOpenDeleteDialog(true);
                  }}
                />
              )}
              {tabValue === 5 && (
                <EmployeeManager
                  key="responsibles"
                  users={admins}
                  isAdminView={true}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  departmentFilter={departmentFilter}
                  setDepartmentFilter={setDepartmentFilter}
                  departmentsList={POSTS}
                  onAddEmployee={() => handleUserDialogOpen()}
                  onAddHead={() => handleAdminDialogOpen()}
                  onEditUser={handleAdminDialogOpen}
                  onEditPassword={(admin) =>
                    handlePasswordDialogOpen(admin, "admin")
                  }
                  onDeleteUser={(admin) => {
                    setAdminToDelete(admin);
                    setUserToDelete(null);
                    setOpenDeleteDialog(true);
                  }}
                />
              )}
              {tabValue === 1 && (
                <DepartmentManager
                  key="depts"
                  departments={departments}
                  onAddDepartment={() => {
                    setEditingDept(null);
                    setDeptForm({
                      id: "",
                      title: "",
                      color: "#ffff",
                      description: "",
                    });
                    setOpenDeptDialog(true);
                  }}
                  onEditDepartment={(dept) => {
                    setEditingDept(dept);
                    setDeptForm({ ...dept });
                    setOpenDeptDialog(true);
                  }}
                  onDeleteDepartment={handleDeleteDept}
                  getDeptColor={getDeptColor}
                />
              )}
              {tabValue === 2 && (
                <Box key="reports">
                  <ReportManager
                    reports={reports}
                    users={users}
                    departments={departments}
                    reportDate={reportDate}
                    setReportDate={setReportDate}
                    reportDeptFilter={reportDeptFilter}
                    setReportDeptFilter={setReportDeptFilter}
                    normalizedDepartmentOptions={normalizedDepartmentOptions}
                    getDeptColor={getDeptColor}
                    normalizeDeptName={normalizeDeptName}
                  />
                  <Box sx={{ mt: 3 }}>
                    <HeadReportForm profile={currentAdminProfile} />
                  </Box>
                </Box>
              )}
              {tabValue === 3 && (
                <AttendanceManager
                  key="attendance"
                  logs={logs}
                  attendanceDate={attendanceDate}
                  setAttendanceDate={setAttendanceDate}
                  attendanceDeptFilter={attendanceDeptFilter}
                  setAttendanceDeptFilter={setAttendanceDeptFilter}
                  normalizedDepartmentOptions={normalizedDepartmentOptions}
                  getDeptColor={getDeptColor}
                  normalizeDeptName={normalizeDeptName}
                />
              )}
              {tabValue === 6 && (
                <Box
                  key="head-tasks"
                  component={motion.div}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Strategic Task Assignment Form */}
                  <Box
                    sx={{
                      mb: 5,
                      p: { xs: 3, md: 4 },
                      borderRadius: "24px",
                      background: "#ffffff",
                      border: "1px solid rgba(0,0,0,0.06)",
                      boxShadow: "0 4px 30px rgba(0,0,0,0.02)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "4px",
                        height: "100%",
                        background:
                          "linear-gradient(to bottom, #38bdf8, #818cf8)",
                      }}
                    />

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        mb: 4,
                        color: "#0f172a",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "8px",
                          background: "rgba(56, 189, 248, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <AssignmentIcon
                          sx={{ color: "#38bdf8", fontSize: 20 }}
                        />
                      </Box>
                      {editingHeadTask
                        ? "Update Strategic Directive"
                        : "New Strategic Directive"}
                    </Typography>

                    <Box sx={{ width: "100%", maxWidth: "1000px", mt: 1 }}>
                      <Grid container spacing={3}>
                        {/* Field 1: Responsible Head */}
                        <Grid item xs={12} md={8}>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.75rem",
                              color: "#64748b",
                              mb: 1,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            Select Head
                          </Typography>
                          <TextField
                            select
                            fullWidth
                            value={headTaskForm.headId}
                            onChange={(e) =>
                              setHeadTaskForm((prev) => ({
                                ...prev,
                                headId: e.target.value,
                              }))
                            }
                            sx={{
                              "& .MuiInputBase-input": {
                                color: "#0f172a",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                py: 1.5,
                              },
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                                borderRadius: "12px",
                                "& fieldset": { borderColor: "#e2e8f0" },
                                "&:hover fieldset": { borderColor: "#cbd5e1" },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#38bdf8",
                                },
                              },
                            }}
                          >
                            {employees.map((employee) => (
                              <MenuItem
                                key={employee._id}
                                value={employee._id}
                                sx={{ fontWeight: 600, py: 1.5 }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: "0.95rem",
                                    }}
                                  >
                                    {employee.name}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "0.75rem",
                                      color: "#64748b",
                                    }}
                                  >
                                    {employee.department ||
                                      employee.post ||
                                      "Employee"}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>

                        {/* Field 2: Priority */}
                        <Grid item xs={12} md={4}>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.75rem",
                              color: "#64748b",
                              mb: 1,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            Priority
                          </Typography>
                          <TextField
                            select
                            fullWidth
                            value={headTaskForm.priority}
                            onChange={(e) =>
                              setHeadTaskForm((prev) => ({
                                ...prev,
                                priority: e.target.value,
                              }))
                            }
                            sx={{
                              "& .MuiInputBase-input": {
                                color: "#0f172a",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                py: 1.5,
                              },
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                                borderRadius: "12px",
                                "& fieldset": { borderColor: "#e2e8f0" },
                                "&:hover fieldset": { borderColor: "#cbd5e1" },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#38bdf8",
                                },
                              },
                            }}
                          >
                            <MenuItem value="Low" sx={{ fontWeight: 600 }}>
                              Low
                            </MenuItem>
                            <MenuItem value="Medium" sx={{ fontWeight: 600 }}>
                              Medium
                            </MenuItem>
                            <MenuItem value="High" sx={{ fontWeight: 600 }}>
                              High
                            </MenuItem>
                            <MenuItem
                              value="Critical"
                              sx={{ fontWeight: 600, color: "#ef4444" }}
                            >
                              Critical
                            </MenuItem>
                          </TextField>
                        </Grid>

                        {/* Field 3: Task Details */}
                        <Grid item xs={12}>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.75rem",
                              color: "#64748b",
                              mb: 1,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            Task Description
                          </Typography>
                          <TextField
                            multiline
                            minRows={3}
                            fullWidth
                            placeholder="Detailed directive for the department..."
                            value={headTaskForm.task}
                            onChange={(e) =>
                              setHeadTaskForm((prev) => ({
                                ...prev,
                                task: e.target.value,
                              }))
                            }
                            sx={{
                              "& .MuiInputBase-input": {
                                color: "#0f172a",
                                fontSize: "0.95rem",
                                lineHeight: 1.6,
                              },
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                                borderRadius: "12px",
                                "& fieldset": { borderColor: "#e2e8f0" },
                                "&:hover fieldset": { borderColor: "#cbd5e1" },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#38bdf8",
                                },
                              },
                            }}
                          />
                        </Grid>

                        {/* Field 4: Commencement Date */}
                        <Grid item xs={12} md={6}>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.75rem",
                              color: "#64748b",
                              mb: 1,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            posting date
                          </Typography>
                          <TextField
                            type="date"
                            fullWidth
                            value={headTaskForm.assignedDate}
                            onChange={(e) =>
                              setHeadTaskForm((prev) => ({
                                ...prev,
                                assignedDate: e.target.value,
                              }))
                            }
                            sx={{
                              "& .MuiInputBase-input": {
                                color: "#0f172a",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                py: 1.5,
                              },
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                                borderRadius: "12px",
                                "& fieldset": { borderColor: "#e2e8f0" },
                                "&:hover fieldset": { borderColor: "#cbd5e1" },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#38bdf8",
                                },
                              },
                            }}
                          />
                        </Grid>

                        {/* Field 5: Target Deadline */}
                        <Grid item xs={12} md={6}>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.75rem",
                              color: "#64748b",
                              mb: 1,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            deadline
                          </Typography>
                          <TextField
                            type="date"
                            fullWidth
                            value={headTaskForm.deadline}
                            onChange={(e) =>
                              setHeadTaskForm((prev) => ({
                                ...prev,
                                deadline: e.target.value,
                              }))
                            }
                            sx={{
                              "& .MuiInputBase-input": {
                                color: "#0f172a",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                py: 1.5,
                              },
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                                borderRadius: "12px",
                                "& fieldset": { borderColor: "#e2e8f0" },
                                "&:hover fieldset": { borderColor: "#cbd5e1" },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#38bdf8",
                                },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 4,
                        gap: 2,
                      }}
                    >
                      {editingHeadTask && (
                        <Button
                          variant="outlined"
                          onClick={resetHeadTaskForm}
                          sx={{
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: 700,
                            px: 3,
                            py: 1,
                            borderColor: "#cbd5e1",
                            color: "#64748b",
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        onClick={handleHeadTaskSubmit}
                        disabled={
                          !headTaskForm.headId ||
                          !headTaskForm.task ||
                          !headTaskForm.deadline
                        }
                        sx={{
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: 700,
                          px: 4,
                          py: 1,
                          color: "#ffffff",
                          background:
                            "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                          "&:hover": { background: "#000", color: "#fff" },
                        }}
                      >
                        {editingHeadTask ? "Save Changes" : "Deploy Directive"}
                      </Button>
                    </Box>
                  </Box>

                  {/* Active Directives List */}
                  <Box
                    sx={{
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: "#0f172a" }}
                    >
                      Active Strategic Directives
                    </Typography>
                    <Chip
                      label={`${headTasks.length} Total`}
                      sx={{
                        fontWeight: 800,
                        bgcolor: "#f1f5f9",
                        color: "#475569",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>

                  <Box sx={{ maxHeight: "none", overflowY: "visible", pr: 0 }}>
                    <Grid container spacing={3}>
                      {headTasks.map((task) => {
                        const selectedHead =
                          employees.find((e) => e._id === task.headId) ||
                          admins.find((a) => a._id === task.headId);
                        const headTitle =
                          selectedHead?.name ||
                          task.headName ||
                          task.head ||
                          "Unknown";
                        const headDepartment =
                          selectedHead?.department ||
                          selectedHead?.post ||
                          task.department ||
                          "Operations";
                        const isCompleted = task.status === "completed";
                        return (
                          <Grid item xs={12} md={6} key={task._id}>
                            <Card
                              sx={{
                                borderRadius: "20px",
                                background: "#ffffff",
                                border: "1px solid rgba(148, 163, 184, 0.2)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                position: "relative",
                                overflow: "visible",
                              }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    mb: 2,
                                  }}
                                >
                                  <Box sx={{ flex: 1, pr: 2 }}>
                                    <Typography
                                      sx={{
                                        fontWeight: 800,
                                        color: "#0f172a",
                                        fontSize: "1.1rem",
                                        mb: 0.5,
                                        lineHeight: 1.3,
                                      }}
                                    >
                                      {task.title || task.task}
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 20,
                                          height: 20,
                                          fontSize: "0.7rem",
                                          bgcolor: "#e0f2fe",
                                          color: "#0369a1",
                                        }}
                                      >
                                        {headTitle?.[0] || "H"}
                                      </Avatar>
                                      <Typography
                                        sx={{
                                          color: "#64748b",
                                          fontSize: "0.8rem",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {headTitle} · {headDepartment}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Stack direction="row" spacing={0.5}>
                                    {task.admin !== "ceo" && (
                                      <>
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleEditHeadTask(task)
                                          }
                                          sx={{
                                            color: "#64748b",
                                            "&:hover": {
                                              color: "#3b82f6",
                                              bgcolor:
                                                "rgba(59, 130, 246, 0.05)",
                                            },
                                          }}
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleDeleteHeadTask(task._id)
                                          }
                                          sx={{
                                            color: "#64748b",
                                            "&:hover": {
                                              color: "#ef4444",
                                              bgcolor:
                                                "rgba(239, 68, 68, 0.05)",
                                            },
                                          }}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </>
                                    )}
                                  </Stack>
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    mb: 3,
                                  }}
                                >
                                  <Chip
                                    label={headTaskSourceChipLabel(task)}
                                    size="small"
                                    sx={{
                                      fontWeight: 800,
                                      fontSize: "0.65rem",
                                      bgcolor: "#f1f5f9",
                                      color: "#475569",
                                      borderRadius: "6px",
                                    }}
                                  />
                                  <Chip
                                    label={task.priority || "Medium"}
                                    size="small"
                                    sx={{
                                      fontWeight: 800,
                                      fontSize: "0.65rem",
                                      textTransform: "uppercase",
                                      bgcolor: (() => {
                                        const p = (
                                          task.priority || "Medium"
                                        ).toLowerCase();
                                        if (p === "critical" || p === "high")
                                          return "#fee2e2";
                                        if (p === "medium") return "#fef3c7";
                                        return "#f0fdf4";
                                      })(),
                                      color: (() => {
                                        const p = (
                                          task.priority || "Medium"
                                        ).toLowerCase();
                                        if (p === "critical" || p === "high")
                                          return "#991b1b";
                                        if (p === "medium") return "#92400e";
                                        return "#166534";
                                      })(),
                                      borderRadius: "6px",
                                    }}
                                  />
                                  <Chip
                                    icon={
                                      <AccessTimeIcon
                                        sx={{ fontSize: "14px !important" }}
                                      />
                                    }
                                    label={`Due: ${
                                      task.deadline
                                        ? new Date(
                                            task.deadline,
                                          ).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                          })
                                        : "-"
                                    }`}
                                    size="small"
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: "0.75rem",
                                      bgcolor: "#f8fafc",
                                      color: "#475569",
                                      borderRadius: "6px",
                                    }}
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    pt: 2,
                                    borderTop: "1px dashed #e2e8f0",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "0.75rem",
                                      color: "#94a3b8",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Status
                                  </Typography>
                                  <Select
                                    size="small"
                                    value={task.status || "pending"}
                                    onChange={(e) =>
                                      handleUpdateTaskStatus(
                                        task,
                                        e.target.value,
                                      )
                                    }
                                    sx={{
                                      height: 32,
                                      minWidth: 120,
                                      fontSize: "0.8rem",
                                      color: "#111827",
                                      backgroundColor:
                                        !task.status ||
                                        task.status === "pending"
                                          ? "#f8fafc"
                                          : task.status === "completed"
                                          ? "#ecfdf5"
                                          : "#eff6ff",
                                      fontWeight: 800,
                                      borderRadius: "10px",
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        border: "1px solid #e2e8f0",
                                      },
                                      "&:hover .MuiOutlinedInput-notchedOutline":
                                        { border: "1px solid #cbd5e1" },
                                      "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        { border: "1px solid #38bdf8" },
                                    }}
                                  >
                                    <MenuItem
                                      value="pending"
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "0.85rem",
                                      }}
                                    >
                                      ⏳ Pending
                                    </MenuItem>
                                    <MenuItem
                                      value="in_progress"
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "0.85rem",
                                      }}
                                    >
                                      ⚙️ In Progress
                                    </MenuItem>
                                    <MenuItem
                                      value="completed"
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "0.85rem",
                                      }}
                                    >
                                      ✅ Completed
                                    </MenuItem>
                                  </Select>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </Box>
              )}

              {tabValue === 7 && (
                <Box
                  key="dm-projects"
                  component={motion.div}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900, color: "#0f172a" }}
                    >
                      DM Projects
                    </Typography>
                    <Chip
                      label={`${dmProjects.length} Projects`}
                      sx={{
                        fontWeight: 800,
                        bgcolor: "#f1f5f9",
                        color: "#475569",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>

                  {dmProjects.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>
                        No DM projects found.
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {dmProjects.map((project) => (
                        <Grid item xs={12} sm={6} md={4} key={project._id}>
                          <Card
                            onClick={() =>
                              navigate(`/head/custom-projects/${project._id}`)
                            }
                            sx={{
                              borderRadius: "20px",
                              background: "#ffffff",
                              border: "1px solid rgba(148,163,184,0.2)",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                              cursor: "pointer",
                              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  justifyContent: "space-between",
                                  mb: 1.5,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: 800,
                                    color: "#0f172a",
                                    fontSize: "1rem",
                                    flex: 1,
                                    pr: 1,
                                  }}
                                >
                                  {project.projectTilte ||
                                    project.projectTitle ||
                                    "Untitled Project"}
                                </Typography>
                                <Chip
                                  label={`${
                                    (project.tasks || []).length
                                  } tasks`}
                                  size="small"
                                  sx={{
                                    fontWeight: 800,
                                    bgcolor: "#e0f2fe",
                                    color: "#0369a1",
                                    borderRadius: "8px",
                                    flexShrink: 0,
                                  }}
                                />
                              </Box>
                              <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{ flexWrap: "wrap", gap: 0.5 }}
                              >
                                {(project.departments || []).map((d) => (
                                  <Chip
                                    key={d.departmentId}
                                    label={d.departmentName}
                                    size="small"
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: "0.65rem",
                                      bgcolor: "#f8fafc",
                                      color: "#475569",
                                      borderRadius: "6px",
                                      border: "1px solid #e2e8f0",
                                    }}
                                  />
                                ))}
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}
            </AnimatePresence>
          </Box>
        </GlassCard>

        {/* Global Dialogs */}
        <DashboardDialogs
          openUserDialog={openUserDialog}
          handleUserDialogClose={() => setOpenUserDialog(false)}
          editingUser={editingUser}
          userForm={userForm}
          setUserForm={setUserForm}
          handleUserSubmit={handleUserSubmit}
          DEPARTMENTS={departments}
          openResponsibleDialog={openResponsibleDialog}
          handleResponsibleDialogClose={() => setOpenResponsibleDialog(false)}
          responsibleForm={responsibleForm}
          setResponsibleForm={setResponsibleForm}
          handleResponsibleSubmit={handleResponsibleSubmit}
          POSTS={POSTS}
          openDeptDialog={openDeptDialog}
          handleDeptDialogClose={() => setOpenDeptDialog(false)}
          editingDept={editingDept}
          deptForm={deptForm}
          setDeptForm={setDeptForm}
          handleDeptSubmit={handleDeptSubmit}
          openDeleteDialog={openDeleteDialog}
          cancelDeleteUser={() => setOpenDeleteDialog(false)}
          userToDelete={userToDelete || adminToDelete}
          confirmDeleteUser={
            adminToDelete ? confirmDeleteAdmin : confirmDeleteUser
          }
          openPasswordDialog={openPasswordDialog}
          handlePasswordDialogClose={() => setOpenPasswordDialog(false)}
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          handlePasswordSubmit={handlePasswordSubmit}
        />

        {/* Snackbar Alert */}
        {alertOpen && (
          <Alert
            severity="success"
            onClose={() => setAlertOpen(false)}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 9999,
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            {alertMessage}
          </Alert>
        )}
      </Box>

      {/* Floating TeamChat Bubble */}
      <TeamChat />
    </>
  );
};

export default HRDashboard;
