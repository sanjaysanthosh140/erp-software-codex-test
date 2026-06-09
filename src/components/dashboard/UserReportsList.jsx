import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  alpha,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const PRIMARY_SLATE = "#0f172a";
const SECONDARY_SLATE = "#475569";
const INDIGO_ACCENT = "#4f46e5";
const GLASS_BG = "rgba(255, 255, 255, 0.75)";
const GLASS_BORDER = "rgba(10, 15, 25, 0.08)";

const UserReportsList = ({ userId, refreshTrigger }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const toast = useToast();
  const showToast = (msg, type) => {
    if (toast && toast.showToast) toast.showToast(msg, type);
    else console.log(msg, type);
  };

  const fetchReports = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://project-management-sodtware-backend-end.onrender.com/admin/reports", {
        headers: {
          Authorization: `${token}`,
        },
      });
      // Filter reports for the current user
      const userReports = res.data.filter(
        (report) => (report.userID === userId || report.userId === userId)
      ).sort((a, b) => new Date(b.date) - new Date(a.date));

      setReports(userReports);
    } catch (err) {
      console.error("Failed to fetch reports", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [userId, refreshTrigger]);

  const handleEdit = (report) => {
    setEditingId(report._id || report.id);
    setEditDesc(report.desc);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDesc("");
  };

  const handleUpdate = async () => {
    if (!editDesc.trim()) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://project-management-sodtware-backend-end.onrender.com/admin/update_report/${editingId}`,
        { desc: editDesc },
        { headers: { Authorization: `${token}` } }
      );
      showToast("Report updated successfully", "success");
      setEditingId(null);
      fetchReports();
    } catch (err) {
      console.error("Failed to update report", err);
      showToast("Failed to update report", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setReportToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setReportToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!reportToDelete) return;
    setActionLoading(true);
    setDeleteDialogOpen(false); // Close immediately for responsive feel
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://project-management-sodtware-backend-end.onrender.com/admin/delete_report/${reportToDelete}`, {
        headers: { Authorization: `${token}` }
      });
      showToast("Report deleted successfully", "success");
      fetchReports();
    } catch (err) {
      console.error("Failed to delete report", err);
      showToast("Failed to delete report", "error");
    } finally {
      setActionLoading(false);
      setReportToDelete(null);
    }
  };

  if (loading && reports.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress size={24} sx={{ color: INDIGO_ACCENT }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <Box
            sx={{
              width: 3,
              height: 16,
              borderRadius: 1,
              bgcolor: INDIGO_ACCENT,
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontWeight: 800,
              color: PRIMARY_SLATE,
              fontSize: { xs: "0.9rem", sm: "0.95rem" },
              letterSpacing: "-0.01em",
            }}
          >
            My Recent Reports
          </Typography>
        </Box>
        <IconButton
          onClick={fetchReports}
          size="small"
          disabled={loading || actionLoading}
          sx={{ color: INDIGO_ACCENT }}
        >
          <RefreshIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2, fontSize: "0.8rem" }}>
          {error}
        </Typography>
      )}

      {reports.length === 0 && !loading ? (
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            background: "rgba(255,255,255,0.4)",
            border: `1px dashed ${GLASS_BORDER}`,
            borderRadius: "16px",
          }}
        >
          <Typography sx={{ color: SECONDARY_SLATE, fontSize: "0.85rem" }}>
            No reports submitted yet.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {reports.map((report) => {
            const isEditing = editingId === (report._id || report.id);
            return (
              <Paper
                key={report._id || report.id}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  background: GLASS_BG,
                  backdropFilter: "blur(48px) saturate(180%)",
                  border: `1px solid ${isEditing ? INDIGO_ACCENT : GLASS_BORDER}`,
                  borderRadius: "16px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: isEditing ? "none" : "translateY(-2px)",
                    boxShadow: isEditing ? "none" : "0 8px 20px -6px rgba(10,15,25,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Chip
                    label={new Date(report.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    size="small"
                    sx={{
                      background: alpha(INDIGO_ACCENT, 0.1),
                      color: INDIGO_ACCENT,
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      borderRadius: "6px",
                    }}
                  />
                  <Box>
                    {isEditing ? (
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={handleUpdate}
                          disabled={actionLoading}
                          sx={{ color: "#10b981" }}
                        >
                          <CheckIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={handleCancelEdit}
                          disabled={actionLoading}
                          sx={{ color: "#ef4444" }}
                        >
                          <CloseIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(report)}
                          disabled={actionLoading}
                          sx={{ color: SECONDARY_SLATE, opacity: 0.8 }}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(report._id || report.id)}
                          disabled={actionLoading}
                          sx={{ color: "#ef4444", opacity: 0.8 }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Stack>
                    )}
                  </Box>
                </Box>

                {isEditing ? (
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    autoFocus
                    placeholder="Enter updated report description..."
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    sx={{
                      "& .MuiInputBase-root": {
                        fontSize: { xs: "0.82rem", sm: "0.87rem" },
                        lineHeight: 1.6,
                        color: PRIMARY_SLATE,
                        fontWeight: 500,
                        p: 1,
                        bgcolor: "rgba(255,255,255,0.4)",
                        borderRadius: "8px",
                      }
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: PRIMARY_SLATE,
                      fontSize: { xs: "0.82rem", sm: "0.87rem" },
                      lineHeight: 1.6,
                      fontWeight: 500,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {report.desc}
                  </Typography>
                )}
              </Paper>
            );
          })}
        </Stack>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: GLASS_BG,
            backdropFilter: "blur(24px)",
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <WarningAmberIcon sx={{ color: "#f59e0b" }} />
          <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: PRIMARY_SLATE }}>
            Confirm Deletion
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <DialogContentText sx={{ color: SECONDARY_SLATE, fontWeight: 500, fontSize: "0.9rem" }}>
            Are you sure you want to permanently delete this report? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              fontWeight: 700,
              color: SECONDARY_SLATE,
              textTransform: "none",
              borderRadius: "10px",
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              bgcolor: "#ef4444",
              "&:hover": { bgcolor: "#dc2626" },
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 4,
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)"
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default UserReportsList;
