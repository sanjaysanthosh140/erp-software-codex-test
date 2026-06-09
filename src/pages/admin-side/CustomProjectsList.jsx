import React, { useState, useEffect } from "react";
import {
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
  LinearProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BASE_URL = "https://project-management-sodtware-backend-end.onrender.com";
const ACCENT = "#0f766e";
const PAGE_BG = "#fcfcfc"; // Matches Head.jsx
const PAPER_BG = "#ffffff";
const TEXT_DARK = "#000000";
const TEXT_WHITE = "#ffffff";
const TEXT_MUTED = "#64748b";
const BORDER = "rgba(15, 23, 42, 0.08)";

const REQUIRED_DEPTS = [
  "DM",
  "Content Writing",
  "Video Production",
  "Editing",
  "Graphic Design",
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

export default function CustomProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [edit_id, setedit_id] = useState(null);

  // New Project Form State
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [selectedDepts, setSelectedDepts] = useState([]);

  const token = localStorage.getItem("adminToken");
  const departmentToken = localStorage.getItem("departmentToken");
  
  // Determine if user is included department employee (not admin)
  const isDepartmentEmployee = !token && !!departmentToken;

  const handleCancel = () => {
    setIsAddMode(false);
    setedit_id(null);
    setNewProjectTitle("");
    setSelectedDepts([]);
  };

  const handleNewProjectClick = () => {
    setedit_id(null);
    setNewProjectTitle("");
    setSelectedDepts([]);
    setIsAddMode(true);
  };

  const handleEditProject = async (project) => {
    let pro_id = project._id;
    try {
      let res = await axios.get(
        `${BASE_URL}/admin/simple_custom_project/${pro_id}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        },
      );
      console.log(res);
      const projectData = res.data?.project;
      if (projectData) {
        setNewProjectTitle(
          projectData.projectTilte || projectData.projectTitle || "",
        );
        setSelectedDepts(projectData.departments || []);
        setedit_id(projectData._id);
        setIsAddMode(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch project details from backend.");
    }
  };

  const handleDeleteProject = async (pro_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${BASE_URL}/admin/simple_custom_project/${pro_id}`,
          {
            headers: { Authorization: token },
          },
        );
        fetchProjects();
      } catch (err) {
        console.error(err);
        alert("Failed to delete project");
      }
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/admin/simple_custom_projects`,
        {
          headers: { Authorization: token },
        },
      );
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/get_admins`, {
        headers: { Authorization: token },
      });
      const raw = res.data?.data ?? res.data;
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

      const uniqueDepts = [];
      list.forEach((row) => {
        const deptName = row.department || row.role || "";
        const mappedName = mapDeptName(deptName);
        if (mappedName && !uniqueDepts.some((d) => d.headId === row._id)) {
          uniqueDepts.push({
            departmentId: row._id,
            departmentName: mappedName,
            headId: row._id,
            headName: row.name || "Unknown Head",
          });
        }
      });

      uniqueDepts.sort(
        (a, b) =>
          REQUIRED_DEPTS.indexOf(a.departmentName) -
          REQUIRED_DEPTS.indexOf(b.departmentName),
      );
      setDepartments(uniqueDepts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }
    fetchProjects();
    fetchDepartments();
  }, [token, navigate]);

  const handleToggleDept = (dept) => {
    setSelectedDepts((prev) => {
      const isSelected = prev.some((d) => d.departmentId === dept.departmentId);
      if (isSelected)
        return prev.filter((d) => d.departmentId !== dept.departmentId);
      return [...prev, dept];
    });
  };

  const handleCreateProject = async () => {
    if (!newProjectTitle.trim() || selectedDepts.length === 0) return;
    try {
      const payload = {
        projectTilte: newProjectTitle,
        departments: selectedDepts.map((d) => ({
          departmentId: d.departmentId,
          departmentName: d.departmentName,
          headId: d.headId,
          headName: d.headName,
          dept_status: "pending",
          pending_reason: "",
        })),
      };
      await axios.post(
        `${BASE_URL}/admin/simple_custom_project`,
        payload,
        {
          headers: { Authorization: token },
        },
      );
      handleCancel();
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProject = async () => {
    if (!newProjectTitle.trim() || selectedDepts.length === 0 || !edit_id)
      return;
    try {
      const payload = {
        projectTilte: newProjectTitle,
        departments: selectedDepts.map((d) => ({
          departmentId: d.departmentId,
          departmentName: d.departmentName,
          headId: d.headId,
          headName: d.headName,
          dept_status: d.dept_status || "pending",
          pending_reason: d.pending_reason || "",
        })),
      };
      await axios.put(
        `${BASE_URL}/admin/simple_custom_project/${edit_id}`,
        payload,
        {
          headers: { Authorization: token },
        },
      );
      handleCancel();
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to update project");
    }
  };

  return (
    <Box
      sx={{ minHeight: "100vh", bgcolor: PAGE_BG, color: TEXT_DARK, pb: 10 }}
    >
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
          onClick={() => navigate("/head")}
          sx={{ color: TEXT_DARK, bgcolor: alpha(TEXT_DARK, 0.05) }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Custom Projects
          </Typography>
          <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
            {isDepartmentEmployee ? "View and manage assigned projects" : "Manage multi-department workflows"}
          </Typography>
        </Box>
        <Box>
          {!isAddMode && !isDepartmentEmployee ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewProjectClick}
              sx={{
                bgcolor: ACCENT,
                borderRadius: "8px",
                fontWeight: 700,
                textTransform: "none",
                color: "#fff",
                "&:hover": { bgcolor: "#0d5c56" },
              }}
            >
              New Project
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                borderRadius: "8px",
                fontWeight: 700,
                textTransform: "none",
                color: TEXT_DARK,
                borderColor: BORDER,
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ width: "95%", maxWidth: "1200px", mx: "auto", mt: 4 }}>
        {isAddMode && !isDepartmentEmployee ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "16px",
              border: `1px solid ${BORDER}`,
              bgcolor: PAPER_BG,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: "1.2rem",
                color: TEXT_DARK,
              }}
            >
              {edit_id ? "Edit Project" : "Create New Project"}
            </Typography>
            <TextField
              fullWidth
              label="Project Name"
              variant="outlined"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": { borderColor: BORDER },
                  "& input": { color: TEXT_DARK },
                },
                "& .MuiInputBase-input": { color: TEXT_DARK },
                "& .MuiInputLabel-root": { color: TEXT_DARK },
              }}
            />
            <Typography sx={{ fontWeight: 700, mb: 1, color: TEXT_DARK }}>
              Select Departments
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mb: 4,
                bgcolor: alpha(ACCENT, 0.03),
                p: 2,
                borderRadius: "12px",
                border: `1px dashed ${BORDER}`,
              }}
            >
              {departments.map((dept) => (
                <FormControlLabel
                  key={dept.departmentId}
                  control={
                    <Checkbox
                      checked={selectedDepts.some(
                        (d) => d.departmentId === dept.departmentId,
                      )}
                      onChange={() => handleToggleDept(dept)}
                      sx={{
                        color: TEXT_MUTED,
                        "&.Mui-checked": { color: ACCENT },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 600, color: TEXT_DARK }}>
                      {dept.departmentName}{" "}
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ color: TEXT_MUTED, ml: 1 }}
                      >
                        ({dept.headName})
                      </Typography>
                    </Typography>
                  }
                />
              ))}
              {departments.length === 0 && (
                <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
                  No departments found.
                </Typography>
              )}
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={edit_id ? handleUpdateProject : handleCreateProject}
              disabled={!newProjectTitle.trim() || selectedDepts.length === 0}
              sx={{
                py: 1.5,
                borderRadius: "10px",
                fontWeight: 800,
                bgcolor: ACCENT,
                color: "#fff",
                "&:hover": { bgcolor: "#0d5c56" },
                "&.Mui-disabled": {
                  bgcolor: alpha(ACCENT, 0.3),
                  color: alpha(TEXT_WHITE, 0.3),
                },
              }}
            >
              {edit_id ? "Update Project" : "Create Project"}
            </Button>
          </Paper>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: `1px solid ${BORDER}`,
              bgcolor: PAPER_BG,
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
                    }}
                  >
                    Project Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      color: TEXT_DARK,
                      py: 2,
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                  >
                    Overall Progress
                  </TableCell>
                  {REQUIRED_DEPTS.map((deptName) => (
                    <TableCell
                      key={deptName}
                      align="center"
                      sx={{
                        fontWeight: 800,
                        color: TEXT_DARK,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {deptName}
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      color: TEXT_DARK,
                      py: 2,
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((proj) => (
                  <TableRow
                    key={proj._id}
                    onClick={() =>
                      navigate(`/head/custom-projects/${proj._id}`)
                    }
                    sx={{
                      cursor: "pointer",
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { bgcolor: alpha(TEXT_DARK, 0.02) },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: TEXT_DARK,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      <Typography sx={{ fontWeight: 800 }}>
                        {proj.projectTilte ||
                          proj.projectTitle ||
                          "Unnamed Project"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
                        Created:{" "}
                        {new Date(
                          proj.createdAt || Date.now(),
                        ).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${BORDER}`,
                        width: "220px",
                      }}
                    >
                      {(() => {
                        const totalSlots =
                          (proj.tasks?.length || 0) *
                          (proj.departments?.length || 0);
                        let completedSlots = 0;
                        if (totalSlots > 0) {
                          proj.tasks.forEach((t) =>
                            t.departments?.forEach((d) => {
                              if (d.status === "completed") completedSlots++;
                            }),
                          );
                        }
                        const prog =
                          totalSlots > 0
                            ? Math.round((completedSlots / totalSlots) * 100)
                            : 0;
                        return (
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
                                height: 8,
                                borderRadius: 4,
                                bgcolor: alpha(ACCENT, 0.1),
                                "& .MuiLinearProgress-bar": {
                                  bgcolor: ACCENT,
                                  borderRadius: 4,
                                },
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 800, color: TEXT_DARK }}
                            >
                              {prog}%
                            </Typography>
                          </Box>
                        );
                      })()}
                    </TableCell>
                    {REQUIRED_DEPTS.map((deptName) => {
                      const deptInfo = proj.departments.find(
                        (d) =>
                          mapDeptName(d.departmentName) === deptName ||
                          d.departmentName === deptName,
                      );
                      if (!deptInfo)
                        return (
                          <TableCell
                            key={deptName}
                            align="center"
                            sx={{
                              color: alpha(TEXT_DARK, 0.2),
                              borderBottom: `1px solid ${BORDER}`,
                            }}
                          >
                            —
                          </TableCell>
                        );

                      return (
                        <TableCell
                          key={deptName}
                          align="center"
                          sx={{ borderBottom: `1px solid ${BORDER}` }}
                        >
                          <Chip
                            label="Included"
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.7rem",
                              bgcolor: alpha(ACCENT, 0.1),
                              color: ACCENT,
                              border: `1px solid ${alpha(ACCENT, 0.2)}`,
                            }}
                          />
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
                      {isDepartmentEmployee && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle OK/Approve action for department employees
                            console.log("Project approved by department employee:", proj._id);
                          }}
                          sx={{
                            bgcolor: "#22c55e",
                            color: "#fff",
                            mr: 1,
                            fontSize: "0.75rem",
                            "&:hover": { bgcolor: "#16a34a" },
                          }}
                        >
                          OK
                        </Button>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProject(proj);
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(proj._id);
                        }}
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
                {projects.length === 0 && !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={REQUIRED_DEPTS.length + 3}
                      align="center"
                      sx={{ py: 6, color: TEXT_MUTED, borderBottom: "none" }}
                    >
                      No custom projects created yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
