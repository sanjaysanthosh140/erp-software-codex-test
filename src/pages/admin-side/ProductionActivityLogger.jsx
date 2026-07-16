const API_URL = import.meta.env.VITE_API_URL;
import React, { useState, useCallback, useEffect, useMemo } from "react";
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
  TableSortLabel,
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
  border: "1px solid rgb(255, 255, 255)",
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

const getAuthToken = () =>
  localStorage.getItem("adminToken") || localStorage.getItem("token");

const ProductionActivityLogger = ({ onBack }) => {
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
    floorName: "",
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [selectedRequirementDetail, setSelectedRequirementDetail] =
    useState("");
  const [refetchKey, setRefetchKey] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterDate, setFilterDate] = useState("");

  const triggerRefetch = () => setRefetchKey((prev) => prev + 1);

  // Filter and sort entries by date
  const sortedEntries = useMemo(() => {
    let result = [...entries];

    if (filterDate) {
      result = result.filter((entry) => entry.date === filterDate);
    }

    return result.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [entries, filterDate, sortOrder]);

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
      ...(name === "category" && value !== "Floor" ? { floorName: "" } : {}),
    }));
    setError(null);
  };

  const resetForm = () => {
    setFormData({
      date: "",
      client: "",
      category: "Floor",
      floorName: "",
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

  const buildUpdatePayload = (entry) => ({
    department: entry.department || "production",
    timestamp: entry.timestamp || new Date().toISOString(),
    date: entry.date || "",
    client: entry.client || "",
    category: entry.category || "Floor",
    floorName: entry.category === "Floor" ? entry.floorName || "" : "",
    fromTime: entry.fromTime || "",
    toTime: entry.toTime || "",
    timeIn: entry.timeIn || "",
    timeOut: entry.timeOut || "",
    advance: entry.advance ?? "",
    finalAmount: entry.finalAmount ?? "",
    additionalRequirements: entry.additionalRequirements || "",
    allocatedBy: entry.allocatedBy || "",
  });

  const handleUpdateEntry = async (updatedEntry) => {
    setLoading(true);
    setError(null);

    try {
      const id = updatedEntry._id ?? updatedEntry.id;
      const res = await axios.put(
        `${API_URL}/admin/production-activitys-edits/${id}`,
        buildUpdatePayload(updatedEntry),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getAuthToken(),
          },
        },
      );

      await fetchdata_production();
      setSuccess(res.data?.message || "Entry updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update entry. Please try again.",
      );
      console.error("Update error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    let saved = false;

    if (editingEntry) {
      const updatedValues = {
        ...editingEntry,
        ...formData,
      };
      saved = await handleUpdateEntry(updatedValues);
    } else {
      saved = await handleSubmitToBackend([{ ...formData }], false);
    }

    if (!saved) return;

    setEditingId(null);
    setEditingEntry(null);
    resetForm();
    setShowForm(false);
  };

  const fetchdata_production = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/production_activity`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getAuthToken(),
          },
        },
      );
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setEntries(data);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load production activities. Please try again.",
      );
      console.error("Fetch error:", err);
      return null;
    }
  }, []);

  const handleEditClick = (entry) => {
    setEditingId(entry._id ?? entry.id);
    setEditingEntry(entry);
    setFormData({
      date: entry.date || "",
      client: entry.client || "",
      category: entry.category || "Floor",
      floorName: entry.floorName || "",
      fromTime: entry.fromTime || "",
      toTime: entry.toTime || "",
      timeIn: entry.timeIn || "",
      timeOut: entry.timeOut || "",
      advance: entry.advance ?? "",
      finalAmount: entry.finalAmount ?? "",
      additionalRequirements: entry.additionalRequirements || "",
      allocatedBy: entry.allocatedBy || "",
    });
    setError(null);
    setShowForm(true);
  };

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  // Handle Delete Entry
  const confirmDeleteEntry = async () => {
    if (!entryToDelete) return;
    const id = entryToDelete._id ?? entryToDelete.id;
    setError(null);
    setSuccess(null);
    setLoading(true);
    setDeleteDialogOpen(false);

    try {
      const res = await axios.delete(
        `${API_URL}/admin/production-activities/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getAuthToken(),
          },
        },
      );

      if (res.status === 200) {
        await fetchdata_production();
        setSuccess(
          typeof res.data === "string"
            ? res.data
            : res.data?.message || "Entry deleted successfully!",
        );
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitToBackend = async (
    entryList = entries,
    clearOnSuccess = false,
  ) => {
    if (entryList.length === 0) {
      setError("Please add at least one entry before submitting");
      return false;
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
          ...(entry.category === "Floor"
            ? { floorName: entry.floorName || "" }
            : {}),
          fromTime: entry.fromTime,
          toTime: entry.toTime,
          timeIn: entry.timeIn,
          timeOut: entry.timeOut,
          advance: entry.advance ?? "",
          finalAmount: entry.finalAmount ?? "",
          additionalRequirements: entry.additionalRequirements,
          allocatedBy: entry.allocatedBy,
        })),
      };

      const res = await axios.post(
        `${API_URL}/admin/production-activities`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getAuthToken(),
          },
        },
      );

      await fetchdata_production();

      setSuccess(
        res.data?.message ||
          `Successfully submitted ${entryList.length} entries to the backend!`,
      );
      if (clearOnSuccess) {
        setEntries([]);
      }
      setTimeout(() => setSuccess(null), 3000);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit entries. Please try again.",
      );
      console.error("Submission error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata_production();
  }, [fetchdata_production, refetchKey]);
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
            flexDirection: isTablet ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isTablet ? "stretch" : "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ textAlign: isTablet ? "center" : "left", mb: isTablet ? 1 : 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Activity records
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click Add + to open the input form, or review listed entries
              below.
            </Typography>
          </Box>
          <Box sx={{ 
            display: "flex", 
            gap: 1.5, 
            flexWrap: "wrap", 
            alignItems: "center", 
            justifyContent: isTablet ? "center" : "flex-end"
          }}>
            <Box sx={{ display: 'flex', gap: 1.5, flex: isMobile ? "1 1 100%" : "0 0 auto", justifyContent: 'center' }}>
              <TextField
                select
                size="small"
                label="Sort by Date"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                sx={{
                  ...inputFieldStyles,
                  flex: isMobile ? 1 : "none",
                  minWidth: isMobile ? "auto" : 140,
                  "& .MuiOutlinedInput-root": {
                    ...inputFieldStyles["& .MuiOutlinedInput-root"],
                    borderRadius: "999px",
                    backgroundColor: "#fff",
                  },
                }}
              >
                <MenuItem value="desc">Newest First</MenuItem>
                <MenuItem value="asc">Oldest First</MenuItem>
              </TextField>
              <TextField
                type="date"
                size="small"
                label="Filter by Date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  ...inputFieldStyles,
                  flex: isMobile ? 1 : "none",
                  minWidth: isMobile ? "auto" : 140,
                  "& .MuiOutlinedInput-root": {
                    ...inputFieldStyles["& .MuiOutlinedInput-root"],
                    borderRadius: "999px",
                    backgroundColor: "#fff",
                  },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flex: isMobile ? "1 1 100%" : "0 0 auto", justifyContent: 'center' }}>
              {filterDate && (
                <Button
                  variant="outlined"
                  onClick={() => setFilterDate("")}
                  sx={{
                    textTransform: "none",
                    borderRadius: "999px",
                    borderColor: "#ef4444",
                    color: "#ef4444",
                    px: 2,
                    py: 0.75,
                    flex: isMobile ? 1 : "none",
                    "&:hover": {
                      borderColor: "#dc2626",
                      backgroundColor: "rgba(239, 68, 68, 0.08)",
                    },
                  }}
                >
                  Clear Filter
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={() => {
                  if (onBack) {
                    onBack();
                  } else {
                    navigate("/head");
                  }
                }}
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  px: 2.5,
                  py: 1,
                  color: "#374151",
                  borderColor: "#cbd5e1",
                  backgroundColor: "#fff",
                  flex: isMobile ? 1 : "none",
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
                  px: 3,
                  py: 1,
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  flex: isMobile ? 1 : "none",
                  "&:hover": { backgroundColor: "#1d4ed8" },
                }}
              >
                {showForm ? "Hide Form" : "Add +"}
              </Button>
            </Box>
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
              margin: isMobile ? 0 : 2,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: "#0000" }}>
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
              {formData.category === "Floor" && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Floor Name"
                    name="floorName"
                    value={formData.floorName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ground Floor, 1st Floor"
                    sx={inputFieldStyles}
                    size="small"
                  />
                </Grid>
              )}
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
                color: "#ffff",
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
              disabled={loading}
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
              {loading
                ? editingEntry
                  ? "Updating..."
                  : "Adding..."
                : editingEntry
                  ? "Update Entry"
                  : "Add Entry"}
            </Button>
          </DialogActions>
        </Dialog>

        {isTablet ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
            {sortedEntries.length === 0 ? (
              <Typography sx={{ p: 4, color: "#64748b", textAlign: "center", bgcolor: "#fff", borderRadius: 2, border: "1px solid #cbd5e1" }}>
                No activity entries yet. Click Add + to create the first record.
              </Typography>
            ) : (
              sortedEntries.map((entry) => (
                <Card key={entry._id ?? entry.id} sx={{ borderRadius: 2, border: "1px solid #cbd5e1", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", bgcolor: "#fff" }}>
                  <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#2563eb", bgcolor: "rgba(37, 99, 235, 0.1)", px: 1.5, py: 0.5, borderRadius: 1 }}>
                        {entry.date}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <IconButton size="small" onClick={() => handleEditClick(entry)} sx={{ color: "#2563eb", bgcolor: "rgba(37, 99, 235, 0.05)" }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" disabled={loading} onClick={() => handleDeleteClick(entry)} sx={{ color: "#ef4444", bgcolor: "rgba(239, 68, 68, 0.05)" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#1e293b", fontSize: "1.1rem" }}>{entry.client}</Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.2 }}>Category</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>{entry.category}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.2 }}>Floor</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>{entry.category === "Floor" ? entry.floorName || "-" : "-"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.2 }}>Time (From - To)</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>{entry.fromTime || "-"} - {entry.toTime || "-"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.2 }}>In / Out</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>{entry.timeIn || "-"} / {entry.timeOut || "-"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.2 }}>Advance / Final</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>₹{entry.advance || "0"} / ₹{entry.finalAmount || "0"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.2 }}>Allocated By</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>{entry.allocatedBy || "-"}</Typography>
                      </Grid>
                    </Grid>
                    
                    {entry.additionalRequirements && (
                      <Box sx={{ mt: 1, p: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>Requirements:</Typography>
                        <Typography variant="body2" sx={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          color: "#000000"
                        }}>
                          {entry.additionalRequirements}
                        </Typography>
                        {entry.additionalRequirements.length > 50 && (
                          <Button size="small" sx={{ p: 0, minWidth: 'auto', mt: 0.5, textTransform: 'none', fontWeight: 600 }} onClick={() => handleOpenDetailDialog(entry.additionalRequirements)}>
                            Read more
                          </Button>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #cbd5e1",
              borderRadius: 2,
              overflow: "hidden",
              mb: 4,
              backgroundColor: "#fff",
              px: 0,
            }}
          >
            <TableContainer sx={{ width: "100%", maxHeight: "60vh", overflow: "auto" }}>
              <Table
                size="small"
                stickyHeader
                sx={{
                  minWidth: 1020,
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
                      "Floor Name",
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
                          backgroundColor: "#f8fafc",
                          borderBottom: "1px solid #e2e8f0",
                          py: 1.5,
                          px: 1,
                          cursor: label === "Date" ? "pointer" : "default",
                          textAlign:
                            label === "Advance" ||
                            label === "Final Amount" ||
                            label === "Allocated By"
                              ? "center"
                              : "left",
                        }}
                      >
                        {label === "Date" ? (
                          <TableSortLabel
                            active={true}
                            direction={sortOrder}
                            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                            sx={{
                              color: "#334155 !important",
                              "& .MuiTableSortLabel-icon": {
                                color: "#334155 !important",
                              },
                            }}
                          >
                            {label}
                          </TableSortLabel>
                        ) : (
                          label
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={13} sx={{ p: 4, color: "#64748b", textAlign: "center" }}>
                        No activity entries yet. Click Add + to create the first
                        record.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedEntries.map((entry) => (
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
                          {entry.category === "Floor"
                            ? entry.floorName || "-"
                            : "-"}
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
                              disabled={loading}
                              onClick={() => handleDeleteClick(entry)}
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
        )}

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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              width: { xs: "90%", sm: 400 },
              maxWidth: 420,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: "#fff", pb: 1 }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent sx={{ color: "#475569" }}>
            <Typography color="#ffff">
              Are you sure you want to delete this activity record? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                color: "#64748b",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                px: 2,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteEntry}
              variant="contained"
              color="error"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                px: 3,
                boxShadow: "none",
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Empty State */}
       
      </Box>
    </motion.div>
  );
};

export default ProductionActivityLogger;
