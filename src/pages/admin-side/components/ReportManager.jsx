import React from "react";
import {
  Box,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Grid,
  Fade,
  Avatar,
  alpha,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const toLocalISO = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ReportManager = ({
  reports,
  reportDate,
  setReportDate,
  reportDeptFilter,
  setReportDeptFilter,
  normalizedDepartmentOptions,
  getDeptColor,
  normalizeDeptName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const filteredReports = reports.filter((report) => {
    const matchesDate = !reportDate
      ? true
      : toLocalISO(report.date) === reportDate;

    const deptRaw = report.deptId || report.departmentId || "General";
    const deptNormalized = normalizeDeptName(deptRaw);
    const matchesDept =
      reportDeptFilter === "ALL" ||
      reportDeptFilter === deptRaw ||
      reportDeptFilter === deptNormalized;

    return matchesDate && matchesDept;
  });

  const groupedReports = filteredReports.reduce((acc, report) => {
    let deptRaw = report.deptId || report.departmentId || "General";
    let dept = normalizeDeptName(deptRaw);

    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(report);
    return acc;
  }, {});

  return (
    <Fade in={true}>
      <Box sx={{ width: "100%" }}>
        {/* Header Section */}
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
              sx={{ fontWeight: 800, color: "#1e293b", mb: 0.5 }}
            >
              Daily Activity Reports
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
              Track Activity
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ width: { xs: "100%", lg: "auto" } }}
          >
            {/* Dept Filter */}
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: "100%", sm: 180 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  background: "#fff",
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "& .MuiSelect-select": { 
                    color: "#1e293b", 
                    fontWeight: 600,
                  },
                },
              }}
            >
              <Select
                value={reportDeptFilter}
                onChange={(e) => setReportDeptFilter(e.target.value)}
                IconComponent={KeyboardArrowDownIcon}
                displayEmpty
              >
                <MenuItem value="ALL">All Departments</MenuItem>
                {normalizedDepartmentOptions.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date Picker */}
            <TextField
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              size="small"
              sx={{
                width: { xs: "100%", sm: "180px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  background: "#fff",
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "& .MuiInputBase-input": { color: "#64748b", fontWeight: 500 },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon sx={{ color: "#94a3b8", fontSize: "1rem" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Box>

        {/* Reports Content */}
        {Object.entries(groupedReports).map(([category, categoryReports]) => (
          <Box key={category} sx={{ mb: 6 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: "#1e293b",
                fontWeight: 800,
                fontSize: "1.1rem",
                borderLeft: `3px solid ${getDeptColor(category)}`,
                pl: 2,
              }}
            >
              {category}
            </Typography>
            <Grid container spacing={3}>
              {categoryReports.map((report) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={report._id || report.id}>
                  <Box
                    sx={{
                      background: "#fff",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                      border: "1px solid #f1f5f9",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                      }
                    }}
                  >
                    {/* Top Accent Bar */}
                    <Box
                      sx={{
                        height: "4px",
                        width: "100%",
                        background: getDeptColor(category),
                      }}
                    />

                    <Box sx={{ p: 2.5, flexGrow: 1 }}>
                      {/* Card Header (Avatar + Name + Date) */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            background: alpha(getDeptColor(category), 0.1),
                            color: getDeptColor(category),
                          }}
                        >
                          {(report.username || "U").charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.85rem", lineHeight: 1.2 }}>
                            {report.username || "Team Member"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>
                            {new Date(report.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Content Area */}
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 800, color: "#1e293b", mb: 1, fontSize: "0.85rem" }}
                      >
                        Daily Work Report
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#475569",
                          fontWeight: 500,
                          lineHeight: 1.6,
                          fontSize: "0.85rem",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {report.desc || report.content || "No description provided."}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        {filteredReports.length === 0 && (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography sx={{ color: "#94a3b8", fontWeight: 700 }}>
              No reports detected for this selection.
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default ReportManager;
