/**
 * HeadReportForm.jsx — Head Report Submission Form
 * Similar to WorkReportForm but for Head-side report submission.
 * Submits to: /admin/reports endpoint
 */
const API_URL = impot.meta.env.VITE_API_URL;
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Stack,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  alpha,
} from "@mui/material";
import { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const PRIMARY = "#0f172a";
const SECONDARY = "#64748b";
const BORDER = "rgba(15,23,42,0.09)";
const INDIGO = "#4f46e5";

const toLocalISO = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const HeadReportForm = ({ profile }) => {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── Inline reports list state ── */
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const username = profile?.name || "";
  const userId = profile?._id || profile?.id || "";
  const headId = profile?._id || profile?.id || "";

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch reports for this head ── */
  const fetchReports = async () => {
    if (!headId) return;
    setReportsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        `${API_URL}/admin/head_reports`,
        { headers: { Authorization: `${token}` } }
      );
      // Filter for head's own reports
      
      const headReports = res.data
        // .filter((r) => r.headId === headId || r.userId === headId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setReports(headReports);
    } catch (err) {
      console.error("Failed to fetch head reports", err);
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [headId]);

  /* ── Submit new report ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!report.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (report) {
        const reportData = {
          headId,
          userId: headId,
          username,
          desc: report,
          type: "head-report",
          date: toLocalISO(new Date()),
        };
        await axios.post(
          `${API_URL}/admin/Daily_reports`,
          reportData,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(reportData);
      }
      showToast("Report submitted successfully", "success");
      setReport("");
      fetchReports();
    } catch (error) {
      console.error("Failed to submit report", error);
      showToast("Failed to submit report", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── Delete ── */
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
    setDeleteDialogOpen(false);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `${API_URL}/admin/delete_report/${reportToDelete}`,
        { headers: { Authorization: `${token}` } }
      );
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

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Toast notification */}
      {toast && (
        <Box
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            bgcolor: toast.type === "success" ? "#10b981" : "#ef4444",
            color: "#fff",
            px: 3,
            py: 2,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {toast.msg}
        </Box>
      )}

      {/* Section header */}
      <Typography
        sx={{
          fontWeight: 800,
          color: PRIMARY,
          fontSize: { xs: "1.1rem", sm: "1.2rem" },
          letterSpacing: "-0.02em",
          mb: { xs: 2, sm: 2.5 },
        }}
      >
        Head Daily Report
      </Typography>

      {/* ── Two-column layout: textarea | reports list ── */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, sm: 2.5 },
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
        }}
      >
        {/* LEFT — textarea */}
        <Box sx={{ flex: "1 1 45%", minWidth: 0 }}>
          <TextField
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            placeholder="Summarize your head duties, decisions, and strategic updates..."
            value={report}
            onChange={(e) => setReport(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: { xs: "0.83rem", sm: "0.87rem" },
                color: "#000",
                fontWeight: 500,
                bgcolor: "#fff",
                borderRadius: "12px",
                "& fieldset": { borderColor: BORDER },
                "&:hover fieldset": { borderColor: alpha(INDIGO, 0.25) },
                "&.Mui-focused fieldset": { borderColor: INDIGO },
              },
              "& .MuiOutlinedInput-input": {
                lineHeight: 1.7,
                py: 1.5,
                px: 2,
              },
              "& .MuiInputBase-input::placeholder": {
                color: alpha(SECONDARY, 0.55),
                opacity: 1,
                fontSize: "0.82rem",
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1.5 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <SendIcon sx={{ fontSize: 14 }} />
                )
              }
              sx={{
                background: "linear-gradient(135deg,#1a2d5a 0%,#0f3a8a 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.85rem",
                borderRadius: "10px",
                px: 3,
                py: 0.9,
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(15,42,100,0.25)",
                "&:hover": {
                  background: "linear-gradient(135deg,#0f1f42 0%,#0a2a6e 100%)",
                },
                "&.Mui-disabled": {
                  background: alpha(SECONDARY, 0.1),
                  color: alpha(SECONDARY, 0.3),
                },
              }}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </Box>
        </Box>

        {/* RIGHT — submitted reports */}
        <Box sx={{ flex: "1 1 45%", minWidth: 0 }}>
          {reportsLoading && reports.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={20} sx={{ color: INDIGO }} />
            </Box>
          ) : reports.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                border: `1px dashed ${BORDER}`,
                borderRadius: "12px",
                textAlign: "center",
                bgcolor: "#fff",
              }}
            >
              <Typography sx={{ color: SECONDARY, fontSize: "0.82rem" }}>
                No reports submitted yet.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1.5} sx={{ maxHeight: 340, overflowY: "auto", pr: 0.5 }}>
              {reports.map((r) => {
                const isEditing = editingId === (r._id || r.id);
                return (
                  <Paper
                    key={r._id || r.id}
                    elevation={0}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      border: `1px solid ${isEditing ? INDIGO : BORDER}`,
                      borderRadius: "12px",
                      bgcolor: "#fff",
                      transition: "box-shadow 0.18s",
                      "&:hover": {
                        boxShadow: isEditing
                          ? "none"
                          : "0 4px 16px rgba(15,23,42,0.08)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 0.8,
                      }}
                    >
                      {/* Date chip */}
                      <Chip
                        label={new Date(r.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        size="small"
                        sx={{
                          bgcolor: alpha(INDIGO, 0.08),
                          color: INDIGO,
                          fontWeight: 700,
                          fontSize: "0.68rem",
                          borderRadius: "6px",
                          height: 22,
                        }}
                      />

                      {/* Delete Action */}
                      <Stack direction="row" spacing={0.3}>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(r._id || r.id)}
                          disabled={actionLoading}
                          sx={{ color: "#ef4444", opacity: 0.75 }}
                        >
                          <DeleteIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Stack>
                    </Box>

                    {/* Report text */}
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        lineHeight: 1.6,
                        color: "#1e293b",
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      {r.desc}
                    </Typography>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Report?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this report? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={actionLoading}
            color="error"
            variant="contained"
          >
            {actionLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HeadReportForm;
