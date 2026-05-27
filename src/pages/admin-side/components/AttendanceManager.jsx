import React from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { iPhoneGlassButton } from "./SharedStyles";

const GLASS_BORDER = "rgba(10, 15, 25, 0.08)";

const toLocalISO = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (time) => {
  if (!time) return "";
  const d = new Date(time);
  if (!isNaN(d.getTime()) && (typeof time === "string" && (time.includes("T") || time.includes("Z")))) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
  }

  // Handle bare time strings like "04:16 AM" that the Render backend saves in UTC
  if (typeof time === "string" && /^\d{1,2}:\d{2}\s*(AM|PM)?/i.test(time)) {
    const match = time.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/i);
    if (match) {
      let [, hours, minutes, ampm] = match;
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);
      if (ampm) {
        if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
        if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
      }
      const tempDate = new Date();
      tempDate.setUTCHours(hours, minutes, 0, 0);
      return tempDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    }
  }

  return time;
};

const AttendanceManager = ({
  logs,
  attendanceDate,
  setAttendanceDate,
  attendanceDeptFilter,
  setAttendanceDeptFilter,
  normalizedDepartmentOptions,
  getDeptColor,
  normalizeDeptName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const filteredLogs = logs.filter((log) => {
    const matchesDate = !attendanceDate
      ? true
      : toLocalISO(log.date) === attendanceDate;

    const deptRaw = log.users?.department || "General";
    const deptNormalized = normalizeDeptName(deptRaw);
    const matchesDept =
      attendanceDeptFilter === "ALL" ||
      attendanceDeptFilter === deptRaw ||
      attendanceDeptFilter === deptNormalized;

    return matchesDate && matchesDept;
  });

  const groupedLogs = filteredLogs.reduce((acc, log) => {
    let deptRaw = log.users?.department || "General";
    let dept = normalizeDeptName(deptRaw);

    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(log);
    return acc;
  }, {});

  return (
    <Fade in={true}>
      <Box>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: { xs: "stretch", lg: "center" },
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: 1000, color: "rgba(0,0,0,0.85)", letterSpacing: "-0.025em" }}
            >
              Authentication Logs
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
              Monitoring Active Access Nodes
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ width: { xs: "100%", lg: "auto" } }}
          >
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: "100%", sm: 200 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  "& fieldset": { borderColor: "rgba(0,0,0,0.08)" },
                  "& .MuiSelect-select": {
                    color: "#000",
                    fontWeight: 800,
                  },
                },
              }}
            >
              <InputLabel>Department</InputLabel>
              <Select
                value={attendanceDeptFilter}
                label="Department"
                onChange={(e) => setAttendanceDeptFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Departments</MenuItem>
                {normalizedDepartmentOptions.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="date"
              label="Filter by Date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  "& fieldset": { borderColor: "rgba(0,0,0,0.08)" },
                  width: { xs: "100%", sm: "200px" },
                  "& .MuiInputBase-input": {
                    color: "#000",
                    fontWeight: 800,
                  }
                }
              }}
            />
            {attendanceDate && (
              <Button
                size="small"
                onClick={() => setAttendanceDate("")}
                sx={{
                  ...iPhoneGlassButton,
                  color: "#ef4444",
                  background: "rgba(244, 63, 94, 0.1)",
                  height: "40px",
                  minWidth: "80px"
                }}
              >
                Clear
              </Button>
            )}
          </Stack>
        </Box>

        {Object.entries(groupedLogs).map(([category, categoryLogs]) => (
          <Box key={category} sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 800,
                borderLeft: `4px solid ${getDeptColor(category)}`,
                pl: 2,
              }}
            >
              {category}
            </Typography>
            <TableContainer
              sx={{
                background: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                border: `1px solid ${GLASS_BORDER}`,
                boxShadow: "none",
                overflow: "hidden",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ background: "rgba(255, 255, 255, 0.4)" }}>
                    {["AGENT NODE", "TIMESTAMP", "CLUSTER", "MORNING", "EVENING"].map((head) => (
                      <TableCell
                        key={head}
                        sx={{
                          color: "rgba(0,0,0,0.45)",
                          fontWeight: 900,
                          fontSize: "0.85rem",
                          letterSpacing: "0.08em",
                          borderBottom: `1px solid ${GLASS_BORDER}`,
                          // Ensure header stays readable when it becomes sticky
                          background: "rgba(255, 255, 255, 0.55)",
                        }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryLogs.map((log) => {
                    const session = Array.isArray(log.logs) ? log.logs[0] : log;
                    const first = session?.firstnoon || session?.first;
                    const second = session?.secondnoon || session?.second;

                    const fTimeIn = formatTime(first?.timeIn);
                    const fDisplay = fTimeIn ? fTimeIn : "-";

                    const sTimeOut = formatTime(second?.timeOut);
                    const sDisplay = sTimeOut ? sTimeOut : "-";

                    return (
                      <TableRow
                        key={log._id}
                        component={motion.tr}
                        transition={{ duration: 0.2 }}
                        sx={{
                          "&:hover": { background: "rgba(255,255,255,0.4)" },
                        }}
                      >
                        <TableCell sx={{ borderBottom: `1px solid ${GLASS_BORDER}` }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                fontSize: "0.85rem",
                                fontWeight: 900,
                                background: "linear-gradient(135deg, #38bdf8, #2563eb)",
                                color: "#fff",
                              }}
                            >
                              {log.users?.name?.charAt(0) || "?"}
                            </Avatar>
                            <Typography sx={{ fontWeight: 800, color: "rgba(0,0,0,0.8)" }}>
                              {log.users?.name || "Unknown"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${GLASS_BORDER}`, color: "#64748b", fontWeight: 700 }}>
                          {toLocalISO(log.date) || "N/A"}
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${GLASS_BORDER}` }}>
                          <Chip
                            label={log.users?.department || "N/A"}
                            size="small"
                            sx={{
                              background: "rgba(56, 189, 248, 0.1)",
                              color: "#0ea5e9",
                              fontWeight: 800,
                              borderRadius: "8px",
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${GLASS_BORDER}`, fontWeight: 700, color: "rgba(0,0,0,0.7)" }}>
                          {fDisplay}
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${GLASS_BORDER}`, fontWeight: 700, color: "rgba(0,0,0,0.7)" }}>
                          {sDisplay}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        {filteredLogs.length === 0 && (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography sx={{ color: "#94a3b8", fontWeight: 700 }}>
              No authentication logs detected.
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default AttendanceManager;
