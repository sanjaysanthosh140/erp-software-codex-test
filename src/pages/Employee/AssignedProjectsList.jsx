import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Fade,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AssignedProjectsList = ({ userId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // TODO: Replace with actual API call
        // const res = await axios.get(`/api/projects/assigned?userId=${userId}`);
        // setProjects(res.data);

        // Mock data

        setTimeout(() => {
          setProjects(mockProjects);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  const handleEnroll = async (projectId) => {
    try {
      // TODO: Replace with actual API call
      // await axios.post('/api/projects/enroll', { projectId, userId });

      // Update local state
      setProjects(
        projects.map((p) =>
          p._id === projectId ? { ...p, isEnrolled: true } : p,
        ),
      );

      console.log(`Enrolled in project: ${projectId}`);
    } catch (error) {
      console.error("Error enrolling in project:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "#ff5b5b";
      case "High":
        return "#ffab00";
      case "Medium":
        return "#00d4ff";
      default:
        return "#00e676";
    }
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

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", p: 3 }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} md={6} lg={6} key={i}>
              <Skeleton variant="rounded" height={280} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.5px",
              }}
            >
              My Projects
            </Typography>
            <Typography variant="body1" sx={{ color: "#a0aec0" }}>
              Track and manage your assigned projects
            </Typography>
          </Box>

          {/* Projects Grid */}
          <Grid container spacing={3}>
            {projects.map((project, index) => {
              const daysRemaining = getDaysRemaining(project.deadline);
              const isUrgent = daysRemaining <= 7;

              return (
                <Grid item xs={12} md={6} lg={6} key={project._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: "20px",
                        background: "rgba(20, 25, 40, 0.7)",
                        backdropFilter: "blur(16px)",
                        border: `1px solid ${isUrgent ? "rgba(255, 171, 0, 0.3)" : "rgba(255, 255, 255, 0.08)"}`,
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          border: `1px solid ${getPriorityColor(project.priority)}50`,
                          boxShadow: `0 8px 32px ${getPriorityColor(project.priority)}20`,
                        },
                      }}
                    >
                      {/* Background Glow */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: "-50%",
                          right: "-20%",
                          width: "200px",
                          height: "200px",
                          background: `radial-gradient(circle, ${getPriorityColor(project.priority)}15 0%, transparent 70%)`,
                          filter: "blur(40px)",
                          zIndex: 0,
                        }}
                      />

                      {/* Content */}
                      <Box
                        sx={{
                          position: "relative",
                          zIndex: 1,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {/* Header */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Chip
                            label={project.priority}
                            size="small"
                            sx={{
                              bgcolor: `${getPriorityColor(project.priority)}20`,
                              color: getPriorityColor(project.priority),
                              fontWeight: 700,
                              border: `1px solid ${getPriorityColor(project.priority)}40`,
                              fontSize: "0.7rem",
                            }}
                          />
                          {project.isEnrolled && (
                            <Chip
                              icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                              label="Enrolled"
                              size="small"
                              sx={{
                                bgcolor: "rgba(0, 230, 118, 0.1)",
                                color: "#00e676",
                                fontWeight: 600,
                                border: "1px solid rgba(0, 230, 118, 0.2)",
                                fontSize: "0.7rem",
                              }}
                            />
                          )}
                        </Box>

                        {/* Title & Description */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#fff",
                            mb: 1,
                            lineHeight: 1.3,
                          }}
                        >
                          {project.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#a0aec0",
                            mb: 3,
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {project.description}
                        </Typography>

                        {/* Progress Section */}
                        <Box sx={{ mb: 3, mt: "auto" }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <TrendingUpIcon
                                sx={{ fontSize: 16, color: "#a0aec0" }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ color: "#a0aec0", fontWeight: 600 }}
                              >
                                Progress
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{ color: "#00d4ff", fontWeight: 700 }}
                            >
                              {project.progress}%
                            </Typography>
                          </Box>

                          {/* Liquid Progress Bar */}
                          <Box
                            sx={{
                              position: "relative",
                              height: 8,
                              borderRadius: 4,
                              bgcolor: "rgba(255, 255, 255, 0.05)",
                              overflow: "hidden",
                            }}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              style={{
                                height: "100%",
                                background: `linear-gradient(90deg, ${getPriorityColor(project.priority)} 0%, ${getPriorityColor(project.priority)}80 100%)`,
                                borderRadius: 4,
                                position: "relative",
                                overflow: "hidden",
                              }}
                            >
                              {/* Liquid wave effect */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: `linear-gradient(90deg, transparent, ${getPriorityColor(project.priority)}40, transparent)`,
                                  animation: "wave 2s infinite linear",
                                  "@keyframes wave": {
                                    "0%": { transform: "translateX(-100%)" },
                                    "100%": { transform: "translateX(100%)" },
                                  },
                                }}
                              />
                            </motion.div>
                          </Box>
                        </Box>

                        {/* Footer Info */}
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <AccessTimeIcon
                              sx={{
                                fontSize: 16,
                                color: isUrgent ? "#ffab00" : "#a0aec0",
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: isUrgent ? "#ffab00" : "#a0aec0",
                                fontWeight: isUrgent ? 700 : 500,
                              }}
                            >
                              {formatDate(project.deadline)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <GroupsIcon
                              sx={{ fontSize: 16, color: "#a0aec0" }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "#a0aec0" }}
                            >
                              {project.teamSize} members
                            </Typography>
                          </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: "flex", gap: 1.5 }}>
                          <Button
                            variant="contained"
                            startIcon={<VisibilityIcon />}
                            onClick={() =>
                              navigate(`/app/projects/${project._id}`)
                            }
                            sx={{
                              flex: 1,
                              borderRadius: "12px",
                              textTransform: "none",
                              fontWeight: 600,
                              background:
                                "linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)",
                              boxShadow: "0 4px 16px rgba(0, 212, 255, 0.3)",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #00bbee 0%, #0088bb 100%)",
                                boxShadow: "0 6px 20px rgba(0, 212, 255, 0.4)",
                              },
                            }}
                          >
                            View Details
                          </Button>
                          {!project.isEnrolled && (
                            <Button
                              variant="outlined"
                              startIcon={<PersonAddIcon />}
                              onClick={() => handleEnroll(project._id)}
                              sx={{
                                flex: 1,
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: "rgba(0, 230, 118, 0.5)",
                                color: "#00e676",
                                "&:hover": {
                                  borderColor: "#00e676",
                                  bgcolor: "rgba(0, 230, 118, 0.1)",
                                },
                              }}
                            >
                              Enroll
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>

          {projects.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 3,
                borderRadius: "20px",
                background: "rgba(20, 25, 40, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Typography variant="h6" sx={{ color: "#a0aec0", mb: 1 }}>
                No projects assigned yet
              </Typography>
              <Typography variant="body2" sx={{ color: "#718096" }}>
                Check back later for new project assignments
              </Typography>
            </Box>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default AssignedProjectsList;
