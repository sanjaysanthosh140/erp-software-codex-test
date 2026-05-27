/**
 * AntyGravity Instruction:
 * Apply rules from /docs/component_analysis_prompt.md
 */
import React from "react";
import { Box, Typography, LinearProgress, Paper, Chip } from "@mui/material";
import { motion } from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const ActiveProjectTracker = ({ project }) => {
  if (!project) return null;

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        p: 3,
        mb: 3,
        background: "rgba(20, 25, 40, 0.7)",
        backdropFilter: "blur(12px)",
        borderRadius: "16px",
        border: "1px solid rgba(0, 212, 255, 0.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RocketLaunchIcon sx={{ color: "#00d4ff" }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
              Active Project
            </Typography>
          </Box>
          <Chip
            label="In Progress"
            size="small"
            sx={{
              bgcolor: "rgba(0, 212, 255, 0.1)",
              color: "#00d4ff",
              fontWeight: 600,
              border: "1px solid rgba(0, 212, 255, 0.2)",
            }}
          />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, color: "#fff", mb: 1 }}>
          {project.title || "Enterprise Cloud Migration"}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#a0aec0", mb: 3, maxWidth: "80%" }}
        >
          {project.description ||
            "Migrating legacy on-premise infrastructure to AWS with Kubernetes orchestration."}
        </Typography>

        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Typography variant="caption" sx={{ color: "#a0aec0" }}>
            Current Sprint Progress
          </Typography>
          <Typography variant="h6" sx={{ color: "#00d4ff", fontWeight: 700 }}>
            {project.progress || 65}%
          </Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            height: 8,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.05)",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress || 65}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #00d4ff 0%, #009bb3 100%)",
              borderRadius: 4,
            }}
          />
        </Box>

        <Box sx={{ mt: 3, display: "flex", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: "#a0aec0" }} />
            <Typography variant="caption" sx={{ color: "#a0aec0" }}>
              Deadline: {project.deadline || "Oct 24, 2024"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#00e676",
              }}
            />
            <Typography variant="caption" sx={{ color: "#a0aec0" }}>
              On Track
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ActiveProjectTracker;
