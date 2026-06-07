import React from "react";
import {
  Box,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  IconButton,
  Fade,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const EmployeeManager = ({
  users,
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  departmentsList,
  onAddEmployee,
  onAddHead,
  onEditUser,
  onEditPassword,
  onDeleteUser,
  isAdminView = false,
}) => {
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      isAdminView || departmentFilter === "ALL" || user.department === departmentFilter;

    const matchesRole =
      !isAdminView || departmentFilter === "ALL" || user.role === departmentFilter;

    return matchesSearch && matchesDept && matchesRole;
  });

  return (
    <Fade in={true}>
      <Box sx={{ width: "100%", background: "#fff", borderRadius: "16px", p: { xs: 2, md: 4 }, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" }}>
        {/* Header & Toolbar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", lg: "center" },
            mb: 4,
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "#1e293b", letterSpacing: "-0.025em", mb: 0.5 }}
            >
              {isAdminView ? "Heads Directory" : "Employee Directory"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
              Managing {filteredUsers.length} Team Members
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ width: { xs: "100%", lg: "auto" } }}
          >
            {/* Search Field */}
            <TextField
              placeholder="Search Records..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8", fontSize: "1.2rem" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: "100%", sm: "240px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  background: "#f8fafc",
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "& .MuiInputBase-input": { color: "#1e293b", fontWeight: 500, py: 1.2 },
                },
              }}
            />

            {/* Dept Filter */}
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: "100%", sm: 180 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  background: "#f8fafc",
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "& .MuiSelect-select": { 
                    color: "#1e293b", 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center'
                  },
                },
              }}
            >
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                IconComponent={KeyboardArrowDownIcon}
                displayEmpty
              >
                <MenuItem value="ALL">{isAdminView ? "All Roles" : "All Departments"}</MenuItem>
                {departmentsList.map((item, idx) => {
                  const label = typeof item === "string"
                    ? item
                    : item.title || item.name || item.department || item.departmentName || JSON.stringify(item);
                  const key = typeof item === "string"
                    ? item
                    : item._id || item.id || item.Dep_id || label || `dept-${idx}`;
                  return (
                    <MenuItem key={key} value={label}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                 startIcon={<AddIcon />}
                onClick={onAddEmployee}
                sx={{
                  background: "#1e40af",
                  color: "#fff",
                  borderRadius: "8px",
                  px: 2.5,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  "&:hover": { background: "#1e3a8a" },
                  boxShadow: "none"
                }}
              >
                 Employee
              </Button>
              <Button
                variant="contained"
                startIcon={<ManageAccountsIcon />}
                onClick={onAddHead}
                sx={{
                  background: "#1e40af",
                  color: "#fff",
                  borderRadius: "8px",
                  px: 2.5,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  "&:hover": { background: "#1e3a8a" },
                  boxShadow: "none"
                }}
              >
                + heads
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Table View */}
        <TableContainer
          component={Box}
          sx={{
            background: "#fff",
            maxHeight: "65vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": { background: "#e2e8f0", borderRadius: "10px" }
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Employee Details", isAdminView ? "Role" : "Department", "Access Status", "Operations"].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      background: "#fff !important",
                      color: "#64748b",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      py: 2,
                      borderBottom: "1px solid #f1f5f9",
                      textAlign: head === "Operations" ? "right" : "left",
                      pr: head === "Operations" ? 3 : 2
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user._id || user.id}
                  sx={{ "&:hover": { background: "#f8fafc" }, transition: "all 0.2s" }}
                >
                  <TableCell sx={{ borderBottom: "1px solid #f8fafc", py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          background: `linear-gradient(135deg, #0f4c81, #1e40af)`,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          borderRadius: "50%",
                        }}
                      >
                        {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.88rem" }}>
                          {user.name}{user.role || (isAdminView ? user.post : "") ? `(${user.role || user.post})` : ""}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.78rem" }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #f8fafc", color: "#475569", fontWeight: 600, fontSize: "0.85rem" }}>
                    {isAdminView ? (user.role || "Admin") : (user.department || "IT")}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #f8fafc" }}>
                    <Typography 
                      sx={{ 
                        color: user.active !== false ? "#059669" : "#dc2626", 
                        fontWeight: 600, 
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" }
                      }}
                    >
                      {user.active !== false ? "Activate" : "Deactivated"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #f8fafc", textAlign: "right", pr: 2 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => onEditUser(user)} sx={{ color: "#475569" }}>
                          <EditIcon fontSize="small" sx={{ fontSize: "1.1rem" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update Password">
                        <IconButton size="small" onClick={() => onEditPassword(user)} sx={{ color: "#f59e0b" }}>
                          <VpnKeyIcon fontSize="small" sx={{ fontSize: "1.1rem" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => onDeleteUser(user)} sx={{ color: "#dc2626" }}>
                          <DeleteIcon fontSize="small" sx={{ fontSize: "1.1rem" }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fade>
  );
};

export default EmployeeManager;
