import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const glassEffect = {
  background: "rgba(255, 255, 255, 1)",
  backdropFilter: "blur(25px) saturate(160%)",
  border: "1px solid rgba(255, 255, 255, 0.7)",
  borderRadius: "28px",
  boxShadow:
    "0 15px 45px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 1)",
  transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
  position: "relative",
  overflow: "hidden",
};

const buttonStyle = {
  background: "rgba(255, 255, 255, 1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.7)",
  borderRadius: "20px",
  color: "#1e293b",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.04)",
  transition: "all 0.4s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 1)",
    transform: "translateY(-4px)",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(255, 255, 255, 1)",
  },
};

const inputFieldStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    color: "#000000",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
  },
  "& .MuiOutlinedInput-root fieldset": {
    borderColor: "#cbd5e1",
  },
  "& .MuiOutlinedInput-input": {
    color: "#000000",
  },
  "& .MuiInputLabel-root": {
    color: "#000000",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#000000",
  },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    borderColor: "#2563eb",
  },
  // hide number input spinners
  "& input[type=number]::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
};

const ProductionActivityLogger = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    date: "",
    client: "",
    category: "Floor",
    fromTime: "",
    toTime: "",
    timeIn: "",
    timeOut: "",
    advance: "",
    finalAmount: "",
    additionalRequirements: "",
    allocatedBy: "",
  });

  // Table Data State
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRequirementDetail, setSelectedRequirementDetail] =
    useState("");

  const handleOpenDetailDialog = (detail) => {
    setSelectedRequirementDetail(detail || "-");
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedRequirementDetail("");
  };

  // Form Validation
  const validateForm = () => {
    return null; // no required fields; users can submit with empty values
  };

  // Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const resetForm = () => {
    setFormData({
      date: "",
      client: "",
      category: "Floor",
      fromTime: "",
      toTime: "",
      timeIn: "",
      timeOut: "",
      advance: "",
      finalAmount: "",
      additionalRequirements: "",
      allocatedBy: "",
    });
  };

  const handleToggleForm = () => {
    setError(null);
    setEditingId(null);
    setEditingEntry(null);
    resetForm();
    setShowForm((prev) => !prev);
  };

  const handleUpdateEntry = async (updatedEntry) => {
    console.log("handleUpdateEntry", updatedEntry);
    const nextEntries = entries.map((item) =>
      item._id === updatedEntry._id || item.id === updatedEntry.id
        ? updatedEntry
        : item,
    );

    setEntries(nextEntries);
    let id = updatedEntry._id;
    let res = await axios.put(
      `http://localhost:8080/admin/production-activitys-edits/${id}`,
      updatedEntry,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.getItem("adminToken"),
        },
      },
    );
    setSuccess("Entry updated locally. Backend edit API not called.");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSaveEntry = async () => {
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (editingEntry) {
      const updatedValues = {
        ...editingEntry,
        ...formData,
      };
      handleUpdateEntry(updatedValues);
    } else {
      const entry = { ...formData };
      await handleSubmitToBackend([entry], false);
    }

    setEditingId(null);
    setEditingEntry(null);
    resetForm();
    setShowForm(false);
  };

  const fetchdata_production = async () => {
    try {
      let res = await axios.get(
        "http://localhost:8080/admin/production_activity",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("adminToken"),
          },
        },
      );
      console.log("response", res.data);
      let data = res.data;
      setEntries(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Edit Click
  const handleEditClick = (entry) => {
    setEditingId(entry._id ?? entry.id);
    setEditingEntry(entry);
    setFormData(entry);
    // console.log("workingin on editing ", entry);
    setError(null);
    setShowForm(true);
  };

  // Handle Delete Entry
  const handleDeleteEntry = async (id) => {
    console.log(id);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.delete(
        `http://localhost:8080/admin/production-activities/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("adminToken"),
          },
        },
      );

      if (res.status === 200) {
        await fetchdata_production();
        setSuccess(res.data?.message || "Entry deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(
          res.data?.message || "Failed to delete entry. Please try again.",
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete entry. Please try again.",
      );
      console.error("Delete error:", err);
    }
  };

  // Handle Submit All to Backend
  const handleSubmitToBackend = async (
    entryList = entries,
    clearOnSuccess = false,
  ) => {
    if (entryList.length === 0) {
      setError("Please add at least one entry before submitting");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("adminId") || "current-user";
      const payload = {
        userId,
        department: "production",
        timestamp: new Date().toISOString(),
        entries: entryList.map((entry) => ({
          date: entry.date,
          client: entry.client,
          category: entry.category,
          fromTime: entry.fromTime,
          toTime: entry.toTime,
          timeIn: entry.timeIn,
          timeOut: entry.timeOut,
          advance: parseFloat(entry.advance),
          finalAmount: parseFloat(entry.finalAmount),
          additionalRequirements: entry.additionalRequirements,
          allocatedBy: entry.allocatedBy,
        })),
      };
      if (payload) {
        console.log("payload", payload);
      }
      // API call - Replace with your actual backend endpoint
      let res = await axios.post(
        "http://localhost:8080/admin/production-activities",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("adminToken"),
          },
        },
      );

      setSuccess(
        res.data?.message ||
          `Successfully submitted ${entryList.length} entries to the backend!`,
      );
      if (clearOnSuccess) {
        setEntries([]);
      }
      await fetchdata_production();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit entries. Please try again.",
      );
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata_production();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ width: "100%", px: isMobile ? 2 : 3, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Production Activity Logger
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Record daily production team activities and manage task allocations
          </Typography>
        </Box>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Activity records
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click Add + to open the input form, or review listed entries
              below.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={() => {
                window.location.href = "/head";
              }}
              sx={{
                textTransform: "none",
                borderRadius: "999px",
                px: 3,
                py: 1,
                color: "#374151",
                borderColor: "#cbd5e1",
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
                  borderColor: "#2563eb",
                },
              }}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              onClick={handleToggleForm}
              sx={{
                textTransform: "none",
                borderRadius: "999px",
                px: 4,
                py: 1,
                backgroundColor: "#2563eb",
                color: "#fff",
                "&:hover": { backgroundColor: "#1d4ed8" },
              }}
            >
              {showForm ? "Hide Form" : "Add +"}
            </Button>
          </Box>
        </Box>

        <Dialog
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setError(null);
            setEditingEntry(null);
            setEditingId(null);
          }}
          fullWidth
          maxWidth="md"
          fullScreen={isMobile}
          sx={{
            "& .MuiDialog-paper": {
              width: "100%",
              maxWidth: 860,
              margin: 16,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: "#000000" }}>
            {editingEntry
              ? "Edit activity record"
              : "Add a new activity record"}
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              p: { xs: 2, md: 3 },
              bgcolor: "#ffffff",
              color: "#000000",
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2, zIndex: 1400 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2, zIndex: 1400 }}>
                {success}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={inputFieldStyles}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Client"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  placeholder="Client name"
                  sx={inputFieldStyles}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  sx={inputFieldStyles}
                  size="small"
                >
                  <MenuItem value="Floor">Floor</MenuItem>
                  <MenuItem value="Video Production">Video Production</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <TextField
                  fullWidth
                  label="Allocated By"
                  name="allocatedBy"
                  value={formData.allocatedBy}
                  onChange={handleInputChange}
                  placeholder="Assigned by"
                  sx={inputFieldStyles}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3} md={2}>
                    <TextField
                      fullWidth
                      label="From"
                      type="time"
                      name="fromTime"
                      value={formData.fromTime}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      sx={inputFieldStyles}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3} md={2}>
                    <TextField
                      fullWidth
                      label="To"
                      type="time"
                      name="toTime"
                      value={formData.toTime}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      sx={inputFieldStyles}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={3} md={2}>
                <TextField
                  fullWidth
                  label="Time In"
                  type="time"
                  name="timeIn"
                  value={formData.timeIn}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={inputFieldStyles}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={3} md={2}>
                <TextField
                  fullWidth
                  label="Time Out"
                  type="time"
                  name="timeOut"
                  value={formData.timeOut}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={inputFieldStyles}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Advance"
                  type="number"
                  name="advance"
                  value={formData.advance}
                  onChange={handleInputChange}
                  placeholder="0"
                  sx={inputFieldStyles}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Final Amount"
                  type="number"
                  name="finalAmount"
                  value={formData.finalAmount}
                  onChange={handleInputChange}
                  placeholder="0"
                  sx={inputFieldStyles}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  fullWidth
                  label="Additional Requirements"
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleInputChange}
                  placeholder="Notes or requirements"
                  multiline
                  rows={3}
                  sx={inputFieldStyles}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, pr: 3 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setShowForm(false);
                setError(null);
                resetForm();
              }}
              sx={{
                textTransform: "none",
                borderRadius: "12px",
                borderColor: "#cbd5e1",
                color: "#374151",
                px: 2,
                py: 0.5,
                minWidth: 96,
                minHeight: 34,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveEntry}
              sx={{
                textTransform: "none",
                borderRadius: "12px",
                px: 3,
                py: 0.55,
                backgroundColor: "#2563eb",
                color: "#fff",
                minWidth: 110,
                minHeight: 34,
                "&:hover": { backgroundColor: "#1d4ed8" },
              }}
            >
              {editingEntry ? "Update Entry" : "Add Entry"}
            </Button>
          </DialogActions>
        </Dialog>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #cbd5e1",
            borderRadius: 2,
            overflow: "auto",
            mb: 4,
            backgroundColor: "#fff",
            px: 0,
          }}
        >
          <TableContainer sx={{ minWidth: 1020, width: "100%" }}>
            <Table
              size="small"
              sx={{
                borderCollapse: "collapse",
                width: "100%",
                "& td": {
                  fontSize: "0.95rem",
                },
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  {[
                    "Date",
                    "Client",
                    "Category",
                    "From",
                    "To",
                    "Time In",
                    "Time Out",
                    "Advance",
                    "Final Amount",
                    "Additional Requirements",
                    "Allocated By",
                    "Actions",
                  ].map((label) => (
                    <TableCell
                      key={label}
                      sx={{
                        fontWeight: 700,
                        color: "#334155",
                        borderBottom: "1px solid #e2e8f0",
                        py: 1.5,
                        px: 1,
                        textAlign:
                          label === "Advance" ||
                          label === "Final Amount" ||
                          label === "Allocated By"
                            ? "center"
                            : "left",
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} sx={{ p: 4, color: "#64748b" }}>
                      No activity entries yet. Click Add + to create the first
                      record.
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow
                      key={entry._id ?? entry.id}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#f8fafc" },
                      }}
                    >
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          px: 1,
                          py: 1.25,
                          color: "#000000",
                        }}
                      >
                        {entry.date}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          px: 1,
                          py: 1.25,
                          color: "#000000",
                        }}
                      >
                        {entry.client}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          px: 1,
                          py: 1.25,
                          color: "#000000",
                        }}
                      >
                        {entry.category}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          px: 1,
                          py: 1.25,
                          color: "#000000",
                        }}
                      >
                        {entry.fromTime}
                      </TableCell>
                      <TableCell
                        sx={{ 
                          borderBottom: "1px solid #e2e8f0",
                          px: 1,
                          py: 1.25,
                          color: "#000000",
                        }}
                      >
                        {entry.toTime}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          px: 1,
                          py: 1.25,
                          color: "#000000",
                        }}
                      >
                        {entry.timeIn}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          px: 1,
                          py: 1.25,
                          color: "#000000",
                        }}
                      >
                        {entry.timeOut}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          px: 1,
                          py: 1.25,
                          textAlign: "center",
                          color: "#000000",
                        }}
                      >
                        ₹{entry.advance}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          px: 1,
                          py: 1.25,
                          textAlign: "center",
                          color: "#000000",
                        }}
                      >
                        ₹{entry.finalAmount}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          px: 1,
                          py: 1.25,
                          maxWidth: 260,
                          color: "#000000",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              flex: 1,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {entry.additionalRequirements || "-"}
                          </Typography>
                          {entry.additionalRequirements &&
                          entry.additionalRequirements.length > 30 ? (
                            <Button
                              size="small"
                              onClick={() =>
                                handleOpenDetailDialog(
                                  entry.additionalRequirements,
                                )
                              }
                              sx={{
                                textTransform: "none",
                                minWidth: "auto",
                                px: 1,
                                py: 0.5,
                              }}
                            >
                              More
                            </Button>
                          ) : null}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          px: 1,
                          py: 1.25,
                          color: "#000000",
                          textAlign: "center",
                        }}
                      >
                        {entry.allocatedBy}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          px: 1,
                          py: 1.25,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(entry)}
                            sx={{
                              color: "#2563eb",
                              "&:hover": {
                                backgroundColor: "rgba(37, 99, 235, 0.1)",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDeleteEntry(entry._id ?? entry.id)
                            }
                            sx={{
                              color: "#ef4444",
                              "&:hover": {
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Submit Button  removed */}

        <Dialog
          open={detailDialogOpen}
          onClose={handleCloseDetailDialog}
          fullWidth={false}
          maxWidth="xs"
          PaperProps={{
            sx: {
              width: { xs: "90%", sm: 400 },
              maxWidth: 420,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: "#000000" }}>
            Additional Requirements
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: "#ffffff", color: "#000000" }}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {selectedRequirementDetail}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pr: 3 }}>
            <Button
              onClick={handleCloseDetailDialog}
              sx={{
                textTransform: "none",
                borderRadius: "12px",
                color: "#374151",
                px: 2,
                py: 0.5,
                minWidth: 96,
                minHeight: 34,
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Empty State */}
        {entries.length === 0 && (
          <Card
            sx={{
              ...glassEffect,
              textAlign: "center",
              py: 6,
              border: "2px dashed rgba(37, 99, 235, 0.3)",
            }}
          >
            <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
              No entries yet
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Add your first production activity entry above to get started
            </Typography>
          </Card>
        )}
      </Box>
    </motion.div>
  );
};

export default ProductionActivityLogger;
