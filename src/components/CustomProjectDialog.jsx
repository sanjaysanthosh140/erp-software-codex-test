import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
  DialogActions,
  Tooltip,
  Menu,
  MenuItem
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import axios from "axios";

const ACCENT = "#0f766e";
const DIALOG_BG = "#0f172a";
const PAPER_BG = "#1e293b";
const TEXT_WHITE = "#ffffff";
const TEXT_MUTED = "#94a3b8";
const BORDER = "rgba(255, 255, 255, 0.1)";

const REQUIRED_DEPTS = ["DM", "Content Writing", "Video Production", "Editing", "Graphic Design"];

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

export default function CustomProjectDialog({ open, onClose }) {
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // New Project Form State
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [selectedDepts, setSelectedDepts] = useState([]);

  // New Global Task State
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Status Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusTarget, setStatusTarget] = useState({ taskId: null, departmentId: null });

  const token = localStorage.getItem("adminToken");
    //   for list created project
  const fetchProjects = async () => {          
    try {
      setLoading(true);
      const res = await axios.get("https://project-management-sodtware-backend-end.onrender.com/admin/simple_custom_projects", {
        headers: { Authorization: token }
      });
      setProjects(res.data || []);
      // Update selected project if open
      if (selectedProject) {
        const updated = (res.data || []).find(p => p._id === selectedProject._id);
        if (updated) setSelectedProject(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
//  get departmetns admins for list deparment and admin name 
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("https://project-management-sodtware-backend-end.onrender.com/admin/get_admins", {
        headers: { Authorization: token }
      });
      const raw = res.data?.data ?? res.data;
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

      const uniqueDepts = [];
      list.forEach(row => {
        const deptName = row.department || row.role || "";
        const mappedName = mapDeptName(deptName);
        if (mappedName && !uniqueDepts.some(d => d.headId === row._id)) {
          uniqueDepts.push({
            departmentId: row._id,
            departmentName: mappedName,
            headId: row._id,
            headName: row.name || "Unknown Head"
          });
        }
      });

      // Sort to match REQUIRED_DEPTS order
      uniqueDepts.sort((a, b) => REQUIRED_DEPTS.indexOf(a.departmentName) - REQUIRED_DEPTS.indexOf(b.departmentName));

      setDepartments(uniqueDepts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProjects();
      fetchDepartments();
      setIsAddMode(false);
      setSelectedProject(null);
      setNewProjectTitle("");
      setSelectedDepts([]);
    }
  }, [open]);

  const handleToggleDept = (dept) => {
    setSelectedDepts(prev => {
      const isSelected = prev.some(d => d.departmentId === dept.departmentId);
      if (isSelected) return prev.filter(d => d.departmentId !== dept.departmentId);
      return [...prev, dept];
    });
  };
//  add created project in db 
  const handleCreateProject = async () => {
    if (!newProjectTitle.trim() || selectedDepts.length === 0) return;
    try {
      // Create project with the schema's expected fields
      const payload = {
        projectTilte: newProjectTitle,
        departments: selectedDepts.map(d => ({
          departmentId: d.departmentId,
          departmentName: d.departmentName,
          headId: d.headId,
          headName: d.headName,
          // dept_status: "pending",
          // pending_reason: ""
        }))
      };

      await axios.post("https://project-management-sodtware-backend-end.onrender.com/admin/simple_custom_project", payload, {
        headers: { Authorization: token }
      });
      setIsAddMode(false);
      setNewProjectTitle("");
      setSelectedDepts([]);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGlobalTask = async () => {
    if (!newTaskTitle.trim() || !selectedProject) return;
    try {
      const deptsForTask = selectedProject.departments.map(d => ({
        departmentId: d.departmentId,
        departmentName: d.departmentName,
        status: "pending"
      }));

      await axios.post("https://project-management-sodtware-backend-end.onrender.com/admin/simple_custom_project_global_task", {
        projectId: selectedProject._id,
        title: newTaskTitle,
        departments: deptsForTask
      }, {
        headers: { Authorization: token }
      });
      setNewTaskTitle("");
      fetchProjects(); // refresh selected project data
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, departmentId, status) => {
    try {
      await axios.put("https://project-management-sodtware-backend-end.onrender.com/admin/simple_custom_project_global_task", {
        projectId: selectedProject._id,
        departmentName: selectedProject.departmentName,
        taskId,
        departmentId,
        status
      }, {
        headers: { Authorization: token }
      });
      handleCloseStatusMenu();
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenStatusMenu = (event, taskId, departmentId) => {
    setStatusTarget({ taskId, departmentId });
    setAnchorEl(event.currentTarget);
  };

  const handleCloseStatusMenu = () => {
    setAnchorEl(null);
    setStatusTarget({ taskId: null, departmentId: null });
  };

  const getStatusColor = (status, taskDeptStatus) => {
    if (status === "currently working") return "#3b82f6";
    if (status === "check status") return "#f59e0b";
    if (status === "completed") return "#10b981";
    if (status === "pending" && (taskDeptStatus?.date || taskDeptStatus?.remark)) return "#f59e0b";
    return TEXT_MUTED;
  };

  const getStatusIcon = (status) => {
    if (status === "currently working") return <PlayCircleIcon fontSize="small" />;
    if (status === "check status") return <ErrorIcon fontSize="small" />;
    if (status === "completed") return <CheckCircleIcon fontSize="small" />;
    return <AccessTimeIcon fontSize="small" />; // pending
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl" PaperProps={{ sx: { borderRadius: "20px", height: "85vh", display: "flex", flexDirection: "column", bgcolor: DIALOG_BG, color: TEXT_WHITE, overflow: "hidden" } }}>

      {/* HEADER */}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${BORDER}`, bgcolor: DIALOG_BG, px: 3, py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {selectedProject && (
            <IconButton onClick={() => setSelectedProject(null)} sx={{ color: TEXT_WHITE, bgcolor: alpha(TEXT_WHITE, 0.1) }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: TEXT_WHITE }}>
              {selectedProject ? selectedProject.projectTilte || selectedProject.projectTitle : "Custom Projects"}
            </Typography>
            <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
              {selectedProject ? `Created on ${new Date(selectedProject.createdAt || Date.now()).toLocaleDateString()}` : "Manage simplified multi-department workflows"}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {!selectedProject && (
            !isAddMode ? (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddMode(true)} sx={{ bgcolor: ACCENT, borderRadius: "8px", fontWeight: 700, textTransform: "none", color: "#fff", "&:hover": { bgcolor: "#0d5c56" } }}>
                New Project
              </Button>
            ) : (
              <Button variant="outlined" onClick={() => setIsAddMode(false)} sx={{ borderRadius: "8px", fontWeight: 700, textTransform: "none", color: TEXT_WHITE, borderColor: BORDER }}>
                Cancel
              </Button>
            )
          )}
          <IconButton onClick={onClose} size="small" sx={{ bgcolor: alpha(TEXT_WHITE, 0.1), color: TEXT_WHITE }}><CloseRoundedIcon /></IconButton>
        </Box>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 0, bgcolor: DIALOG_BG, flex: 1, overflowY: "auto" }}>

        {/* ADD PROJECT MODE */}
        {isAddMode && !selectedProject && (
          <Box sx={{ p: 4, maxWidth: "600px", mx: "auto", mt: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: `1px solid ${BORDER}`, bgcolor: PAPER_BG, color: TEXT_WHITE }}>
              <Typography sx={{ fontWeight: 800, mb: 3, fontSize: "1.1rem" }}>Create New Project</Typography>
              <TextField
                fullWidth
                label="Project Name"
                variant="outlined"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                sx={{
                  mb: 4,
                  "& .MuiOutlinedInput-root": { borderRadius: "10px", color: TEXT_WHITE, "& fieldset": { borderColor: BORDER } },
                  "& .MuiInputLabel-root": { color: TEXT_MUTED }
                }}
              />
              <Typography sx={{ fontWeight: 700, mb: 1, color: TEXT_MUTED }}>Select Departments</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 4, bgcolor: alpha("#000", 0.2), p: 2, borderRadius: "12px", border: `1px dashed ${BORDER}` }}>
                {departments.map(dept => (
                  <FormControlLabel
                    key={dept.departmentId}
                    control={<Checkbox checked={selectedDepts.some(d => d.departmentId === dept.departmentId)} onChange={() => handleToggleDept(dept)} sx={{ color: TEXT_MUTED, "&.Mui-checked": { color: ACCENT } }} />}
                    label={<Typography sx={{ fontWeight: 600, color: TEXT_WHITE }}>{dept.departmentName} <Typography component="span" variant="caption" sx={{ color: TEXT_MUTED, ml: 1 }}>({dept.headName})</Typography></Typography>}
                  />
                ))}
                {departments.length === 0 && <Typography variant="caption" sx={{ color: TEXT_MUTED }}>No departments found.</Typography>}
              </Box>
              <Button fullWidth variant="contained" onClick={handleCreateProject} disabled={!newProjectTitle.trim() || selectedDepts.length === 0} sx={{ py: 1.5, borderRadius: "10px", fontWeight: 800, bgcolor: ACCENT, color: "#fff", "&:hover": { bgcolor: "#0d5c56" }, "&.Mui-disabled": { bgcolor: alpha(ACCENT, 0.3), color: alpha(TEXT_WHITE, 0.3) } }}>
                Create Project
              </Button>
            </Paper>
          </Box>
        )}

        {/* PROJECT LIST TABLE MODE */}
        {!isAddMode && !selectedProject && (
          <Box sx={{ p: 3 }}>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: `1px solid ${BORDER}`, bgcolor: PAPER_BG }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha("#000", 0.3) }}>
                    <TableCell sx={{ fontWeight: 800, color: TEXT_WHITE, py: 2, borderBottom: `1px solid ${BORDER}` }}>Project Name</TableCell>
                    {REQUIRED_DEPTS.map(deptName => (
                      <TableCell key={deptName} align="center" sx={{ fontWeight: 800, color: TEXT_WHITE, borderBottom: `1px solid ${BORDER}` }}>{deptName}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map(proj => (
                    <TableRow
                      key={proj._id}
                      onClick={() => setSelectedProject(proj)}
                      sx={{
                        cursor: "pointer",
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { bgcolor: alpha("#fff", 0.05) },
                        transition: "background-color 0.2s"
                      }}
                    >
                      <TableCell sx={{ fontWeight: 700, color: TEXT_WHITE, borderBottom: `1px solid ${BORDER}` }}>
                        <Typography sx={{ fontWeight: 800 }}>{proj.projectTilte || proj.projectTitle || "Unnamed Project"}</Typography>
                        <Typography variant="caption" sx={{ color: TEXT_MUTED }}>Created: {new Date(proj.createdAt || Date.now()).toLocaleDateString()}</Typography>
                      </TableCell>
                      {REQUIRED_DEPTS.map(deptName => {
                        const deptInfo = proj.departments.find(d => mapDeptName(d.departmentName) === deptName || d.departmentName === deptName);
                        if (!deptInfo) return <TableCell key={deptName} align="center" sx={{ color: alpha(TEXT_WHITE, 0.2), borderBottom: `1px solid ${BORDER}` }}>—</TableCell>;

                        return (
                          <TableCell key={deptName} align="center" sx={{ borderBottom: `1px solid ${BORDER}` }}>
                            <Chip
                              label={deptInfo.dept_status || "Included"}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                bgcolor: alpha(TEXT_WHITE, 0.1),
                                color: TEXT_WHITE,
                                border: `1px solid ${BORDER}`
                              }}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                  {projects.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={REQUIRED_DEPTS.length + 1} align="center" sx={{ py: 6, color: TEXT_MUTED, borderBottom: "none" }}>
                        No custom projects created yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* PROJECT DETAILED SHEET MODE */}
        {selectedProject && (
          <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>

            {/* Add Task Input Row */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", bgcolor: PAPER_BG, p: 2, borderRadius: "12px", border: `1px solid ${BORDER}` }}>
              <TextField
                size="small"
                placeholder="Type a new task name for this project..."
                fullWidth
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddGlobalTask(); }}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "8px", color: TEXT_WHITE, "& fieldset": { borderColor: BORDER } },
                  "& .MuiInputBase-input::placeholder": { color: TEXT_MUTED, opacity: 1 }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddGlobalTask}
                disabled={!newTaskTitle.trim()}
                startIcon={<AddIcon />}
                sx={{ whiteSpace: "nowrap", px: 3, borderRadius: "8px", fontWeight: 700, bgcolor: ACCENT, color: "#fff", "&:hover": { bgcolor: "#0d5c56" }, "&.Mui-disabled": { bgcolor: alpha(ACCENT, 0.3), color: alpha(TEXT_WHITE, 0.3) } }}
              >
                Add Task
              </Button>
            </Box>

            {/* Task Table */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: `1px solid ${BORDER}`, bgcolor: PAPER_BG }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha("#000", 0.3) }}>
                    <TableCell sx={{ fontWeight: 800, color: TEXT_WHITE, py: 2, borderBottom: `1px solid ${BORDER}`, width: "60px" }}>No.</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: TEXT_WHITE, borderBottom: `1px solid ${BORDER}`, width: "120px" }}>Created At</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: TEXT_WHITE, borderBottom: `1px solid ${BORDER}` }}>Task Name</TableCell>
                    {/* Only show departments that are part of this project */}
                    {REQUIRED_DEPTS.filter(deptName =>
                      selectedProject.departments.some(d => mapDeptName(d.departmentName) === deptName || d.departmentName === deptName)
                    ).map(deptName => (
                      <TableCell key={deptName} align="center" sx={{ fontWeight: 800, color: TEXT_WHITE, borderBottom: `1px solid ${BORDER}` }}>{deptName}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(selectedProject.tasks || []).map((task, index) => (
                    <TableRow key={task._id || index} sx={{ "&:last-child td, &:last-child th": { border: 0 }, "&:hover": { bgcolor: alpha("#fff", 0.05) } }}>
                      {/* Index */}
                      <TableCell sx={{ fontWeight: 700, color: TEXT_MUTED, borderBottom: `1px solid ${BORDER}` }}>
                        #{index + 1}
                      </TableCell>
                      {/* Date */}
                      <TableCell sx={{ fontWeight: 600, color: TEXT_MUTED, borderBottom: `1px solid ${BORDER}` }}>
                        {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                      </TableCell>
                      {/* Task Name */}
                      <TableCell sx={{ fontWeight: 800, color: TEXT_WHITE, borderBottom: `1px solid ${BORDER}` }}>
                        {task.title}
                      </TableCell>

                      {/* Department Statuses for this task */}
                      {REQUIRED_DEPTS.filter(deptName =>
                        selectedProject.departments.some(d => mapDeptName(d.departmentName) === deptName || d.departmentName === deptName)
                      ).map(deptName => {
                        const projectDept = selectedProject.departments.find(d => mapDeptName(d.departmentName) === deptName || d.departmentName === deptName);
                        if (!projectDept) return <TableCell key={deptName} align="center" sx={{ borderBottom: `1px solid ${BORDER}` }}>—</TableCell>;

                        const taskDeptStatus = task.departments?.find(d => d.departmentId === projectDept.departmentId);
                        const status = taskDeptStatus?.status || "pending";
                        const cColor = getStatusColor(status, taskDeptStatus);

                        return (
                          <TableCell key={deptName} align="center" sx={{ borderBottom: `1px solid ${BORDER}` }}>
                            <Tooltip 
                                title={
                                    <React.Fragment>
                                        {taskDeptStatus?.date && (
                                            <div style={{ marginBottom: "4px" }}>
                                                <strong>Date:</strong> {taskDeptStatus.date}
                                            </div>
                                        )}
                                        <div>
                                            {taskDeptStatus?.remark ? `Remark: ${taskDeptStatus.remark}` : "Click to update status"}
                                        </div>
                                    </React.Fragment>
                                }
                            >
                              <Chip
                                icon={getStatusIcon(status)}
                                label={status}
                                onClick={(e) => handleOpenStatusMenu(e, task._id, projectDept.departmentId)}
                                size="small"
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.7rem",
                                  textTransform: "capitalize",
                                  bgcolor: alpha(cColor, 0.15),
                                  color: cColor,
                                  border: `1px solid ${alpha(cColor, 0.4)}`,
                                  "& .MuiChip-icon": { color: cColor },
                                  "&:hover": { bgcolor: alpha(cColor, 0.25) }
                                }}
                              />
                            </Tooltip>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                  {(!selectedProject.tasks || selectedProject.tasks.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={selectedProject.departments.length + 3} align="center" sx={{ py: 6, color: TEXT_MUTED, borderBottom: "none" }}>
                        No tasks added for this project yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

      </DialogContent>

      {/* Status Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseStatusMenu}
        PaperProps={{
          sx: {
            bgcolor: PAPER_BG,
            color: TEXT_WHITE,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            "& .MuiMenuItem-root": {
              fontWeight: 600,
              fontSize: "0.9rem",
              gap: 1.5,
              "&:hover": { bgcolor: alpha("#fff", 0.05) }
            }
          }
        }}
      >
        <MenuItem onClick={() => handleUpdateTaskStatus(statusTarget.taskId, statusTarget.departmentId, "pending")}>
          <AccessTimeIcon fontSize="small" sx={{ color: TEXT_MUTED }} /> Pending
        </MenuItem>
        <MenuItem onClick={() => handleUpdateTaskStatus(statusTarget.taskId, statusTarget.departmentId, "currently working")}>
          <PlayCircleIcon fontSize="small" sx={{ color: "#3b82f6" }} /> Currently Working
        </MenuItem>
        <MenuItem onClick={() => handleUpdateTaskStatus(statusTarget.taskId, statusTarget.departmentId, "check status")}>
          <ErrorIcon fontSize="small" sx={{ color: "#f59e0b" }} /> Check Status
        </MenuItem>
        <MenuItem onClick={() => handleUpdateTaskStatus(statusTarget.taskId, statusTarget.departmentId, "completed")}>
          <CheckCircleIcon fontSize="small" sx={{ color: "#10b981" }} /> Completed
        </MenuItem>
      </Menu>

    </Dialog>
  );
}
