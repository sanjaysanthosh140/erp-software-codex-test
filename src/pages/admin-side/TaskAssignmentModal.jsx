const API_URL = import.meta.env.VITE_API_URL;
import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Avatar,
  Paper,
  Button,
  alpha,
  Grid,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

// --- Theme Constants ---
const COLORS = {
  primary: "#1e40af", // Strong blue for action buttons
  textMain: "#1f2937",
  textLight: "#6b7280",
  backlogBg: "#f9fafb",
  cardBg: "#ffffff",
  border: "#e5e7eb",
  specialist: "#f59e0b", // Orange
  tasks: "#3b82f6",      // Blue
  performance: "#10b981", // Green
};

const StatCard = ({ label, value }) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 1, md: 1.5 },
      px: { xs: 1.5, md: 2 },
      minWidth: { xs: 70, md: 90 },
      textAlign: "center",
      borderRadius: "12px",
      bgcolor: "#ffffff",
      border: `1.5px solid ${COLORS.border}`,
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 0.5,
    }}
  >
    <Typography
      variant="h5"
      sx={{
        fontWeight: 700,
        color: "#222", // Clean black text
        lineHeight: 1,
        fontSize: { xs: "1.1rem", md: "1.5rem" },
      }}
    >
      {value}
    </Typography>
    <Typography
      variant="caption"
      sx={{
        fontWeight: 600,
        color: "#222", // Clean black text
        fontSize: { xs: "0.55rem", md: "0.65rem" },
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Typography>
  </Paper>
);

const TaskCard = ({ task, index }) => (
  <Draggable draggableId={task._id} index={index}>
    {(provided, snapshot) => {
      const child = (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            background: COLORS.cardBg,
            borderRadius: "12px",
            border: `1.5px solid ${COLORS.border}`,
            boxShadow: snapshot.isDragging ? "0 10px 20px rgba(0,0,0,0.1)" : "0 2px 4px rgba(0,0,0,0.02)",
            cursor: "grab",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "#d1d5db" }
          }}
        >
          <Typography sx={{ fontWeight: 700, color: COLORS.textMain, mb: 1, fontSize: "1rem" }}>
            {task.title}
          </Typography>
          {(task.dueDate || task.duedate) && (
            <Typography variant="caption" sx={{ color: COLORS.textLight, fontWeight: 600 }}>
              Deadline {new Date(task.dueDate || task.duedate).toLocaleDateString("en-GB")}
            </Typography>
          )}
        </Paper>
      );
      if (snapshot.isDragging) return ReactDOM.createPortal(child, document.body);
      return child;
    }}
  </Draggable>
);

const SpecialistColumn = ({ specialist }) => (
  <Droppable droppableId={`specialist-${specialist.stableId}`}>
    {(provided, snapshot) => (
      <Box
        {...provided.droppableProps}
        ref={provided.innerRef}
        sx={{
          minWidth: 320,
          background: COLORS.backlogBg,
          borderRadius: "16px",
          border: `1.5px solid ${COLORS.border}`,
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          bgcolor: snapshot.isDraggingOver ? alpha(COLORS.tasks, 0.05) : COLORS.backlogBg,
          flexShrink: 0,
          flexGrow: 1,
          maxWidth: 400,
          height: 380, // Medium fixed size
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, p: 1 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: COLORS.primary,
              fontSize: "1rem",
              fontWeight: 700,
              bgcolor: (specialist.name?.charCodeAt(0) % 2 === 0) ? "#1e40af" : (specialist.name?.charCodeAt(0) % 3 === 0) ? "#a16207" : "#065f46"
            }}
          >
            {specialist.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.textMain, lineHeight: 1.2 }}>
              {specialist.name}
            </Typography>
            <Typography variant="caption" sx={{ color: COLORS.textLight, fontWeight: 600 }}>
              {specialist.role || "IT"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          flexGrow: 1,
          overflowY: "auto",
          pr: 1,
          pb: 1,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 3 }
        }}>
          {specialist.assignedTasks.map((task, index) => (
            <TaskCard key={task._id} task={task} index={index} />
          ))}
          {provided.placeholder}
          {specialist.assignedTasks.length === 0 && !snapshot.isDraggingOver && (
            <Box sx={{ py: 4, textAlign: "center", border: "1px dashed #ccc", borderRadius: "12px", opacity: 0.5 }}>
              <Typography variant="caption" sx={{ color: COLORS.textLight, fontWeight: 600 }}>
                Drop tasks here
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    )}
  </Droppable>
);

const TaskAssignmentModal = ({ open, onClose, projectData, onSave }) => {
  const [unassignedTasks, setUnassignedTasks] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const fetchExistingAssignments = async () => {
      if (open && projectData?._id) {
        try {
          const initialSpecialists = (projectData.teamMembers || []).map(
            (member, index) => ({
              ...member,
              stableId: String(
                member.userId || member._id || `temp-id-${index}`,
              ),
              assignedTasks: [],
            }),
          );

          let id = projectData._id;
          const response = await axios.get(
            `${API_URL}/admin/check_assigned_tasks/${id}`,
          );
          const existingData = response.data;

          if (existingData && existingData.employeeTasks) {
            setIsUpdate(true);
            const dbTasks = existingData.employeeTasks;

            const sanitizeTask = (t) => {
              const rawId = t._id || t.task_id || `temp-${Math.random()}`;
              const strId = typeof rawId === 'object' ? rawId.$oid || rawId.toString() : String(rawId);
              return { ...t, _id: strId };
            };

            const hydratedSpecialists = initialSpecialists.map((s) => {
              const matchingTasks = dbTasks
                .filter((item) => item.employee === s.stableId)
                .map((item) => sanitizeTask(item.tasks));
              return { ...s, assignedTasks: matchingTasks };
            });
            setSpecialists(hydratedSpecialists);

            const assignedTaskTitles = dbTasks.map((item) => item.tasks.title);
            const filteredBacklog = (projectData.todos || []).filter(
              (todo) => !assignedTaskTitles.includes(todo.title),
            ).map(sanitizeTask);
            setUnassignedTasks(filteredBacklog);
          } else {
            setIsUpdate(false);
            setSpecialists(initialSpecialists);
            const sanitizeTask = (t) => {
              const rawId = t._id || t.task_id || `temp-${Math.random()}`;
              const strId = typeof rawId === 'object' ? rawId.$oid || rawId.toString() : String(rawId);
              return { ...t, _id: strId };
            };
            setUnassignedTasks((projectData.todos || []).map(sanitizeTask));
          }
        } catch (error) {
          console.error("Error fetching assignments:", error);
          setIsUpdate(false);
          const sanitizeTask = (t) => {
            const rawId = t._id || t.task_id || `temp-${Math.random()}`;
            const strId = typeof rawId === 'object' ? rawId.$oid || rawId.toString() : String(rawId);
            return { ...t, _id: strId };
          };
          setUnassignedTasks((projectData.todos || []).map(sanitizeTask));
          setSpecialists(
            (projectData.teamMembers || []).map((member, index) => ({
              ...member,
              stableId: String(
                member.userId || member._id || `temp-id-${index}`,
              ),
              assignedTasks: [],
            })),
          );
        }
      }
    };
    fetchExistingAssignments();
  }, [open, projectData]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (source.droppableId === "unassigned" && destination.droppableId.startsWith("specialist-")) {
      const task = unassignedTasks[source.index];
      const specialistId = String(destination.droppableId.replace("specialist-", ""));
      const newUnassigned = Array.from(unassignedTasks);
      newUnassigned.splice(source.index, 1);
      setUnassignedTasks(newUnassigned);
      setSpecialists((prev) =>
        prev.map((s) => {
          if (s.stableId === specialistId) {
            const newTasks = Array.from(s.assignedTasks);
            newTasks.splice(destination.index, 0, task);
            return { ...s, assignedTasks: newTasks };
          }
          return s;
        }),
      );
    }

    if (source.droppableId.startsWith("specialist-") && destination.droppableId.startsWith("specialist-")) {
      const sourceId = String(source.droppableId.replace("specialist-", ""));
      const destId = String(destination.droppableId.replace("specialist-", ""));
      setSpecialists((prevList) => {
        let movedItem;
        const newSpecialists = prevList.map((s) => {
          if (s.stableId === sourceId) {
            const newTasks = Array.from(s.assignedTasks);
            [movedItem] = newTasks.splice(source.index, 1);
            return { ...s, assignedTasks: newTasks };
          }
          return s;
        });
        if (!movedItem) return prevList;
        return newSpecialists.map((s) => {
          if (s.stableId === destId) {
            const newTasks = Array.from(s.assignedTasks);
            newTasks.splice(destination.index, 0, movedItem);
            return { ...s, assignedTasks: newTasks };
          }
          return s;
        });
      });
    }

    if (source.droppableId.startsWith("specialist-") && destination.droppableId === "unassigned") {
      const sourceId = String(source.droppableId.replace("specialist-", ""));
      let taskToMove;
      setSpecialists((prev) =>
        prev.map((s) => {
          if (s.stableId === sourceId) {
            const newTasks = Array.from(s.assignedTasks);
            [taskToMove] = newTasks.splice(source.index, 1);
            return { ...s, assignedTasks: newTasks };
          }
          return s;
        }),
      );
      if (taskToMove) {
        const newUnassigned = Array.from(unassignedTasks);
        newUnassigned.splice(destination.index, 0, taskToMove);
        setUnassignedTasks(newUnassigned);
      }
    }
  };

  const handleSave = async () => {
    try {
      const submissionData = {
        projectId: projectData._id,
        headId: projectData.head_id,
        employeeTasks: specialists
          .filter((s) => s.assignedTasks.length > 0)
          .flatMap((s) =>
            s.assignedTasks.map((t) => ({
              employee: s.userId || s._id || s.stableId,
              tasks: {
                task_id: t.task_id || crypto.randomUUID(),
                title: t.title,
                priority: t.priority,
                duedate: t.dueDate || t.duedate,
                status: t.status || "pending",
              },
            })),
          ),
      };
      if (isUpdate) {
        let id = projectData._id;
        await axios.put(`${API_URL}/admin/assigned_tasks/${id}`, submissionData);
      } else {
        await axios.post(`${API_URL}/admin/assigned_tasks`, submissionData);
        setIsUpdate(true);

      }
      if (onSave) onSave(submissionData);
      onClose();
    } catch (error) {
      console.error("Error submitting assignments:", error);
    }
  };

  const totals = useMemo(() => {
    const assignedCount = specialists.reduce((acc, s) => acc + s.assignedTasks.length, 0);
    return {
      specialists: specialists.length,
      tasks: unassignedTasks.length + assignedCount,
    };
  }, [unassignedTasks, specialists]);

  if (!projectData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableEnforceFocus
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          background: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          m: { xs: 1, md: 5 },
          height: { xs: "98vh", md: "90vh" },
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        },
      }}
    >
      {/* Header Section */}
      <DialogTitle sx={{ p: { xs: 3, md: 6 }, pb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 3 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 400, color: COLORS.textMain, mb: 1, fontSize: { xs: "2rem", md: "3rem" } }}>
              Workspace Hub
            </Typography>
            <Typography variant="body1" sx={{ color: COLORS.textLight, fontWeight: 500, fontSize: { xs: "0.9rem", md: "1.1rem" } }}>
              Track employee progress and daily updates
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, md: 4 } }}>
            <Box sx={{ display: "flex", gap: { xs: 1, md: 2 } }}>
              <StatCard label="Specialists" value={totals.specialists} color={COLORS.specialist} />
              <StatCard label="Tasks" value={totals.tasks} color={COLORS.tasks} />
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                border: "2px solid #eee",
                p: 0.5,
                color: "#666",
                "&:hover": { borderColor: "#ccc", background: "#f5f5f5" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 3, md: 6 }, pt: 4, pb: 2, overflowX: "hidden" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={4} sx={{ height: "100%", flexWrap: "nowrap" }}>

            {/* Task Backlog Column */}
            <Grid item sx={{ width: { xs: 280, lg: 320 }, flexShrink: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.textMain, mb: 3 }}>
                Task Backlog
              </Typography>
              <Droppable droppableId="unassigned">
                {(provided, snapshot) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{
                      background: COLORS.backlogBg,
                      borderRadius: "16px",
                      border: `1.5px solid ${COLORS.border}`,
                      p: 2.5,
                      height: 380, // Symmetrically matches the specialist bins
                      overflowY: "auto",
                      transition: "background 0.2s ease",
                      bgcolor: snapshot.isDraggingOver ? alpha(COLORS.tasks, 0.05) : COLORS.backlogBg,
                      "&::-webkit-scrollbar": { width: 6 },
                      "&::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 3 }
                    }}
                  >
                    <AnimatePresence initial={false}>
                      {unassignedTasks.map((task, index) => (
                        <TaskCard key={task._id} task={task} index={index} />
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                    {unassignedTasks.length === 0 && (
                      <Box sx={{ py: 8, textAlign: "center" }}>
                        <Typography variant="body2" sx={{ color: COLORS.textLight, fontWeight: 500 }}>
                          No unassigned tasks remaining
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Droppable>
            </Grid>

            {/* Team Assignment Column */}
            <Grid item sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.textMain, mb: 3 }}>
                Team Assignment
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  pb: 3,
                  minHeight: "55vh",
                  maxHeight: "75vh",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": { width: 8 },
                  "&::-webkit-scrollbar-thumb": { background: "#e5e7eb", borderRadius: 4 }
                }}
              >
                {specialists.map((specialist) => (
                  <SpecialistColumn key={specialist.stableId} specialist={specialist} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DragDropContext>
      </DialogContent>

      <DialogActions sx={{ p: { xs: 3, md: 6 }, pt: 0, justifyContent: "flex-end", gap: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: "12px",
            color: COLORS.textMain,
            borderColor: COLORS.border,
            borderWidth: "1.5px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "1.1rem",
            "&:hover": { borderColor: "#999", background: "transparent", borderWidth: "1.5px" }
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={specialists.every((s) => s.assignedTasks.length === 0)}
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: "12px",
            background: "#1e4e8c",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "1.1rem",
            boxShadow: "none",
            "&:hover": { background: "#153a6b", boxShadow: "0 4px 12px rgba(30, 78, 140, 0.3)" }
          }}
        >
          Apply Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskAssignmentModal;
