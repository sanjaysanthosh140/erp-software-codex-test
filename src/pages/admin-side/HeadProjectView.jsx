import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  Card,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Tooltip,
  alpha,
  Skeleton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderIcon from "@mui/icons-material/Folder";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import TaskAssignmentModal from "./TaskAssignmentModal";
import CreateProjectDialog from "../../components/CreateProjectDialog";

// --- Redesigned Head Operations Branding ---
const PRIMARY_COLOR = "#0d254a";
const SECONDARY_COLOR = "#1e4db7";
const LIGHT_BG = "#fcfcfc";

const HeadProjectView = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment Modal State
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Creation/Edit Dialog State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProjectData, setEditingProjectData] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Delete Confirmation State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "https://project-management-sodtware-backend-end.onrender.com/admin/headProj",
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        setProjectsList(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  const confirmDelete = (e, id) => {
    if (e) e.stopPropagation();
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      console.log("Delete triggered for project:", projectToDelete);
      let res = await axios.delete(`https://project-management-sodtware-backend-end.onrender.com/admin/delete_proj/${projectToDelete}`);
      console.log("delete response", res.data);
      if (res.status === 200) {
        setProjectsList((prev) => prev.filter((project) => project._id !== projectToDelete));
        setAlertMessage(res.data.message || "Project deleted successfully");
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setAlertMessage("Failed to delete project");
      setAlertOpen(true);
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };


  const handleEdit = async (e, id) => {
    if (e) e.stopPropagation();
    try {
      let res = await axios.delete(`https://project-management-sodtware-backend-end.onrender.com/admin/edit_project/${id}`, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });
      setEditingProjectData(res.data);
      setIsCreateDialogOpen(true);
    } catch (error) {
      console.error("Error fetching project for edit:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "#00d4ff";
      case "Completed": return "#4ade80";
      case "Critical": return "#ff4d4f";
      case "Planning": return "#f59e0b";
      default: return "#94a3b8";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "#ff4d4f";
      case "High": return "#fb7185";
      case "Medium": return "#f59e0b";
      case "Low": return "#4ade80";
      default: return "#94a3b8";
    }
  };

  const filteredProjects = projectsList.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fcfcfc" }}>
      {/* Header Section */}
      <Box sx={{ py: 1.5, backgroundColor: "#fff", borderBottom: "1px solid #eee" }}>
        <Box sx={{ width: "98%", mx: "auto", px: { xs: 1, md: 3 }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 0.5, fontSize: "1.75rem" }}>
              Head Operations
            </Typography>
            <Typography variant="body2" sx={{ color: "#888", fontWeight: 500, fontSize: "0.9rem" }}>
              Workspace Hub
            </Typography>
          </Box>
          <Button
            onClick={() => navigate("/head")}
            variant="outlined"
            sx={{
              color: "#475569",
              borderColor: "rgba(15, 23, 42, 0.12)",
              borderRadius: "12px",
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              "&:hover": {
                backgroundColor: "#f1f5f9",
                borderColor: "rgba(15, 23, 42, 0.2)",
                color: "#0f172a"
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Box sx={{ width: "98%", mx: "auto", px: { xs: 1, md: 3 }, pt: 4, pb: 10 }}>
        {/* Navigation & Search Row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/head")}
            sx={{ color: "#444", fontWeight: 600, textTransform: "none", fontSize: "1rem", p: 0, "&:hover": { background: "none", color: "#000" } }}
          >
            Back to Dashboard
          </Button>

          <TextField
            placeholder="Search Records..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#aaa" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: 350 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#fff",
              }
            }}
          />
        </Box>

        {/* Title Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 1 }}>
            Records
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
            Manage departments and resources efficiently
          </Typography>
        </Box>

        {/* Projects Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box sx={{ bgcolor: "#fff", p: 4, borderRadius: "16px", border: "1px solid #eee", height: 320 }}>
                  <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="40%" height={24} sx={{ mb: 4 }} />
                  <Skeleton variant="rectangular" height={12} sx={{ borderRadius: 6, mb: 4 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: "auto" }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="circular" width={40} height={40} />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : filteredProjects.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h6" sx={{ color: "#888" }}>No records found matching your search.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredProjects.map((project) => {
              const teamMembers = project.teamMembers || [];
              const tasks = project.todos || [];
              const completedTasks = tasks.filter((t) => t.status === "completed").length;
              const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
              const sc = getStatusColor(project.status || "Active");

              return (
                <Grid item xs={12} sm={6} md={4} key={project._id}>
                  <Box
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: "16px",
                      p: 4,
                      border: "1px solid #eee",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
                      }
                    }}
                    onClick={() => {
                      setSelectedProject(project);
                      setIsModalOpen(true);
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#333", fontSize: "1.25rem", lineHeight: 1.2 }}>
                        {project.title}
                      </Typography>
                      <Chip
                        label={project.status || "Active"}
                        size="small"
                        sx={{
                          bgcolor: `${sc}12`,
                          color: sc,
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    <Typography sx={{ color: "#888", fontSize: "0.85rem", fontWeight: 700, mb: 1 }}>IT</Typography>
                    <Chip
                      label={project.priority || "High"}
                      size="small"
                      sx={{
                        bgcolor: "#fee2e2",
                        color: "#ef4444",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        borderRadius: "4px",
                        width: "fit-content",
                        mb: 3
                      }}
                    />

                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography sx={{ color: "#aaa", fontSize: "0.8rem", fontWeight: 600 }}>Deadline</Typography>
                        <Typography sx={{ color: "#333", fontSize: "0.85rem", fontWeight: 700 }}>2 days left</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: "auto", pt: 3, borderTop: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 32, height: 32, fontSize: "0.75rem", border: "2px solid #fff", color: "#fff" } }}>
                        {teamMembers.map((m, i) => (
                          <Avatar key={i} sx={{ bgcolor: ["#0369a1", "#f59e0b", "#991b1b"][i % 3] }}>{m.name?.[0] || m.email?.[0] || "U"}</Avatar>
                        ))}
                      </AvatarGroup>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleEdit(e, project._id); }}
                          sx={{ color: "#666", "&:hover": { color: "#3b82f6" } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => confirmDelete(e, project._id)}
                          sx={{ color: "#666", "&:hover": { color: "#ef4444" } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      <TaskAssignmentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectData={selectedProject}
        onSave={(data) => console.log("Saving Assignments:", data)}
      />

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setEditingProjectData(null);
        }}
        initialData={editingProjectData}
        onSubmit={async (finalData) => {
          try {
            if (editingProjectData?._id) {
              await axios.put(`https://project-management-sodtware-backend-end.onrender.com/admin/updateProj/${editingProjectData._id}`, finalData, {
                headers: { Authorization: `${token}` }
              });
              setAlertMessage("Project updated successfully");
            } else {
              await axios.post("https://project-management-sodtware-backend-end.onrender.com/admin/createProj", finalData, {
                headers: { Authorization: `${token}` }
              });
              setAlertMessage("Project created successfully");
            }
            setAlertOpen(true);
            const response = await axios.get("https://project-management-sodtware-backend-end.onrender.com/admin/headProj", {
              headers: { Authorization: `${token}` }
            });
            setProjectsList(response.data);
          } catch (error) {
            console.error("Submission error:", error);
            setAlertMessage("Submission failed");
            setAlertOpen(true);
          }
        }}
      />
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertMessage.toLowerCase().includes("fail") ? "error" : "success"}
          sx={{
            width: "100%",
            borderRadius: "16px",
            fontWeight: 700,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
            backgroundColor: alertMessage.toLowerCase().includes("fail") ? "rgba(255, 77, 79, 0.9)" : "rgba(74, 222, 128, 0.9)",
            color: "#fff",
            "& .MuiAlert-icon": { color: "#fff" }
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 12px 24px rgba(0,0,0,0.5)",
            width: "400px",
            maxWidth: "90vw",
            backgroundColor: "#1e1e1e", // Deep dark / black background
            color: "#fff"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#fff", pb: 1 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#e0e0e0", fontWeight: 500 }}>
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pt: 4 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: "#aaa", fontWeight: 600, textTransform: "none", "&:hover": { color: "#fff" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              backgroundColor: "#ef4444",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#dc2626", boxShadow: "none" }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HeadProjectView;
