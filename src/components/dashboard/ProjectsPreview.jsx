/**
 * ProjectsPreview.jsx — Figma redesign.
 * Clean white cards: title, priority badge, description, deadline, progress bar, "View Details" button.
 * All API logic preserved exactly.
 */
import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Chip, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";

const PRIMARY = "#0f172a";
const SECONDARY = "#64748b";
const BORDER = "rgba(15,23,42,0.09)";

const ProjectsPreview = ({ userId, maxProjects }) => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        axios
          .get(
            "http://localhost:8080/employee_included_proj",
            {
              headers: {
                Authorization: `${userId}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            console.log(res.data);
            setProjects(res.data);
          });
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [userId]);

  const handleEnroll = async (projectId) => {
    try {
      setProjects(
        projects.map((p) =>
          p._id === projectId ? { ...p, isEnrolled: true } : p
        )
      );
    } catch (error) {
      console.error("Error enrolling in project:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "#ef4444";
      case "High": return "#ef4444";
      case "Medium": return "#f97316";
      default: return "#10b981";
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case "Critical": return "#fef2f2";
      case "High": return "#fef2f2";
      case "Medium": return "#fff7ed";
      default: return "#f0fdf4";
    }
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - today.getTime();
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

  const getDescription = (project) =>
    project.description ||
    project.desc ||
    "Complete UIUX Overall of the shopping experience";

  if (projects.length === 0) return null;

  return (
    <Box>
      {/* Section header */}
      <Typography
        sx={{
          fontWeight: 800,
          color: PRIMARY,
          fontSize: { xs: "1.1rem", sm: "1.2rem" },
          letterSpacing: "-0.02em",
          mb: 0.5,
        }}
      >
        My Projects
      </Typography>
      <Typography
        sx={{
          color: SECONDARY,
          fontSize: { xs: "0.78rem", sm: "0.83rem" },
          mb: { xs: 2, sm: 2.5 },
        }}
      >
        Track your ongoing projects and deadlines
      </Typography>

      {/* Project cards grid — 1 col xs, 2 col sm, 3 col md */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }}>
        {projects.slice(0, maxProjects || 9).map((project, index) => {
          const daysRemaining = getDaysRemaining(project.deadline);
          const isUrgent = daysRemaining <= 7;
          const priorityColor = getPriorityColor(project.priority);
          const priorityBg = getPriorityBg(project.priority);

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project._id}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, duration: 0.35 }}
                style={{ height: "100%" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: "16px",
                    border: `1px solid ${BORDER}`,
                    background: "#fff",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    transition: "box-shadow 0.22s ease, transform 0.22s ease",
                    "&:hover": {
                      boxShadow: "0 8px 28px rgba(15,23,42,0.10)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {/* Row 1: Title + Priority badge */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: PRIMARY,
                        fontSize: { xs: "0.88rem", sm: "0.93rem" },
                        lineHeight: 1.35,
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {project.title}
                    </Typography>
                    {project.priority && (
                      <Chip
                        label={project.priority}
                        size="small"
                        sx={{
                          bgcolor: priorityBg,
                          color: priorityColor,
                          fontWeight: 700,
                          fontSize: "0.68rem",
                          height: 22,
                          borderRadius: "6px",
                          flexShrink: 0,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    )}
                  </Box>

                  {/* Description */}
                  <Typography
                    sx={{
                      color: SECONDARY,
                      fontSize: { xs: "0.75rem", sm: "0.78rem" },
                      lineHeight: 1.55,
                      mb: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {getDescription(project)}
                  </Typography>

                  {/* Deadline row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: SECONDARY,
                        fontSize: "0.74rem",
                        fontWeight: 500,
                      }}
                    >
                      Deadline
                    </Typography>
                    <Typography
                      sx={{
                        color: isUrgent ? "#ef4444" : PRIMARY,
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.3,
                      }}
                    >
                      <AccessTimeIcon sx={{ fontSize: 12 }} />
                      {formatDate(project.deadline)}
                      {daysRemaining <= 7 && daysRemaining >= 0 && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: "0.65rem",
                            ml: 0.5,
                            opacity: 0.8,
                            fontWeight: 500,
                          }}
                        >
                          ({daysRemaining === 0 ? "Today" : `${daysRemaining}d left`})
                        </Box>
                      )}
                    </Typography>
                  </Box>

                  {/* View Details button */}
                  <Button
                    variant="contained"
                    disableElevation
                    startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                    onClick={() => navigate(`/app/projects/${project._id}`)}
                    sx={{
                      mt: "auto",
                      background: "linear-gradient(135deg,#1a2d5a 0%,#0f3a8a 100%)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      borderRadius: "10px",
                      textTransform: "none",
                      py: 0.9,
                      "&:hover": {
                        background: "linear-gradient(135deg,#0f1f42 0%,#0a2a6e 100%)",
                      },
                    }}
                  >
                    View Details
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ProjectsPreview;