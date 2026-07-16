import React from "react";
import {
  Box,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Fade,
  Chip,
  Button,
  alpha,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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

const getReportBody = (report) => {
  if (!report) return "";
  return report.desc || report.content || report.report || report.message || "";
};

const getNextDayValue = (report) => {
  if (!report) return "—";
  const candidates = [
    report.nextDay,
    report.nextDayWork,
    report.next_day,
    report.nextday,
    report.postponedWork,
    report.postponed,
    report.postpond,
    report.followUp,
    report.plannedWork,
    report.upcomingWork,
  ];

  const matched = candidates.find((value) => value !== undefined && value !== null && `${value}`.trim() !== "");
  return matched ? `${matched}` : "—";
};

const formatDisplayDate = (dateValue) => {
  if (!dateValue) return "—";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const normalizeDepartmentValue = (value) => {
  if (!value) return "";
  const cleaned = `${value}`.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ");
  const aliases = {
    it: "information technology",
    "information technology": "information technology",
    informationtech: "information technology",
    infotech: "information technology",
    dm: "digital marketing",
    "digital marketing": "digital marketing",
    digitalmarketing: "digital marketing",
    editing: "editing",
    "content writing": "content writing",
    contentwriting: "content writing",
    "video production": "video production",
    videoproduction: "video production",
    "graphic design": "graphic design",
    graphicdesign: "graphic design",
    accounts: "accounts",
    sales: "sales",
  };
  return aliases[cleaned] || cleaned;
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
  users = [],
  departments = [],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [page, setPage] = React.useState(1);
  const PAGE_SIZE = 25;

  React.useEffect(() => {
    setPage(1);
  }, [reportDate, reportDeptFilter, users.length, reports.length]);

  const handlePrintAndSave = () => {
    const rowsMarkup = rows
      .map((row, index) => {
        const report = row.report;
        const reportText = report ? getReportBody(report) : "Leave";
        const nextDayValue = report ? getNextDayValue(report) : "—";
        return `
          <tr>
            <td>${index + 1}</td>
            <td>${(row.user?.name || row.user?.username || "Unknown employee").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
            <td>${(row.departmentValue || "General").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
            <td>${formatDisplayDate(report?.date || reportDate)}</td>
            <td>${(reportText || "Leave").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
            <td>${(nextDayValue || "—").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
          </tr>`;
      })
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Daily Activity Reports</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; vertical-align: top; }
            th { background: #f8fafc; }
            h2 { margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <h2>Daily Activity Reports</h2>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Date</th>
                <th>Daily Report</th>
                <th>Next Day</th>
              </tr>
            </thead>
            <tbody>${rowsMarkup}</tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `daily-activity-reports-${reportDate || "all"}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    window.print();
  };

  const getDepartmentLabel = (user) => {
    const directValue = [
      user?.department,
      user?.departmentName,
      user?.dept,
      user?.deptName,
      user?.departmentId,
      user?.deptId,
      user?.department_title,
    ].find((value) => value !== undefined && value !== null && `${value}`.trim() !== "");

    if (directValue) return `${directValue}`;

    const departmentMatch = departments.find((dept) => {
      const candidates = [dept?._id, dept?.id, dept?.departmentId, dept?.deptId, dept?.name, dept?.title];
      return candidates.some((value) => value && `${value}` === `${user?.departmentId || user?.deptId || ""}`);
    });

    return departmentMatch
      ? departmentMatch.title || departmentMatch.name || departmentMatch.departmentName || "General"
      : "General";
  };

  const getMatchingReport = (user) => {
    const userId = user?._id || user?.id;
    const matchingReports = (reports || []).filter((report) => {
      const reportUserId = report?.userID || report?.userId || report?.employeeId || report?.employeeID;
      const usernameMatches = report?.username && user?.name && `${report.username}`.toLowerCase() === `${user.name}`.toLowerCase();
      const userMatches = !userId || !reportUserId || `${reportUserId}` === `${userId}` || usernameMatches;

      if (!userMatches) return false;
      if (!reportDate) return true;
      return toLocalISO(report?.date) === reportDate;
    });

    if (!matchingReports.length) return null;
    return [...matchingReports].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  const rows = (users || [])
    .map((user, index) => {
      const report = getMatchingReport(user);
      const departmentValue = getDepartmentLabel(user);
      const normalizedDepartment = normalizeDeptName(departmentValue);
      const normalizedSelectedDepartment = normalizeDepartmentValue(reportDeptFilter);
      const matchesDepartment =
        reportDeptFilter === "ALL" ||
        normalizeDepartmentValue(departmentValue) === normalizedSelectedDepartment ||
        normalizeDepartmentValue(normalizedDepartment) === normalizedSelectedDepartment ||
        reportDeptFilter === departmentValue ||
        reportDeptFilter === normalizedDepartment;

      return {
        id: index + 1,
        user,
        report,
        departmentValue,
        normalizedDepartment,
        matchesDepartment,
      };
    })
    .filter((row) => row.matchesDepartment);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginatedRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <Fade in={true}>
      <Box sx={{ width: "100%" }}>
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
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.5 }}>
              Daily Activity Reports
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
              Employee-wise daily report tracker
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ width: { xs: "100%", lg: "auto" } }}
          >
            <Button
              variant="contained"
              onClick={handlePrintAndSave}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
                boxShadow: "none",
                px: 2,
                py: 1,
                whiteSpace: "nowrap",
                "&:hover": { boxShadow: "none", background: "#0f172a" },
              }}
            >
              Print / Save
            </Button>
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: "100%", sm: 180 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  background: "#fff",
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "& .MuiSelect-select": { color: "#1e293b", fontWeight: 600 },
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
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
            Showing {rows.length === 0 ? 0 : `${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, rows.length)}`} of {rows.length} records
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              sx={{ borderRadius: "999px", textTransform: "none", color: "#0f172a", borderColor: "#cbd5e1" }}
            >
              Previous
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
              disabled={currentPage === pageCount}
              sx={{ borderRadius: "999px", textTransform: "none", color: "#0f172a", borderColor: "#cbd5e1" }}
            >
              Next
            </Button>
          </Stack>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "none" }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 800, color: "#0f172a" }}>No</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#0f172a" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#0f172a" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#0f172a" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#0f172a" }}>Daily Report</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#0f172a" }}>Next Day</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, index) => {
                const report = row.report;
                const reportText = report ? getReportBody(report) : "Leave";
                const nextDayValue = report ? getNextDayValue(report) : "—";
                const departmentColor = getDeptColor(row.departmentValue) || "#64748b";
                const displayNo = (currentPage - 1) * PAGE_SIZE + index + 1;

                return (
                  <TableRow key={row.user?._id || row.user?.id || row.id} hover sx={{ backgroundColor: "#ffffff" }}>
                    <TableCell sx={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>{displayNo}</TableCell>
                    <TableCell sx={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
                      <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                        {row.user?.name || row.user?.username || "Unknown employee"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
                      <Chip
                        label={row.departmentValue || "General"}
                        size="small"
                        sx={{
                          backgroundColor: alpha(departmentColor, 0.12),
                          color: departmentColor,
                          fontWeight: 700,
                          borderRadius: "999px",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
                      <Typography sx={{ color: "#475569", fontWeight: 600 }}>
                        {formatDisplayDate(report?.date || reportDate)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
                      <Typography
                        sx={{
                          color: report ? "#334155" : "#ef4444",
                          fontWeight: report ? 600 : 700,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          lineHeight: 1.6,
                        }}
                      >
                        {reportText || "Leave"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
                      <Typography sx={{ color: "#475569", whiteSpace: "pre-wrap" }}>
                        {nextDayValue}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {rows.length === 0 && (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography sx={{ color: "#94a3b8", fontWeight: 700 }}>
              No employee records detected for this selection.
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default ReportManager;
