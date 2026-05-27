/**
 * AntyGravity Instruction:
 * Apply rules from /docs/component_analysis_prompt.md
 */
import React from "react";
import { Box, Typography, Avatar, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Draggable } from "@hello-pangea/dnd";

const TaskCard = ({ task, index, isDragDisabled }) => {
  const getPriorityColor = (priority) => {
    if (!priority) return "#a0aec0";
    const p = priority.toLowerCase();
    switch (p) {
      case "high":
      case "critical":
        return "#ff4081";
      case "medium":
        return "#ffAB00";
      case "low":
        return "#00e676";
      default:
        return "#a0aec0";
    }
  };

  return (
    <Draggable
      draggableId={String(index)}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            p: 2,
            mb: 2,
            bgcolor: snapshot.isDragging
              ? "rgba(0, 212, 255, 0.1)"
              : "rgba(255,255,255,0.05)",
            borderRadius: 2,
            border: snapshot.isDragging
              ? "2px solid #00d4ff"
              : "1px solid rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              bgcolor: "rgba(255,255,255,0.08)",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Chip
              label={task.priority || "N/A"}
              size="small"
              sx={{
                bgcolor: `${getPriorityColor(task.priority)}20`,
                color: getPriorityColor(task.priority),
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            />
            <IconButton size="small" sx={{ color: "#718096", p: 0.5 }}>
              <EditIcon fontSize="small" sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>

          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 1,
              color: "#fff",
              textTransform: "capitalize",
              wordBreak: "break-word",
            }}
          >
            {task.title || "Untitled Task"}
          </Typography>

          {task.desc && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "#a0aec0",
                mb: 1,
                fontSize: "0.75rem",
                lineHeight: 1.4,
              }}
            >
              {task.desc}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#a0aec0",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              <Typography
                variant="caption"
                sx={{ textTransform: "capitalize" }}
              >
                {task.deadline || "No deadline"}
              </Typography>
            </Box>
            {task._id && (
              <Typography
                variant="caption"
                sx={{
                  color: "#718096",
                  fontSize: "0.65rem",
                  fontFamily: "monospace",
                }}
              >
                {task._id.substring(0, 8)}...
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Draggable>
  );
};

export default TaskCard;
