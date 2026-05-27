
/**
 * AntyGravity Instruction:
 * Apply rules from /docs/component_analysis_prompt.md
 */import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const ProjectBoard = ({ tasks = [], setTasks, currentUserId }) => {
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If dropped in same column
    if (source.droppableId === destination.droppableId) {
      return;
    }

    // Move to different column (update status)
    const draggedIndex = parseInt(result.draggableId);
    const newStatus = destination.droppableId;

    const updatedTasks = tasks.map((task, idx) =>
      idx === draggedIndex ? { ...task, status: newStatus } : task
    );

    setTasks(updatedTasks);
    console.log("Task updated:", updatedTasks[draggedIndex]);
  };

  const columns = [
    { id: "pending", title: "To Do", color: "#ffAB00" },
    { id: "in_progress", title: "In Progress", color: "#00d4ff" },
    { id: "completed", title: "Completed", color: "#00e676" },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          pb: 2,
          height: "100%",
        }}
      >
        {columns.map((col) => (
          <Box key={col.id} sx={{ flex: 1, minWidth: 280 }}>
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: col.color,
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#e2e8f0" }}
              >
                {col.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#718096",
                  bgcolor: "rgba(255,255,255,0.05)",
                  px: 1,
                  borderRadius: 1,
                }}
              >
                {tasks.filter((t) => t.status === col.id).length}
              </Typography>
            </Box>

            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    bgcolor: snapshot.isDraggingOver
                      ? "rgba(255,255,255,0.03)"
                      : "transparent",
                    borderRadius: 3,
                    minHeight: 500,
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {tasks
                    .filter((task) => task.status === col.id)
                    .map((task, index) => {
                      // Find the original index of this task
                      const originalIndex = tasks.findIndex(
                        (t) => t._id === task._id
                      );

                      return (
                        <TaskCard
                          key={task._id || index}
                          task={task}
                          index={originalIndex}
                          isDragDisabled={
                            currentUserId && task.assignedTo !== currentUserId
                          }
                        />
                      );
                    })}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Box>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default ProjectBoard;
