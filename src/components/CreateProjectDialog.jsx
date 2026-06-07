import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Chip,
  Avatar,
  Paper,
  Alert,
  alpha,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";

// --- Styled Components & Theme Constants ---

const PRIMARY_BLUE = "#1e4db7";
const SECONDARY_BLUE = "#0d254a";
const SUCCESS_GREEN = "#10b981";

const getDaysLeft = (dateString) => {
  if (!dateString) return "Not Set";
  const today = new Date();
  const target = new Date(dateString);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due Today";
  if (diffDays === 1) return "1 day left";
  return `${diffDays} days left`;
};

const formHeaderStyle = {
  fontSize: "2rem",
  fontWeight: 900,
  color: "#222",
  letterSpacing: "-0.04em",
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "#fff",
    "& fieldset": { borderColor: "#eee" },
    "&:hover fieldset": { borderColor: "#ddd" },
    "&.Mui-focused fieldset": { borderColor: PRIMARY_BLUE, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": {
    color: "#888",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  "& .MuiInputBase-input": {
    fontWeight: 700,
    color: "#333",
  }
};

const navButtonStyle = {
  borderRadius: "12px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: "1.1rem",
  px: 4,
  py: 1.5,
};

// --- Custom Stepper Component ---

const CustomStepper = ({ activeStep, completed }) => {
  const steps = [
    { label: "Enter Your Email", index: 1 },
    { label: "Add Tasks", index: 2 },
    { label: "Assign Team", index: 3 },
  ];

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 8, position: "relative" }}>
      {/* Background Line */}
      <Box sx={{ position: "absolute", top: "16px", left: "5%", right: "5%", height: "2px", bgcolor: "#eee", zIndex: 0 }} />

      {steps.map((step, i) => {
        const isActive = activeStep === i;
        const isCompleted = activeStep > i;

        return (
          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, zIndex: 1, px: 2, bgcolor: "#fff", position: "relative" }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isCompleted ? SUCCESS_GREEN : (isActive ? PRIMARY_BLUE : "#eee"),
                color: (isActive || isCompleted) ? "#fff" : "#aaa",
                fontWeight: 900,
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
              }}
            >
              {isCompleted ? <CheckIcon sx={{ fontSize: 18 }} /> : step.index}
            </Box>
            <Typography
              sx={{
                fontWeight: 800,
                color: isCompleted ? SUCCESS_GREEN : (isActive ? PRIMARY_BLUE : "#aaa"),
                fontSize: "0.9rem",
                display: { xs: "none", sm: "block" }
              }}
            >
              {step.label}
            </Typography>

            {/* Active Progress Line Segment */}
            {i < steps.length - 1 && isCompleted && (
              <Box sx={{
                position: "absolute",
                top: "16px",
                left: "100%",
                width: "200px", // Approximate length to next step
                height: "2px",
                bgcolor: SUCCESS_GREEN,
                zIndex: -1
              }} />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

const CreateProjectDialog = ({ open, onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeStep, setActiveStep] = useState(0);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
  });
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    priority: "Medium",
    dueDate: "",
  });
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [todoToDeleteId, setTodoToDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset or Popoulate state based on initialData
  useEffect(() => {
    if (open) {
      if (initialData) {
        setProjectData({
          title: initialData.projectName || initialData.title || "",
          description: initialData.projectDesc || initialData.description || "",
          deadline: initialData.projectDeadline ? initialData.projectDeadline.split("T")[0] : (initialData.deadline ? initialData.deadline.split("T")[0] : ""),
          priority: initialData.priority || "Medium",
        });
        setTodos(initialData.tasks || initialData.todos || []);
        const team = (initialData.specialists || initialData.teamMembers || []).map(member => {
          const id = member.userId || member._id;
          const idStr = typeof id === 'object' ? id.$oid || id.toString() : String(id);
          return {
            ...member,
            userId: idStr,
            _id: idStr,
            avatar: member.name ? member.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "S"
          };
        });
        setSelectedTeam(team);
      } else {
        setProjectData({ title: "", description: "", deadline: "", priority: "Medium" });
        setTodos([]);
        setSelectedTeam([]);
        setActiveStep(0);
      }
    }
  }, [open, initialData]);

  useEffect(() => {
    if (open && activeStep == 2) {
      fetchEmployees();
    }
  }, [open, activeStep]);

  const fetchEmployees = async () => {
    try {
      let token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:8080/admin/employes", {
        headers: { Authorization: `${token}`, "Content-Type": "application/json" },
      });
      const mappedEmployees = res.data.map((emp) => {
        const empIdStr = typeof emp._id === 'object' ? emp._id.$oid || emp._id.toString() : String(emp._id);
        return {
          userId: empIdStr,
          _id: empIdStr,
          name: emp.name,
          role: emp.department,
          department: emp.department,
          email: emp.email,
          avatar: emp.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
        };
      });
      const filteredEmployees = mappedEmployees.filter(
        (emp) => !selectedTeam.some((member) => member.userId === emp.userId)
      );
      setAvailableEmployees(filteredEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees");
    }
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleTodoChange = (e) => {
    const { name, value } = e.target;
    setNewTodo({ ...newTodo, [name]: value });
  };

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return;
    setTodos([
      ...todos,
      {
        _id: `t${Date.now()}`,
        ...newTodo,
        status: "pending",
      },
    ]);
    setNewTodo({ title: "", priority: "Medium", dueDate: "" });
  };

  const handleDeleteTodo = (id) => {
    setTodoToDeleteId(id);
  };

  const handleConfirmDeleteTodo = () => {
    setTodos(todos.filter((todo) => todo._id !== todoToDeleteId));
    setTodoToDeleteId(null);
  };

  const handleCancelDeleteTodo = () => {
    setTodoToDeleteId(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (source.droppableId === "available" && destination.droppableId === "team") {
      const employee = availableEmployees[source.index];
      const newAvailable = Array.from(availableEmployees);
      newAvailable.splice(source.index, 1);
      const newTeam = Array.from(selectedTeam);
      newTeam.splice(destination.index, 0, employee);
      setAvailableEmployees(newAvailable);
      setSelectedTeam(newTeam);
    } else if (source.droppableId === "team" && destination.droppableId === "available") {
      const employee = selectedTeam[source.index];
      const newTeam = Array.from(selectedTeam);
      newTeam.splice(source.index, 1);
      const newAvailable = Array.from(availableEmployees);
      newAvailable.splice(destination.index, 0, employee);
      setSelectedTeam(newTeam);
      setAvailableEmployees(newAvailable);
    } else if (source.droppableId === "available" && destination.droppableId === "available") {
      const newAvailable = Array.from(availableEmployees);
      const [removed] = newAvailable.splice(source.index, 1);
      newAvailable.splice(destination.index, 0, removed);
      setAvailableEmployees(newAvailable);
    } else if (source.droppableId === "team" && destination.droppableId === "team") {
      const newTeam = Array.from(selectedTeam);
      const [removed] = newTeam.splice(source.index, 1);
      newTeam.splice(destination.index, 0, removed);
      setSelectedTeam(newTeam);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!projectData.title.trim() || !projectData.description.trim() || !projectData.deadline) {
        setError("Please fill in all project details");
        return;
      }
    }
    setError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (selectedTeam.length === 0) {
      setError("Please assign at least one team member");
      return;
    }
    setLoading(true);
    setError(null);
    const finalData = {
      ...projectData,
      todos,
      teamMembers: selectedTeam.map((emp) => ({
        userId: emp.userId,
        name: emp.name,
        role: emp.role,
      })),
    };
    try {
      await onSubmit(finalData);
      handleClose();
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to finalize protocol");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setProjectData({ title: "", description: "", deadline: "", priority: "Medium" });
    setTodos([]);
    setNewTodo({ title: "", priority: "Medium", dueDate: "" });
    setSelectedTeam([]);
    setAvailableEmployees([]);
    setTodoToDeleteId(null);
    setError(null);
    onClose();
  };

  return (
    <>
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: "#fff",
          borderRadius: isMobile ? "0px" : "32px",
          maxHeight: "95vh",
          overflow: "hidden",
        },
      }}
      fullScreen={isMobile}
    >
      {/* Header */}
      <DialogTitle sx={{ py: 4, px: { xs: 3, md: 6 }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={formHeaderStyle}>
          New Project
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "#333", border: "1.5px solid #eee" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 3, md: 6 }, pb: 6, overflowY: "auto" }}>
        <CustomStepper activeStep={activeStep} />

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 4, borderRadius: "12px", border: "1px solid #fecaca", bgcolor: "#fef2f2", color: "#b91c1c" }}>
            {error}
          </Alert>
        )}

        <AnimatePresence mode="wait">
          {activeStep === 0 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Project Title"
                  name="title"
                  value={projectData.title}
                  onChange={handleProjectChange}
                  sx={inputStyle}
                />
                <TextField
                  select
                  fullWidth
                  label="Department"
                  name="description"
                  value={projectData.description}
                  onChange={handleProjectChange}
                  sx={{
                    ...inputStyle,
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                    }
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          bgcolor: "#fff",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                          mt: 1,
                          "& .MuiMenuItem-root": {
                            color: "#000",
                            fontWeight: 700,
                            "&:hover": {
                              bgcolor: "#f5f5f5"
                            }
                          }
                        }
                      }
                    }
                  }}
                >
                  {[
                    "IT",
                    "DM",
                    "Editing",
                    "Content-writing",
                    "video-production",
                    "Graphic Design",
                    "Accounts",
                    "Sales"
                  ].map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Deadline"
                    name="deadline"
                    type="date"
                    value={projectData.deadline}
                    onChange={handleProjectChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarTodayIcon sx={{ fontSize: 20, color: "#aaa" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                  <TextField
                    select
                    fullWidth
                    name="priority"
                    value={projectData.priority}
                    onChange={handleProjectChange}
                    sx={{
                      ...inputStyle,
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                      }
                    }}
                  >
                    {["Low", "Medium", "High", "Critical"].map(p => (
                      <MenuItem key={p} value={p} sx={{ fontWeight: 800 }}>
                        <Typography sx={{
                          bgcolor: alpha(PRIMARY_BLUE, 0.1),
                          color: "#00d4ff",
                          px: 1.5,
                          py: 0.2,
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: 900
                        }}>
                          {p}
                        </Typography>
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Box>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Box>
                <Typography sx={{ fontWeight: 1000, fontSize: "1.2rem", color: "#444", mb: 3 }}>Task Manager</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
                  <TextField
                    fullWidth
                    placeholder="Task Title"
                    name="title"
                    value={newTodo.title}
                    onChange={handleTodoChange}
                    sx={inputStyle}
                  />
                  <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                    <TextField
                      fullWidth
                      label="Deadline"
                      name="dueDate"
                      type="date"
                      value={newTodo.dueDate}
                      onChange={handleTodoChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <CalendarTodayIcon sx={{ fontSize: 20, color: "#aaa" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyle}
                    />
                    <TextField
                      select
                      fullWidth
                      name="priority"
                      value={newTodo.priority}
                      onChange={handleTodoChange}
                      sx={inputStyle}
                    >
                      {["Low", "Medium", "High", "Critical"].map(p => (
                        <MenuItem key={p} value={p} sx={{ fontWeight: 800 }}>
                          <Typography sx={{
                            bgcolor: alpha(PRIMARY_BLUE, 0.1),
                            color: "#00d4ff",
                            px: 1.5,
                            py: 0.2,
                            borderRadius: "4px",
                            fontSize: "0.8rem",
                            fontWeight: 900
                          }}>
                            {p}
                          </Typography>
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button
                      variant="contained"
                      onClick={handleAddTodo}
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 1000,
                        fontSize: "1.4rem",
                        bgcolor: SECONDARY_BLUE,
                        background: `linear-gradient(135deg, ${SECONDARY_BLUE} 0%, ${PRIMARY_BLUE} 100%)`,
                        height: "56px",
                        minWidth: "140px",
                        "&:hover": { transform: "translateY(-2px)" }
                      }}
                    >
                      Add +
                    </Button>
                  </Box>
                </Box>

                <Typography sx={{ color: "#777", fontWeight: 1000, fontSize: "0.85rem", mb: 2 }}>
                  Registry Backlog <Box component="span" sx={{ color: "#aaa", fontWeight: 700, fontSize: "0.75rem" }}>| {todos.length} Protocols</Box>
                </Typography>

                <Box sx={{ maxHeight: 350, overflowY: "auto", pr: 1, "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#eee", borderRadius: 2 } }}>
                  {todos.map((todo) => (
                    <Paper
                      key={todo._id}
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 2,
                        borderRadius: "12px",
                        border: "1px solid #f0f0f0",
                        display: "flex",
                        flexDirection: "column",
                        background: "#fff",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
                        position: "relative",
                        "&:hover": { borderColor: PRIMARY_BLUE }
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                        <Typography sx={{ fontWeight: 1000, color: "#222", fontSize: "1.15rem" }}>
                          {todo.title}
                        </Typography>
                        <Typography sx={{
                          bgcolor: "#fee2e2",
                          color: "#ef4444",
                          px: 1.5,
                          py: 0.3,
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: 1000
                        }}>
                          {todo.priority}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography sx={{ color: "#999", fontSize: "0.85rem", fontWeight: 700 }}>
                            Deadline <Box component="span" sx={{ color: "#555", fontWeight: 1000, ml: 1 }}>{getDaysLeft(todo.dueDate)}</Box>
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={() => handleDeleteTodo(todo._id)}
                          sx={{
                            color: "#ef4444",
                            p: 0,
                            "&:hover": { bgcolor: "transparent", color: "#dc2626" }
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 24 }} />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </motion.div>
          )}

          {activeStep === 2 && (
            <Box key="step3">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Box sx={{ display: "flex", gap: 4, minHeight: 450 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 1000, mb: 2, color: "#444", fontSize: "1.2rem" }}>Team Directory({availableEmployees.length})</Typography>
                    <Droppable droppableId="available">
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          sx={{
                            p: 2,
                            borderRadius: "16px",
                            bgcolor: "#fff",
                            border: "1.5px solid #f5f5f5",
                            height: "100%",
                            maxHeight: 450,
                            overflowY: "auto",
                            "&::-webkit-scrollbar": { width: 4 },
                            "&::-webkit-scrollbar-thumb": { bgcolor: "#eee", borderRadius: 2 }
                          }}
                        >
                          {availableEmployees.map((emp, index) => (
                            <Draggable key={emp._id} draggableId={emp._id} index={index}>
                              {(provided, snapshot) => (
                                <Paper
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={provided.draggableProps.style}
                                  sx={{
                                    p: 2,
                                    mb: 1.5,
                                    borderRadius: "12px",
                                    border: snapshot.isDragging ? `2px solid ${PRIMARY_BLUE}` : "1.5px solid #f8f8f8",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    bgcolor: "#fff",
                                    boxShadow: snapshot.isDragging ? "0 10px 30px rgba(0,0,0,0.1)" : "none",
                                    "&:hover": { borderColor: "#eee" },
                                    ...(snapshot.isDragging && { zIndex: 9999 })
                                  }}
                                >
                                  <Avatar
                                    sx={{
                                      background: SECONDARY_BLUE,
                                      fontSize: "0.8rem",
                                      fontWeight: 1000,
                                      width: 40,
                                      height: 40
                                    }}>
                                    {emp.avatar}
                                  </Avatar>
                                  <Box>
                                    <Typography sx={{ fontWeight: 1000, color: "#333", fontSize: "0.95rem" }}>{emp.name}</Typography>
                                    <Typography sx={{ fontSize: "0.75rem", color: "#999", fontWeight: 900 }}>{emp.department}</Typography>
                                  </Box>
                                </Paper>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 1000, mb: 2, color: "#444", fontSize: "1.2rem" }}>Team Members({selectedTeam.length})</Typography>
                    <Droppable droppableId="team">
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          sx={{
                            p: 2,
                            borderRadius: "16px",
                            bgcolor: "#edeff2",
                            border: "1.5px solid transparent",
                            height: "100%",
                            maxHeight: 450,
                            overflowY: "auto",
                            "&::-webkit-scrollbar": { width: 4 },
                            "&::-webkit-scrollbar-thumb": { bgcolor: "#ddd", borderRadius: 2 }
                          }}
                        >
                          {selectedTeam.map((emp, index) => (
                            <Draggable key={emp._id} draggableId={emp._id} index={index}>
                              {(provided, snapshot) => (
                                <Paper
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={provided.draggableProps.style}
                                  sx={{
                                    p: 2.5,
                                    mb: 1.5,
                                    borderRadius: "13px",
                                    border: isMobile ? "none" : (snapshot.isDragging ? `2px solid ${PRIMARY_BLUE}` : "none"),
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    bgcolor: "#d9dee6",
                                    boxShadow: snapshot.isDragging ? "0 10px 30px rgba(0,0,0,0.1)" : "none",
                                    ...(snapshot.isDragging && { zIndex: 9999 })
                                  }}
                                >
                                  <Avatar
                                    sx={{
                                      background: SECONDARY_BLUE,
                                      fontSize: "0.8rem",
                                      fontWeight: 1000,
                                      width: 40,
                                      height: 40
                                    }}>
                                    {emp.avatar}
                                  </Avatar>
                                  <Box>
                                    <Typography sx={{ fontWeight: 1000, color: "#333", fontSize: "0.95rem" }}>{emp.name}</Typography>
                                    <Typography sx={{ fontSize: "0.75rem", color: "#888", fontWeight: 1000 }}>{emp.department}</Typography>
                                  </Box>
                                </Paper>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </Box>
                </Box>
              </DragDropContext>
            </Box>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 8 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              ...navButtonStyle,
              color: "#333",
              border: "1.5px solid #eee",
              opacity: activeStep === 0 ? 0 : 1,
              "&:hover": { bgcolor: "#fdfdfd", borderColor: "#ddd" }
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === 2 ? handleSubmit : handleNext}
            disabled={loading}
            sx={{
              ...navButtonStyle,
              bgcolor: PRIMARY_BLUE,
              background: `linear-gradient(135deg, ${PRIMARY_BLUE} 0%, ${SECONDARY_BLUE} 100%)`,
              minWidth: "180px",
              boxShadow: activeStep === 2 ? `0 12px 24px ${alpha(PRIMARY_BLUE, 0.4)}` : "none"
            }}
          >
            {loading ? "Processing..." : (activeStep === 2 ? "Completed" : "Next")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
    <Dialog
      open={Boolean(todoToDeleteId)}
      onClose={handleCancelDeleteTodo}
      maxWidth="xs"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "420px",
          borderRadius: "16px",
          bgcolor: "#fff",
          color: "#000",
          mx: 2,
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "#222" }}>
        Delete Task?
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "#000", fontWeight: 600 }}>
          Are you sure you want to delete this task? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleCancelDeleteTodo}
          sx={{ textTransform: "none", fontWeight: 800, color: "#000" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmDeleteTodo}
          variant="contained"
          color="error"
          sx={{ textTransform: "none", fontWeight: 800 }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default CreateProjectDialog;