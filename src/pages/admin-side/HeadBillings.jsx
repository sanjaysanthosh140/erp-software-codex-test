import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Divider,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const HeadBillings = () => {
  const BASE_URL = "https://project-management-sodtware-backend-end.onrender.com";
  const navigate = useNavigate();
  const [billingEntries, setBillingEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editForm, setEditForm] = useState({
    projectName: "",
    description: "",
    department: "",
    status: "",
  });

  const statusOptions = ["completed"];

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setEditForm({
      projectName: entry.projectName || "",
      description: entry.description || "",
      department: entry.department || "",
      status: entry.status || "",
    });
    setEditDialogOpen(true);
  };

  const handleDeleteEntry = async (entry) => {
    console.log("Delete billing entry", entry);
    const id = entry._id || entry.projectId;

    try {
      const response = await axios.delete(
        `${BASE_URL}/admin/remove_account_data/${id}`,
      );
      console.log(response);
      setBillingEntries((prevEntries) =>
        prevEntries.filter(
          (item) => item._id !== id && item.projectId !== id,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditFormChange = (field) => (event) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleSaveEdit = () => {
    console.log("Save edited billing entry", selectedEntry, editForm);
    setBillingEntries((prevEntries) =>
      prevEntries.map((item) =>
        item._id === selectedEntry?._id ||
        item.projectId === selectedEntry?.projectId
          ? { ...item, ...editForm }
          : item,
      ),
    );
    setEditDialogOpen(false);
    setSelectedEntry(null);
    let pro_id = selectedEntry._id;
    axios.put(
      `${BASE_URL}/admin/update_account_billings_data/${pro_id}`,
      editForm,
    );
    // TODO: replace this with API request to persist the edited billing entry
  };

  useEffect(() => {
    const fetchBillingEntries = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/billings`);
        const backendEntries = Array.isArray(response.data)
          ? response.data
          : [];
        setBillingEntries(backendEntries);
      } catch (error) {
        console.error("Error loading billing entries:", error);
        setBillingEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingEntries();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        backgroundColor: "#f8fafc",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}
          >
            Billings
          </Typography>
          <Typography sx={{ color: "#475569", fontSize: "1rem" }}>
            Review billing entries created from the Add to Accounts flow.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Chip
            icon={<ReceiptLongIcon />}
            label={`Total Cards: ${billingEntries.length}`}
            sx={{
              height: 42,
              borderRadius: "8px",
              px: 1.2,
              bgcolor: "#e0f2fe",
              color: "#075985",
              fontWeight: 800,
              "& .MuiChip-icon": { color: "#0284c7" },
            }}
          />
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/head")}
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: "8px", height: 42 }}
          >
            Back to Head Dashboard
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            sx={{
              borderRadius: "12px",
              p: 3,
              border: "1px solid rgba(148, 163, 184, 0.18)",
              bgcolor: "#ffffff",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, color: "#0f172a" }}
            >
              Recent Billing Entries
            </Typography>

            {loading ? (
              <Box sx={{ py: 10, textAlign: "center", color: "#64748b" }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>
                  Loading billing entries...
                </Typography>
              </Box>
            ) : billingEntries.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2,
                  py: 1,
                }}
              >
                {billingEntries.map((entry, idx) => {
                  const statusColor =
                    entry.status === "completed"
                      ? "#16a34a"
                      : entry.status === "pending"
                        ? "#f59e0b"
                        : entry.status === "cancelled" ||
                            entry.status === "rejected"
                          ? "#dc2626"
                          : "#2563eb";

                  const extraFields = Object.entries(entry).filter(
                    ([key]) =>
                      ![
                        "_id",
                        "projectId",
                        "projectName",
                        "status",
                        "description",
                        "department",
                        "headId",
                      ].includes(key),
                  );

                  return (
                    <Card
                      key={`${entry._id || entry.projectId}-${idx}`}
                      elevation={0}
                      variant="outlined"
                      sx={{
                        borderRadius: "10px",
                        p: { xs: 2, md: 2.5 },
                        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
                        border: "1px solid rgba(148, 163, 184, 0.22)",
                        bgcolor: "#ffffff",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: 2,
                        }}
                      >
                        <Box sx={{ flex: "1 1 360px", minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: "1.05rem",
                              fontWeight: 800,
                              color: "#0f172a",
                            }}
                          >
                            {entry.projectName || "Unnamed Project"}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.75,
                              color: "#334155",
                              fontSize: "0.92rem",
                              lineHeight: 1.6,
                            }}
                          >
                            {entry.description || "No description provided."}
                          </Typography>
                        </Box>

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Chip
                            label={entry.department || "No department"}
                            variant="outlined"
                            sx={{
                              borderRadius: "8px",
                              color: "#334155",
                              borderColor: "rgba(148, 163, 184, 0.45)",
                              fontWeight: 700,
                              maxWidth: 180,
                            }}
                          />
                          <Chip
                            label={
                              entry.status?.replace(/_/g, " ") || "Unknown"
                            }
                            sx={{
                              backgroundColor: statusColor,
                              color: "#ffffff",
                              fontWeight: 700,
                              textTransform: "capitalize",
                              borderRadius: "8px",
                              px: 1,
                            }}
                          />
                          <Tooltip title="Edit billing entry">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditEntry(entry)}
                            >
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete billing entry">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteEntry(entry)}
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>

                      {extraFields.length > 0 && (
                        <>
                          <Divider
                            sx={{
                              my: 2,
                              borderColor: "rgba(148, 163, 184, 0.16)",
                            }}
                          />

                          <Grid
                            container
                            spacing={2}
                            sx={{ color: "#475569", fontSize: "0.9rem" }}
                          >
                            {extraFields.map(([key, value]) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={`${key}-${idx}`}
                              >
                                <Typography
                                  sx={{
                                    mb: 0.5,
                                    fontWeight: 700,
                                    color: "#0f172a",
                                  }}
                                >
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </Typography>
                                <Typography>
                                  {value === null || value === undefined
                                    ? "-"
                                    : typeof value === "object"
                                      ? JSON.stringify(value)
                                      : value}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                        </>
                      )}
                    </Card>
                  );
                })}
              </Box>
            ) : (
              <Box
                sx={{
                  py: 10,
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                <Typography sx={{ fontWeight: 700, mb: 1 }}>
                  No billing entries yet.
                </Typography>
                <Typography>
                  Submit a project through Add to Accounts and return here to
                  see the entry.
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Billing Entry</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "grid", gap: 2, pt: 1 }}>
            <TextField
              label="Project Name"
              value={editForm.projectName}
              onChange={handleEditFormChange("projectName")}
              fullWidth
            />
            <TextField
              label="Description"
              value={editForm.description}
              onChange={handleEditFormChange("description")}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Department"
              value={editForm.department}
              onChange={handleEditFormChange("department")}
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={editForm.status}
              onChange={handleEditFormChange("status")}
              fullWidth
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseEditDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HeadBillings;
