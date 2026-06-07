/**
 * WorkReportForm.jsx — Figma redesign.
 * Left: textarea for new report. Right: live list of submitted reports (UserReportsList inlined).
 * All API logic preserved exactly.
 */
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

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

const WorkReportForm = ({ deptId, profile, onReportSubmitted }) => {
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

  const username = profile?.name || "";
  const userId = profile?._id || profile?.id || "";

  const toast = useToast();
  const showToast = (msg, type) =>
    toast?.showToast ? toast.showToast(msg, type) : console.log(msg, type);

  /* ── Fetch reports for this user ── */
  const fetchReports = async () => {
    if (!userId) return;
    setReportsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8080/admin/reports",
        { headers: { Authorization: `${token}` } }
      );
      const userReports = res.data
        .filter((r) => r.userID === userId || r.userId === userId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setReports(userReports);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [userId]);

  /* ── Submit new report (API preserved) ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!report.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (report && deptId) {
        const reportData = {
          userID: userId,
          username,
          desc: report,
          deptId,
          type: "report",
          date: toLocalISO(new Date()),
        };
        await axios.post(
          "http://localhost:8080/admin/Daily_reports",
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
      if (onReportSubmitted) onReportSubmitted();
      fetchReports(); // refresh right panel
    } catch (error) {
      console.error("Failed to submit report", error);
      showToast("Failed to submit report", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── Edit / update ── */
  const handleEdit = (r) => {
    setEditingId(r._id || r.id);
    setEditDesc(r.desc);
  };
  const handleCancelEdit = () => { setEditingId(null); setEditDesc(""); };
  const handleUpdate = async () => {
    if (!editDesc.trim()) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/admin/update_report/${editingId}`,
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

  /* ── Delete ── */
  const handleDeleteClick = (id) => { setReportToDelete(id); setDeleteDialogOpen(true); };
  const handleDeleteCancel = () => { setDeleteDialogOpen(false); setReportToDelete(null); };
  const handleDeleteConfirm = async () => {
    if (!reportToDelete) return;
    setActionLoading(true);
    setDeleteDialogOpen(false);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/admin/delete_report/${reportToDelete}`,
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
        Daily Work Report
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
            placeholder="What did you accomplish today? Any blockers?"
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
                "&:hover": { background: "linear-gradient(135deg,#0f1f42 0%,#0a2a6e 100%)" },
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

                      {/* Actions */}
                      {isEditing ? (
                        <Stack direction="row" spacing={0.3}>
                          <IconButton
                            size="small"
                            onClick={handleUpdate}
                            disabled={actionLoading}
                            sx={{ color: "#10b981" }}
                          >
                            <CheckIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={handleCancelEdit}
                            disabled={actionLoading}
                            sx={{ color: "#ef4444" }}
                          >
                            <CloseIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={0.3}>
                          {/* <IconButton */}
                          {/* size="small" */}
                          {/* onClick={() => handleEdit(r)} */}
                          {/* disabled={actionLoading} */}
                          {/* sx={{ color: SECONDARY, opacity: 0.7 }} */}
                          {/* > */}
                          {/* <EditIcon sx={{ fontSize: 15 }} /> */}
                          {/* </IconButton> */}
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(r._id || r.id)}
                            disabled={actionLoading}
                            sx={{ color: "#ef4444", opacity: 0.75 }}
                          >
                            <DeleteIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Stack>
                      )}
                    </Box>

                    {isEditing ? (
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        autoFocus
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        sx={{
                          "& .MuiInputBase-root": {
                            fontSize: "0.82rem",
                            lineHeight: 1.6,
                            color: "#000",
                            fontWeight: 500,
                            p: 1,
                            bgcolor: "rgba(255,255,255,0.5)",
                            borderRadius: "8px",
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          color: PRIMARY,
                          fontSize: "0.83rem",
                          lineHeight: 1.6,
                          fontWeight: 500,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {r.desc}
                      </Typography>
                    )}
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>



      {/* ── Delete confirmation dialog ── */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            width: "340px",
            maxWidth: "90vw",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(24px)",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <WarningAmberIcon sx={{ color: "#f59e0b" }} />
          <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: PRIMARY }}>
            Confirm Deletion
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <DialogContentText
            sx={{ color: SECONDARY, fontWeight: 500, fontSize: "0.88rem" }}
          >
            Are you sure you want to permanently delete this report? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              fontWeight: 700,
              color: SECONDARY,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
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
              boxShadow: "0 4px 12px rgba(239,68,68,0.22)",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkReportForm;
