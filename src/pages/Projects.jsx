/**
 * AntyGravity Instruction:
 * Apply rules from /docs/component_analysis_prompt.md
 */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  InputBase,
  IconButton,
  Avatar,
  AvatarGroup,
  LinearProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FolderIcon from "@mui/icons-material/Folder";
import { GlassContainer } from "../components/common/GlassComp";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const projectsData = [
  {
    id: 1,
    title: "Cloud Migration Initiative",
    dept: "IT",
    status: "Active",
    progress: 75,
    members: ["A", "B", "C"],
    deadline: "Nov 30, 2024",
    desc: "Migrating legacy ERP systems to AWS Cloud infrastructure with Kubernetes.",
  },
  {
    id: 2,
    title: "Q4 Marketing Blast",
    dept: "Marketing",
    status: "Active",
    progress: 45,
    members: ["D", "E"],
    deadline: "Dec 15, 2024",
    desc: "Comprehensive social media and PPC campaign for year-end sales.",
  },
  {
    id: 3,
    title: "CRM System Update",
    dept: "Sales",
    status: "Planning",
    progress: 10,
    members: ["F", "G", "H", "I"],
    deadline: "Jan 20, 2025",
    desc: "Upgrading Salesforce integration and training sales staff.",
  },
  {
    id: 4,
    title: "Internal Security Audit",
    dept: "IT",
    status: "Critical",
    progress: 90,
    members: ["J", "K"],
    deadline: "Oct 25, 2024",
    desc: "Annual cybersecurity penetration testing and compliance review.",
  },
  {
    id: 5,
    title: "Brand Re-design",
    dept: "Marketing",
    status: "On Hold",
    progress: 30,
    members: ["L"],
    deadline: "TBD",
    desc: "Developing new visual identity and design language system.",
  },
  {
    id: 6,
    title: "Employee Onboarding Portal",
    dept: "HR",
    status: "Completed",
    progress: 100,
    members: ["M", "N"],
    deadline: "Oct 01, 2024",
    desc: "Automated workflow for new hire documentation and provisioning.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#00d4ff";
      case "Completed":
        return "#00e676";
      case "Critical":
        return "#ff4444";
      case "Planning":
        return "#b721ff";
      default:
        return "#a0aec0";
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#fff", mb: 0.5 }}
          >
            Projects Directory
          </Typography>
          <Typography variant="body2" sx={{ color: "#a0aec0" }}>
            Overview of all ongoing departmental initiatives
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              px: 2,
              py: 0.5,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <SearchIcon sx={{ color: "#a0aec0", mr: 1 }} />
            <InputBase
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ color: "#fff", width: { xs: 150, md: 250 } }}
            />
          </Box>
        </Box>
      </Box>

      {/* Projects Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <Grid item xs={12} md={6} lg={4} key={project.id}>
                <motion.div
                  variants={itemVariants}
                  layout
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <GlassContainer
                    sx={{
                      p: 3,
                      minHeight: 320,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.3s ease",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: `0 15px 50px rgba(0,0,0,0.4), 0 0 20px ${getStatusColor(project.status)}30`,
                        border: `2px solid ${getStatusColor(project.status)}70`,
                        background: `linear-gradient(135deg, rgba(20, 25, 40, 0.8), rgba(30, 35, 50, 0.9))`,
                      },
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Decorative colored glow on top */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        bgcolor: getStatusColor(project.status),
                        opacity: 0.8,
                      }}
                    />

                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Avatar
                          variant="rounded"
                          sx={{
                            bgcolor: `${getStatusColor(project.status)}20`,
                            color: getStatusColor(project.status),
                            borderRadius: "10px",
                          }}
                        >
                          <FolderIcon />
                        </Avatar>
                        <Chip
                          label={project.status}
                          size="small"
                          sx={{
                            bgcolor: `${getStatusColor(project.status)}20`,
                            color: getStatusColor(project.status),
                            fontWeight: 700,
                            border: `1px solid ${getStatusColor(
                              project.status
                            )}30`,
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{ color: "#fff", fontWeight: 700, mb: 1 }}
                      >
                        {project.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#a0aec0",
                          mb: 2,
                          height: 40,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {project.desc}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: "#718096" }}
                          >
                            Progress
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#fff", fontWeight: 600 }}
                          >
                            {project.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "rgba(255,255,255,0.05)",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: getStatusColor(project.status),
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 2,
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <AvatarGroup
                        max={3}
                        sx={{
                          "& .MuiAvatar-root": {
                            width: 24,
                            height: 24,
                            fontSize: "0.75rem",
                          },
                        }}
                      >
                        {project.members.map((m) => (
                          <Avatar key={m}>{m}</Avatar>
                        ))}
                      </AvatarGroup>
                      <Typography variant="caption" sx={{ color: "#718096" }}>
                        Due: {project.deadline}
                      </Typography>
                    </Box>
                  </GlassContainer>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h6" sx={{ color: "#a0aec0" }}>
            No projects found matching your criteria.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Projects;
